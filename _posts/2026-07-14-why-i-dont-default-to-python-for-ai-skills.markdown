---
layout: single
title: "Why I don't default to Python for AI skills"
date: 2026-07-14
toc: true
toc_sticky: true
toc_label: "Table of Contents"
toc_icon: terminal
tags:
  - ai
  - python
  - javascript
  - software-development
  - portability
categories:
  - ai
description: "Why I don't default to Python for AI skills. Shared skills need Bash for thin glue and JavaScript/Node for repeatable work more often than Python does, because the scripting story is simpler to ship and maintain."
excerpt_separator: "<!--more-->"
header:
  teaser: /assets/images/posts/2026-07-14-why-i-dont-default-to-python-for-ai-skills/teaser.jpg
  og_image: /assets/images/posts/2026-07-14-why-i-dont-default-to-python-for-ai-skills/teaser.jpg
---
Python works well for local scripts and specialized libraries. I stop defaulting
to it for AI skills when the work has to move across machines, teams, and
operating systems, because shared skills need to survive other people's
environments as well as my own. For thin glue, I start with Bash. For the
repeatable parts that need more structure, my default is JavaScript and Node:
the scripts are readable, the syntax is familiar, typed optionally, and usually
stop at Node and npm.
<!--more-->
This is the right default even when the people running the skill are not Python
people at all.

## TLDR

- Python fits local tooling, specialist libraries, and narrow internal
  workflows.
- Shared AI skills need predictable installs, repeatable behavior, and easy
  maintenance.
- Skills are Markdown, but scripts are useful for deterministic steps and token
  savings.
- Prefer Bash for thin glue.
- Prefer JavaScript and Node for repeatable logic.
- Use Python when the ecosystem is the real reason.

## Python's useful lane

Python is productive, readable, and strong when you need specialized libraries
for data science, machine learning, scientific computing, or quick automation.

For a private script or a narrow internal tool, it is often the right call. The
author and the runtime live in the same place, so the setup cost stays small.

AI tooling also tends to reach for Python because of its machine learning roots.
That makes sense historically, but history is not a good default policy when the
skill has to be shared. When portability and repeatability matter, Bash is
enough for the thin glue, and JavaScript and Node are usually the better default
for the scripted parts that need more structure.

## What changes when a skill is shared

Once a skill needs to run on other machines, the real questions are about
distribution:

- Can someone install it without a long setup guide?
- Does it force the team to guess between `conda`, `uv`, `pip`, and `pipx`?
- Does it depend on a specific Python version or patch line?
- Does it pull in native dependencies, compilers, or platform-specific wheels?
- Does it behave the same on macOS, Linux, and Windows?
- Can the next maintainer understand it without reconstructing the original
  environment?

That is where the environment story becomes part of the product.

A skill can feel simple on the author's machine and still be expensive to
support everywhere else. In one skill-creator run, the validator failed because
the shell's Python environment was missing `yaml`/PyYAML, even though the
machine already had `uv` and Python installed. The package files were in place,
and the YAML metadata still parsed with Ruby, but the Python validator path was
still brittle enough to block the workflow. That is where I stop reaching for
Python by default.

## Skills need scripts for the repeatable parts

Skills are Markdown, and Markdown is good at describing intent, workflow, and
decision points.

Scripts belong in the parts of the skill that are deterministic:

- file transforms,
- validation,
- API calls,
- repeatable setup,
- and other steps that should behave the same way every time.

That split matters because scripts save tokens, reduce manual repetition, and
make the behavior easier to test and repeat.

My default ladder is simple:

- I default to Bash for thin glue.
- When I stay in Bash, I keep it portable by targeting Bash 3 and staying aware
  of GNU versus BSD command variants.
- When the task gets complex, I move to JavaScript and Node.

Once a skill does too much by hand, the skill file turns into a checklist
instead of a system. Scripts keep the repeatable parts honest.

## My default rule

My default rule is simple:

- Use Python when the ecosystem is the reason to use Python.
- Use Python when the skill is private, narrow, and owned by the same people
  who will maintain it.
- Use Bash for thin glue.
- Use JavaScript and Node when the skill needs to be installed, shared, and
  supported by other people.

For shared AI skills, I want Markdown for the guidance, Bash for thin glue, and
JavaScript/Node for the repeatable work. Python fits that pattern only when its
ecosystem is the main reason to accept the extra setup cost.
