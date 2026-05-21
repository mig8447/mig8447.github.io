#!/usr/bin/env node
import { cp, mkdir, mkdtemp, readFile, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';

function log_info(message) {
    console.error('INFO: ' + message);
}

function log_warn(message) {
    console.error('WARN: ' + message);
}

function log_error(message) {
    console.error('ERROR: ' + message);
}

function usage() {
    log_error('Usage: ' + process.argv[1] + ' POST_TITLE POST_AUDIENCE POST_FILE');
}

function run_command(command, args, input_text, extra_env, cwd) {
    return new Promise((resolve) => {
        const child = spawn(command, args, {
            cwd,
            stdio: ['pipe', 'pipe', 'pipe'],
            env: {
                ...process.env,
                ...extra_env,
            },
        });

        let stdout = '';
        let stderr = '';

        child.stdout.setEncoding('utf8');
        child.stderr.setEncoding('utf8');

        child.stdout.on('data', (chunk) => {
            stdout += chunk;
        });

        child.stderr.on('data', (chunk) => {
            stderr += chunk;
        });

        child.on('error', (error) => {
            resolve({
                code: 1,
                error: error.message,
                stdout,
                stderr,
            });
        });

        child.on('close', (code) => {
            resolve({
                code: code ?? 1,
                stdout,
                stderr,
            });
        });

        if (input_text.length > 0) {
            child.stdin.end(input_text);
            return;
        }

        child.stdin.end();
    });
}

function render_prompt(template_text, review_input, agents_text) {
    return template_text
        .replace('{POST_TITLE}', review_input.title)
        .replace('{POST_AUDIENCE}', review_input.audience)
        .replace('{POST_CONTENT}', review_input.content)
        + '\n\n## AGENTS.md\n\n'
        + agents_text;
}

async function prepare_temporary_home(source_directory_name, temp_directory_name) {
    const sourceDirectory = join(process.env.HOME ?? '', source_directory_name);

    try {
        await mkdir(temp_directory_name, { recursive: true });
        await cp(sourceDirectory, temp_directory_name, { recursive: true });
        return temp_directory_name;
    } catch (error) {
        log_warn('Could not seed ' + source_directory_name + ' into a temp home: ' + error.message);
        return null;
    }
}

async function prepare_review_workspace(root_directory) {
    await mkdir(root_directory, { recursive: true });
    await Promise.all([
        cp(agentsGuidanceFile, join(root_directory, 'AGENTS.md')),
        cp(promptReferenceFile, join(root_directory, 'roast-post-prompt.md')),
        cp(postFile, join(root_directory, 'post.md')),
    ]);
}

if (process.argv.length !== 5) {
    usage();
    process.exit(1);
}

const postTitle = process.argv[2];
const postAudience = process.argv[3];
const postFile = process.argv[4];

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const skillDirectory = dirname(scriptDirectory);
const projectDirectory = execFileSync('git', ['-C', skillDirectory, 'rev-parse', '--show-toplevel'], {
    encoding: 'utf8',
}).trim();

const promptReferenceFile = join(skillDirectory, 'references', 'roast-post-prompt.md');
const agentsGuidanceFile = join(projectDirectory, 'AGENTS.md');

const [templateText, agentsText, postText] = await Promise.all([
    readFile(promptReferenceFile, 'utf8'),
    readFile(agentsGuidanceFile, 'utf8'),
    readFile(postFile, 'utf8'),
]);

const promptText = render_prompt(
    templateText,
    {
        title: postTitle,
        audience: postAudience,
        content: postText,
    },
    agentsText,
);
const workspaceClamp = [
    'You are in an isolated temporary workspace.',
    'Only AGENTS.md, roast-post-prompt.md, and post.md exist here.',
    'Do not search the repository or inspect unrelated files.',
    'Return only the requested review sections.',
].join(' ');
const reviewInputText = workspaceClamp + '\n\n' + promptText;

const geminiRootDirectory = await mkdtemp(join(tmpdir(), 'blog-post-roast-gemini-'));
const codexRootDirectory = await mkdtemp(join(tmpdir(), 'blog-post-roast-codex-'));
const reviewRootDirectory = await mkdtemp(join(tmpdir(), 'blog-post-roast-review-'));
const cleanupTargets = [];

const geminiHomeDirectory = await prepare_temporary_home('.gemini', join(geminiRootDirectory, '.gemini'));
if (geminiHomeDirectory) {
    cleanupTargets.push(geminiRootDirectory);
}

const codexHomeDirectory = await prepare_temporary_home('.codex', join(codexRootDirectory, '.codex'));
if (codexHomeDirectory) {
    cleanupTargets.push(codexRootDirectory);
}

await prepare_review_workspace(reviewRootDirectory);
cleanupTargets.push(reviewRootDirectory);

const jobs = [
    {
        name: 'CLAUDE',
        command: 'claude',
        args: ['-p', '--bare', '--tools', '', '--permission-mode', 'plan', '--effort', 'medium', '--model', 'haiku'],
        input: reviewInputText,
        cwd: reviewRootDirectory,
    },
    {
        name: 'GEMINI',
        command: 'gemini',
        args: ['--prompt', workspaceClamp, '--model', 'flash-lite', '--approval-mode', 'plan', '--output-format', 'text'],
        input: promptText,
        env: geminiHomeDirectory
            ? {
                HOME: geminiRootDirectory,
            }
            : {},
        cwd: reviewRootDirectory,
    },
    {
        name: 'CODEX',
        command: 'codex',
        args: ['exec', '--sandbox', 'read-only', '--skip-git-repo-check', '--ignore-user-config', '--ignore-rules', '--ephemeral', '--model', 'gpt-5.4-mini', '-c', 'model_reasoning_effort=medium'],
        input: reviewInputText,
        env: codexHomeDirectory
            ? {
                CODEX_HOME: codexHomeDirectory,
            }
            : {},
        cwd: reviewRootDirectory,
    },
];

const results = await Promise.all(
    jobs.map(async (job) => {
        log_info('Running ' + job.name + ' review');
        const result = await run_command(job.command, job.args, job.input, job.env ?? {}, job.cwd ?? reviewRootDirectory);

        if (result.error) {
            log_warn(job.name + ' review failed to start: ' + result.error);
        } else if (result.code !== 0) {
            log_warn(job.name + ' review exited with code ' + result.code + '.');
        }

        return {
            ...result,
            name: job.name,
        };
    }),
);

for (const result of results) {
    console.log('--- ' + result.name + ' ---');
    if (result.stdout.length > 0) {
        process.stdout.write(result.stdout);
        if (!result.stdout.endsWith('\n')) {
            process.stdout.write('\n');
        }
    }
    if (result.stderr.length > 0) {
        process.stdout.write(result.stderr);
        if (!result.stderr.endsWith('\n')) {
            process.stdout.write('\n');
        }
    }
    if (result.error) {
        process.stdout.write('Error: ' + result.error + '\n');
    }
}

for (const target of cleanupTargets) {
    await rm(target, { recursive: true, force: true });
}
