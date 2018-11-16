---
title: "The Branch-When-Needed extended branching system"
date: 2018-10-15 21:01:26 +0600
toc: true
toc_label: "Table of Contents"
toc_icon: terminal
tags:
    - scm
    - svn
    - branching
    - software
    - development
categories:
    - SCM
    - SVN
---
There are many branching systems to follow out there, some of which can be found within the [SVN Best Practices](https://svn.apache.org/repos/asf/subversion/trunk/doc/user/svn-best-practices.html) article from Apache. The following is a slight modification to such article's Branch-When-Needed system.
<!--more-->

I came up with this after trying several other systems and finding ourselves with a broken trunk or with the _merging hell_. Once we implemented this system those things went away and today my team is still using it to manage our projects' source on SVN.

## Rules

Users commit their day-to-day work on `/branches/development` abiding to the following rules:

1. Work committed to `/branches/development` can be occasionally broken so that users can sabe their work even when it's not yet complete without worrying about loosing their local work
2. A single commit (change set) must not be so large so as to discourage peer-review and should include a commit message with a clear description of the changes performed
3. If the change set(s) required to complete a particular feature or fix are too big and could potentially break development, disrupting other users' day to day work, then a branch should be created and small/reviewable change sets should be committed to such branch, which must also be kept in sync with `/branches/development` so that merging the branch when the feature/fix is complete causes the least possible pain
4. Once work in development is stable and passes the tests, `/branches/development` should be merged into `/trunk`
5. /trunk must compile and pass tests at all times. Committers who violate this rule must fix trunk at their earliest and backport their changes to `/branches/development` once the problem is fixed
6. Tagging `/trunk` in a per-release basis is mandatory

## Pros

- `/trunk` is guaranteed to be stable at all times
- User's daily workflow is kept seamless within `/branches/development`

## Cons

- Merging from `/branches/development` to `/trunk` may become a hassle under rare circumstances but it's worth the peace of mind that committing everything at the end of the day and going home brings
