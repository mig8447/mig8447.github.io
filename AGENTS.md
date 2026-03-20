# AGENTS.md

## Blog Structure

Use this repository pattern for the recent AI posts and keep new drafts close
to it.

### Front Matter

- Use `layout: single`.
- Use a short, descriptive `title`.
- Add `date` when the post is meant for `_posts/`.
- Keep `tags`, `categories`, and `description` aligned with the article.
- Set `mermaid: true` when the post includes a decision tree or flowchart.

### Opening

- Start with a short framing paragraph that states the main decision.
- Add `<!--more-->` after the opening paragraph.

### TLDR

- Include a `## TLDR` section near the top.
- Prefer a Mermaid decision tree when the post is about choosing between
  tools, workflows, or approaches.
- Wrap Mermaid blocks with `<!-- markdownlint-disable MD013 -->` and
  `<!-- markdownlint-enable MD013 -->` when needed.
- Keep the tree short and action-oriented.
- Make the node labels answer the decision in plain language.

### Main Sections

- Follow the TLDR with sections that explain each branch of the decision.
- Use headings like `## When to use ...` or `## When to prefer ...`.
- Keep each section focused on one choice or one tradeoff.
- Add practical examples instead of abstract theory.

### Guidance Style

- Be explicit about the default choice.
- State when two approaches can work together.
- Note when a technique is a poor fit, not just when it is a good fit.
- Prefer concise prose and short lists over long paragraphs.

### Closing

- End with a short conclusion that restates the rule of thumb.
- Add a `## Resources` section when useful, especially for links to official
  docs or reference material.
- Keep reference-only links, such as `agents.md`, in the Resources section and
  label them clearly as references.
