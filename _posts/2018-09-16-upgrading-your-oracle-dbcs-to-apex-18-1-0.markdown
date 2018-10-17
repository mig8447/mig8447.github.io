---
title: "Upgrading your Oracle Database Cloud Service to APEX 18.1.0"
date: 2018-09-16 20:48:11 -0500
toc: true
toc_sticky: true
toc_label: "Table of Contents"
toc_icon: cloud
tags:
    - oracle
    - database
    - cloud
    - upgrade
    - apex
    - dbcs
categories:
    - Oracle
    - DBCS
    - APEX
---
This post is an upgrade guide from APEX 5.1.x to APEX 18.1.0 or 18.2.0 in an Oracle Database Cloud Service (DBCS) deployment
<!--more-->

The views expressed here are my own and do not necessarily reflect the views of Oracle
{: .notice}

## Pre-requisites
This guide is intended to be followed within a DBCS deployment. Paths and some of the instructions are specific to those kinds of environments and as such, any non-DBCS environment may differ from what's depicted here
{: .notice--danger}

- A DBCS deployment
- A local (Per-PDB) APEX 5.1.x installation
- The target PDB for the upgrade should be in Read/Write mode


