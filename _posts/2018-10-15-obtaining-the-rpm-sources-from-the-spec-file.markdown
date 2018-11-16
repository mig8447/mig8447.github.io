---
title: "Obtaining the RPM sources from the spec file"
date: 2018-10-15 13:00:07 -0500
toc: true
toc_sticky: true
toc_label: "Table of Contents"
toc_icon: terminal
tags:
    - linux
    - rpm
    - development
    - tldr
    - Today I Learned
categories:
    - Linux
    - RPM
---
In this post, I'll talk about how to programatically obtain the source list from the an RPM specification (spec) file and what's the usecase for it
<!--more-->
## TL;DR
To obtain the source files from the spec file execute the following:
```bash
spectool -l -S <SPEC_FILE_PATH>
```
The above should print something like
```
Source0: <FILE_OR_URL_FOR_SOURCE0>
Source1: <FILE_OR_URL_FOR_SOURCE1>
...
SourceN: <FILE_OR_URL_FOR_SOURCEN>
```

## Why?
So if I already have the spec file, and I can read it, Why do I need this?
Fair question, but, what would you do if you want to have a dynamic spec or more so, a dynamic build script that reads the sources from the spec and downloads them or even builds them with some scripts you have available.
In summary: automation is the why.
Of course you could have something like:
```bash
grep -iE 'Source[0-9]+:' <SPEC_FILE_PATH>
```
to do it, but what if your source strings are built within the spec given certain macros?
With the above `grep` command you'd get the macros that comprise the sources, and you'd have to parse the file to find the right definition for the source file.

## Pre-requisites
In order to do this, you'd need an RPM spec file of course and you'd also need to have the `spectool` program, which is shipped within the `rpmdevtools` package, you can check if such package is installed by running:
```bash
rpm -q rpmdevtools
```
You can also check if you have `spectool` installed by executing either
```bash
which spectool
```
or
```bash
command -v spectool
```
If you don't have the program, nor the package installed , try to install the package by issuing the dollowing command (In a Red Hat based distribution)
```bash
sudo yum install rpmdevtools
```

## The solution
The `spectool`'s purpose is mainly to download the sources needed by a specfile (If they're URLs), but it can also be used to our advantage by providing the flags:

| Flag | Purpose                  |
|------|--------------------------|
| -l   | List the sources/patches |
| -S   | List only the sources    |

So our final command will end up looking like:
```bash
spectool -l -S <SPEC_FILE_PATH>
```
