---
name: blog-post-roast
description: Roast a blog post by running the same review prompt through Claude CLI, Gemini CLI, and Codex exec, then merge the critiques into one blunt report.
---

# Blog Post Roast Review

Use this skill when the user wants a blunt editorial pass on a draft blog post
before publishing.

## Workflow

1. Read the repo `AGENTS.md` and apply its blog guidance before reviewing the
   post.
2. Load the shared review prompt from `references/roast-post-prompt.md`.
3. Use `scripts/roast.mjs` to render the prompt, build an isolated temp review
   workspace that contains only the prompt inputs, seed writable temp auth
   homes for Gemini and Codex from the user's existing config, feed the post
   into the three review passes in parallel, and capture the raw output from
   each one.
4. Keep each raw response. Do not paraphrase until after all three runs finish.
5. Synthesize the three critiques into one report that separates consensus from
   disagreement.
6. Be blunt, specific, and useful. Do not soften real problems.

## Report Shape

- Verdict: publish, revise, or reject.
- Consensus issues: the problems all three reviewers hit.
- Model-specific notes: useful disagreements or outlier observations.
- Highest-impact fixes: the smallest set of changes that improves the post the
  most.
- Title/body fit: whether the title is justified by the article.
- Narrative check: whether the post reads as one cohesive argument or as a set
  of disconnected notes.

## Rules

- Roast the post, not the author.
- Do not rewrite the post unless the user explicitly asks for a rewrite.
- Prefer section-level feedback over line-by-line nitpicking unless a local
  problem is blocking the whole piece.
- Call out weak openings, weak transitions, repetition, unsupported claims, and
  bait-and-switch titles.
- Run the three review passes with read-only limits only. No edits, file writes,
  or repair actions are allowed during the roast.
- Clamp the reviewers to small models, medium reasoning, and narrow tool
  access. Use Claude in `haiku` with `--tools ""` and `--effort medium`,
  Gemini in `flash-lite` with `--approval-mode plan`, and Codex in
  `gpt-5.4-mini` with `model_reasoning_effort=medium`.
- Keep the reviewers inside the isolated temp workspace. The runner must not
  expose the full repository tree to any of them.
- Gemini and Codex need writable temp homes seeded from existing auth/config,
  otherwise they fail on credential or state-file writes before the review
  starts.
- Treat `AGENTS.md` as binding guidance for the critique, especially for title
  honesty, audience fit, and narrative cohesion.
- If the post is already strong, say so and explain why it works.
