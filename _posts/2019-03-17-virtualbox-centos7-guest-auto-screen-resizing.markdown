---
title: "VirtualBox CentOS 7 Guest Auto Screen Resizing"
date: 2019-03-17 01:04:56 -0600
toc: true
toc_sticky: true
toc_label: "Table of Contents"
toc_icon: terminal
tags:
    - linux
    - virtualization
    - tldr
    - Today I Learned
categories:
    - VirtualBox
    - Linux
---
This is a short post describing how to get the screen auto-resizing working in a CentOS 7 VirtualBox guest OS
<!-- more -->

# TL;DR

1. Upgrade VirtualBox to at least 5.2.26
2. Re-install VirtualBox Guest Additions in the guest OS to match the new version
3. Reboot the guest OS
4. Enjoy

# The situation

Across the years I've installed CentOS in its different versions into VirtualBox to test new software as it allows you to have a sandbox to play with and to return to a snapshot you took (Remember to take snapshots before playing around with your machine) in case your system ends up cluttered or even broken (Been there, done that).

All of the VMs that I've used with CentOS have worked just fine except for one thing, auto-screen resizing does not work. Recently I came across an update of VirtualBox whose additions seem to have fixed the issue, there were some blogposts I read about modifying the `/etc/modprobe.d/vboxvideo.conf` file and overwriting it with `“options vboxvideo modeset=1"`, a thing which I didn't try because I didn't have the time to experiment back then, but today, just with a simple update of the Guest Additions it all started to work like a charm. Steps to install are written in the [TL;DR](#TLDR) section above.

It is worth noticing that I updated the kernel of the machine a few days ago to `kernel-3.10.0-957.5.1.el7.x86_64.rpm` but it didn't help until I upgraded VirtualBox.
