---
layout: single
title: "MCP vs REST vs CLI: the boring surface usually wins"
date: 2026-05-20
tags: [ai, architecture, cli, mcp, rest]
categories: [ai]
mermaid: true
description: "MCP vs REST vs CLI. The real abstraction is still the code underneath. MCP is useful, but CLI and REST remain the surfaces I trust more for most integrations."
---
Software keeps inventing new ways to talk to other software, but the core idea
has not changed: one codebase exposes the same functions through different
surfaces. The hard part is still the implementation underneath.
<!--more-->

## TLDR

Use the simplest surface that fits the job.

<!-- markdownlint-disable MD013 -->
```mermaid
flowchart TD
    Start[Do you need to script a local program?]
    Start -- Yes --> CLI[Use a CLI]
    Start -- No --> Rest[Do you need app-to-app integration?]
    Rest -- Yes --> REST[Use REST]
    Rest -- No --> MCP[Use MCP when agent-native tooling is the real need]

    CLI --> CLI1[Fast to call\nEasy to debug\nNo session to babysit]
    REST --> REST1[Best for inter-app communication\nStable contract\nShared by many clients]
    MCP --> MCP1[Good when the agent needs tools, resources, and prompts\nBut the session and server lifecycle can bite you]
```
<!-- markdownlint-enable MD013 -->

- Use a CLI when the agent is driving a local tool with rich command-line
    support.
- Use REST when the integration is between applications and the API can be
    shared.
- Use MCP when the agent needs a protocol-native tool surface and the
    operational cost is worth it.

## The pattern is old

This is not a new category of problem.

In the 1980s, software often integrated through serial links and other
device-level protocols. In the 1990s, teams moved data around with text files
and then with XML (Extensible Markup Language). XML became a W3C (World Wide Web
Consortium) Recommendation in 1998. SOAP (Simple Object Access Protocol) showed
up as a W3C Note in 2000, and Roy Fielding’s 2000 dissertation formalized REST
(Representational State Transfer) as the style that still shapes most web APIs.

So the timeline is not mysterious:

- 1998: XML is standardized.
- 2000: SOAP is published.
- 2000: REST is named and defined.
- 2020s: MCP (Model Context Protocol) shows up for AI tool use.

The surfaces change. The underlying functions do not.

That is the part people keep pretending is magical. It is not.

## What MCP actually adds

MCP standardizes how a server exposes `tools`, `resources`, and `prompts` to a
client.

That is useful. It gives AI clients a common way to discover capabilities, fetch
context, and call actions without every vendor inventing its own shape.

My problem is not the protocol idea. My problem is the operational tax.

In practice, a lot of MCP usage turns into this:

- the agent loads a client configuration,
- the client starts or connects to a server,
- the server assumes the initial state will stay valid,
- the session drifts,
- something external changes,
- and now you are restarting the agent because the tool surface got stale.

That is a fragile way to build a developer workflow.

If the MCP depends on internal network access, a temporary auth state, or any
other condition that can change during the session, it is already one failure
away from becoming annoying. Not elegant. Annoying.

## The double-server problem

Here is the part I dislike the most.

Many MCP setups do not replace the existing app surface. They sit on top of it.

So now you maintain:

- the application server, usually REST-based,
- and the MCP bridge the agent uses to reach it.

That is two surfaces to keep consistent, not one.

If the MCP server mostly forwards to REST anyway, then the new layer needs a
very strong reason to exist. Otherwise you are just adding another thing to
deploy, test, secure, and keep in sync.

I am not saying that is never worth it. I am saying the default assumption
should be that it is expensive until proven otherwise.

## Why CLIs keep winning

Models have gotten good at terminal work for a simple reason: the terminal is
direct.

A CLI is usually:

- call it,
- read the output,
- decide what to do next.

The important part is not that CLIs are stateless. Plenty of CLIs are stateful.
Docker, `systemctl`, and even tools built around Playwright can all manage real
state. The difference is that the state usually belongs to the application or
the local operator, not to the integration layer pretending to own the session.

That means the CLI can stay dumb while the real system keeps its own lifecycle.
You can call it again, inspect the output, and move on without asking a protocol
bridge to remember a fragile initialization contract for you.

That is why CLIs are such a strong fit for AI agents when the underlying
program already has a good command-line interface.

It is also why Playwright moved in this direction.

- `playwright-mcp` exposes browser automation through MCP for agent clients that
    want protocol-native tools.
- `playwright-cli` exposes common Playwright actions like recording, generating
    code, inspecting selectors, and taking screenshots through a command-line
    interface.

The CLI version is a cleaner fit for the kind of work agents do well when they
can inspect output directly and rerun commands without depending on an external
session manager to preserve state correctly.

That lines up with terminal benchmarks too. OpenAI’s GPT-5.5 release reports
82.7% on Terminal-Bench 2.0, while the same table shows 69.4% for Claude Opus
4.7 and 68.5% for Gemini 3.1 Pro. Those numbers move over time, but the point
does not: terminal competence is good enough that a CLI is often the right
default surface.

## REST still matters

REST is still the default inter-app contract for a reason.

It is stable, widely understood, and easy to share across teams and tools. It
also gives CLIs and MCP servers something solid to sit on top of when they need
to call the real application.

That is the architecture I trust more:

- the code lives in the app,
- REST exposes the app to other apps,
- CLI exposes the same logic to humans and agents on the local machine,
- MCP is an optional extra layer when an agent-specific surface actually buys
    something.

REST does not disappear because MCP exists. If anything, MCP usually depends on
REST, or on the same underlying functions that REST already reaches.

## When MCP is worth it

There are real cases where MCP is the right choice.

I would use it when:

- the tool surface is shared across a team of agents,
- the server can be run as streamable HTTP and kept stable,
- the protocol helps consolidate a lot of useful capabilities into one
    understandable interface,
- and the maintenance cost is justified by the reuse.

That last condition matters.

If the MCP server is just a thin wrapper around an app that already has a good
REST API, do not pretend you have created some new architectural category. You
have added an adapter. Adapters are fine. They are not free.

## My default rule

My default rule is blunt:

- Prefer a CLI when the tool already has a rich one.
- Prefer REST for application-to-application integration.
- Use MCP when the agent-native protocol surface is worth the extra operational
    cost.

And if the CLI help is actually good, make it even better for agents with a
skill or repo guidance instead of bolting on another server.

That avoids stale sessions, avoids duplicate surfaces, and keeps the real logic
where it belongs: in the codebase, not in the wrapper.

## Resources

- W3C XML 1.0 Recommendation, 1998: <https://www.w3.org/standards/history/xml/>
- SOAP 1.1 W3C Note, 2000: <https://www.w3.org/TR/SOAP>
- Roy Fielding dissertation on REST, 2000:
    <https://ics.uci.edu/~fielding/pubs/dissertation/fielding_dissertation.pdf>
- Model Context Protocol overview:
    <https://modelcontextprotocol.io/docs/getting-started/intro>
- MCP overview of tools, resources, and prompts:
    <https://modelcontextprotocol.io/specification/2024-11-05/basic/index>
- MCP tools: <https://modelcontextprotocol.io/docs/concepts/tools>
- MCP resources: <https://modelcontextprotocol.io/docs/concepts/resources>
- MCP prompts: <https://modelcontextprotocol.io/docs/concepts/prompts>
- Playwright MCP: <https://playwright.dev/docs/getting-started-mcp>
- Playwright CLI: <https://github.com/microsoft/playwright-cli>
- Terminal-Bench 2.0 / GPT-5.5 benchmark table:
    <https://openai.com/index/introducing-gpt-5-5/>
