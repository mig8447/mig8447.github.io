# AGENTS.md

## Blog Structure

Use this repository pattern for the recent AI posts and keep new drafts close
to it.

### Blog Intake

- Before drafting a new blog post, ask for the title angle, target audience,
  and whether the tone should be blunt, polished, or marketing-heavy.
- If the title is still open, propose a few catchy options first and wait for
  selection before writing the draft.
- When source material is provided, confirm the main claim and the intended
  takeaway before writing prose.
- If the request is underspecified, ask concise follow-up questions instead of
  guessing the post direction.
- Write for the audience directly. Do not refer to the source material as a
  transcript in the published post unless the transcript itself is the topic.
- Turn source metaphors into audience-facing takeaways. Use the metaphor to
  clarify the point, not to describe the source material.
- Avoid manager-style adoption framing unless the post is explicitly about
  management. Write to the developer reading the post, not to the person trying
  to sell the tool.
- When the user provides a supporting image, use it with clear attribution only
  if it strengthens the post's argument.
- Avoid repeating the same lead-in phrase in a post. Keep openings and section
  intros varied so the writing does not feel repetitive.
- Use a phrase like `My honest take` at most once per post. Do not reuse the
  same personal lead-in across multiple sections.

### Blog Workflow

- Start from the resources and source content the user provides.
- Generate blog posts one by one. Do not start the next post until the current
  one has been drafted, reviewed, and its teaser assets are ready.
- Iterate first on the blog post titles until the direction is locked.
- Iterate next on the post content, using the repository guidance to shape the
  draft and revise it until the user is happy.
- Only generate or refine teaser and image assets after the post content has
  been reviewed and is ready for publishing.
- Treat teaser generation as a late-stage step, not part of the first content
  draft.
- Publish only after the title, content, and teaser assets are all settled.

### Front Matter

- Use `layout: single`.
- Use a short, descriptive `title`.
- Add `date` when the post is meant for `_posts/`.
- Keep `tags`, `categories`, and `description` aligned with the article.
- For AI posts, use `description` as `TITLE. SUBTITLE. DESCRIPTION` with the
  subtitle starting with an uppercase letter.
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

- Keep AI posts short, direct, and reference-backed when making claims.
- Use personal framing like “from my perspective” or “my default rule” for
  recommendations.
- Avoid universal-sounding language like “you must” unless something is truly
  mandatory.
- Be explicit about the default choice.
- State when two approaches can work together.
- Note when a technique is a poor fit, not just when it is a good fit.
- Prefer concise prose and short lists over long paragraphs.

### Pre-publish Review

- Verify factual claims before publishing.
- Check that claims stay narrow and do not overgeneralize.
- Keep provider-specific notes clearly scoped and labeled as such.
- Make sure comparisons and examples are accurate.
- Replace hard directives with preference-based wording when the point is a
  recommendation rather than a requirement.

### Closing

- End with a short conclusion that restates the rule of thumb.
- Add a `## Resources` section when useful, especially for links to official
  docs or reference material.
- Keep reference-only links, such as `agents.md`, in the Resources section and
  label them clearly as references.

### Blog Images

- Confirm the post title and subtitle before generating teaser, hero, or
  OpenGraph images.
- If the title is not locked, propose a few catchy options first and wait for
  selection before generating artwork.
- Use the `generate-blog-teaser` skill for AI post teaser, hero, and OpenGraph
  images.
- Use `prompt-ai-comparison-teaser.md` for AI-vs-AI or tool-vs-tool posts.
- Use `prompt-ai-topic-teaser.md` for single-subject AI posts such as resumes,
  how-to guides, or other topic-only articles.
- Keep the visual style consistent across the AI posts: dark matte background,
  subtle grid, warm gold sparkle system, and minimal editorial composition.
- Save both `teaser-original.png` and `teaser.jpg` next to the post assets.
- Wire `header.teaser` and `header.og_image` explicitly in the post front
  matter.
- Keep the editable source image next to the published image when practical.
- Prefer a `teaser-original.png` source and a compressed `teaser.jpg` output for
  post-specific images.
- For shared AI-section art, keep the hero and teaser image paths explicit in
  the post front matter so the article page, card view, and `og_image` stay in
  sync.
