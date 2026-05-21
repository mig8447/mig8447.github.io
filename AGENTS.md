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
- Before drafting, identify the most discerning audience that would actually
  care about the post and write for that reader first.
- Reduce the idea to one argument before writing the draft. If the claim cannot
  be stated cleanly, the post is not ready.
- Ask what the reader should think, decide, or do after finishing the post.
  That answer should shape the opening and the conclusion.
- Use titles that create curiosity and make the right reader want to open the
  post, but only if the article fully justifies the promise.
- Add a short table of contents after the opening paragraph and `<!--more-->`
  marker in every post.
- Treat title/body fit as a first-class review loop. If the title is weaker or
  broader than the draft can justify, tighten the title before polishing the
  body.
- Do not use clickbait, hype, or marketing language in the body of the post.
- Make sure the article narrative is cohesive. Each section should build on the
  one before it instead of reading like disconnected notes.
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
- During title iteration, keep the loop tight: test whether the title is
  justified by the current body before making the body more elaborate.
- Iterate next on the post content, using the repository guidance to shape the
  draft and revise it until the user is happy.
- Only generate or refine teaser and image assets after the post content has
  been reviewed and is ready for publishing.
- Treat teaser generation as a late-stage step, not part of the first content
  draft.
- Publish only after the title, content, and teaser assets are all settled.
- Do not push a post until the title, body, and teaser are agreed upon and the
  teaser assets are in place.

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
- Start Mermaid blocks with a leading `%%` comment that reads like the
  diagram: make the branch logic explicit with `if X, then Y; otherwise Z`
  wording instead of a vague prose caption.
- Write that Mermaid comment as plain prose that describes the loop in the
  same language you would use in the post body. For example: “Spec-driven
  development combines Waterfall's upfront specification with Agile's
  feedback loop. Spec-driven development describes the outcome, puts AI to
  implement code to achieve that outcome, humans review and propose changes,
  and the cycle repeats.”
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
- When building or documenting CLI tools, polish the help for agents: include
  examples, use cases, or a companion skill so the CLI stays task-oriented and
  captures the practical value that MCP would otherwise add.
- Prefer concise prose and short lists over long paragraphs.
- Open with a concrete tension, tradeoff, or decision instead of a generic
  summary.
- Prefer specific examples and operational details over abstract statements.
- Cut repetition aggressively. If a sentence only restates the thesis, remove
  it.
- Make each section earn its place by advancing the argument or giving the
  reader a practical takeaway.
- Keep the narrative moving. The opening should set up the problem, the middle
  should explain the tradeoffs, and the ending should land the rule of thumb.

### Purpose

- Treat each post as both a public essay and a durable note for future reuse.
- Optimize for readers who already understand the domain and want sharper
  judgment, not broad beginner-friendly filler.
- Write to move experienced readers into thinking, not to recite basics they
  already know unless those basics are needed to support a sharper claim.
- Publish to clarify your own thinking, but do not leave the draft in that
  private state. Shape it so a strong reader can challenge it, trust it, or use
  it.

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
- After image generation, inspect the candidate render before copying it into
  the repo. Do not assume the latest file is the right one.
- For teaser, hero, and OpenGraph assets, use `imagegen` output as the source
  of truth. Do not replace that workflow with hand-built SVGs for final post
  artwork.
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
