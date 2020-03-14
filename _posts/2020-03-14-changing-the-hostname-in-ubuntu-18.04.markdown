---
title: "Changing the hostname in Ubuntu 18.04"
date: 2020-03-14 10:13:08 -0600
toc: true
toc_sticky: true
toc_label: "Table of Contents"
toc_icon: terminal
tags:
    - linux
    - ubuntu
    - network
    - hostname
    - tldr
    - Today I Learned
categories:
    - Linux
    - Ubuntu
    - Network
---
This is a short post describing how to change the hostname in Ubuntu 18.04
<!-- more -->

## TL;DR

Execute the following commands:

```bash
hostnamectl set-hostname <NEW_HOSTNAME>
service avahi-daemon restart
```

Replacing `<NEW_HOSTNAME>` with the new name you want for your host.

## The situation

I installed Ubuntu 18.04 in an old machine I had and it was working but then I
decided I had picked the wrong hostname at install time and wanted to change it.
I read several posts on how to do it and it turns out that since Ubuntu 16.04,
there's a command line utility called `hostnamectl` that saves you the hassle of
editing files under the `/etc` directory, which is nice BUT, there was one thing
missing.

Once I changed the hostname (See the [TL;DR](#tldr) section above) I
disconnected from SSH and tried to connect using `<NEW_HOSTNAME>.local`, and it
didn't work. Notice that these hostnames are part of the Zero-Configuration
Networking protocol (AKA Bonjour) which in Ubuntu (And also in other OSes I
guess, although I can't confirm right now) is used by a program/service
called `avahi` which comes pre-installed (That's why I could use
`<OLD_HOSTNAME>.local` in the first place). Turns out that if you change the
hostname, you have to restart the `avahi` service for it to take the new
hostname. Once that was done, I could connect to `<NEW_HOSTNAME>.local` without
any issues.
