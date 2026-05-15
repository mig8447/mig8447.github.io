---
name: generate-blog-teaser
description: Generate editorial blog teaser and hero images for posts with the OpenAI imagegen CLI, using reusable comparison and topic prompt templates for minimal 1200x627 social-preview layouts.
---

# Generate Blog Teaser Images

Use this skill when creating a teaser, hero, or OpenGraph image for a blog
post.

## Workflow

1. Decide whether the image is a comparison teaser or a single-topic teaser.
2. Load the matching prompt template:
   - `references/prompt-ai-comparison-teaser.md` for left/right comparisons
   - `references/prompt-ai-topic-teaser.md` for single-subject teasers
3. Fill in the template placeholders from the post title, subtitle, and visual
   concept.
4. Generate the image with the bundled `imagegen` CLI and a prompt that keeps
   the same dark editorial style, warm gold sparkle, and centered social-
   preview composition.
5. Save the editable original and the compressed share image next to the post
   assets.
6. Prefer `teaser-original.png` for the source and `teaser.jpg` for the
   published image unless the task asks otherwise.

## Notes

- Keep the composition minimal and technical.
- Avoid stock, glossy, or cliché AI visuals.
- If the user does not specify the concepts, infer them from the post or ask
  for the missing details.
- Use the comparison template for AI-vs-AI or tool-vs-tool posts.
- Use the topic template for single-focus posts such as resume, career, or
  how-to images.
