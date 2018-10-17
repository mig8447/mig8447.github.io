---
title: "Upgrading your Oracle Database Cloud Service to APEX 18.2.0"
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
published: false
---
This post is an upgrade guide from APEX 5.1.x to APEX 18.2.0 in an Oracle Database Cloud Service (DBCS) deployment
<!--more-->

The guide in this article was tested in a DBCS environment which met the pre-requisites depicted in it, nevertheless, configuration may vary from environment to envvironment. **Any action you take upon the information presented in this article is strictly at your own risk**, and we will not be liable for any losses and damages in connection with this article
{: .notice}

The views expressed here are my own and do not necessarily reflect the views of Oracle
{: .notice}

## Pre-requisites
This guide is intended to be followed within a DBCS deployment. Paths and some of the instructions are specific to those kinds of environments and as such, any non-DBCS environment may differ from what's depicted here
{: .notice}

- A DBCS deployment
- A local (Per-PDB) APEX 5.1.x installation. This means that APEX should not be installed at the CDB level. To check for this you can connect to your CDB using SQL Developer or your preferred SQL tool and run the following command:
  
  ```sql
  SELECT
      VERSION,
      STATUS,
      SCHEMA
  FROM
      DBA_REGISTRY
  WHERE
      COMP_ID = 'APEX';
  ```
  
  If you get no results from the above then you're good to go
- The target PDB for the upgrade should be in Read/Write mode, for the rest of this our target PDB will be called `PDB1`. To verify this is the case you can connecto to your target PDB as a DBA user and run:
  
  ```sql
  SELECT
      V$INSTANCE.STATUS,
      V$DATABASE.OPEN_MODE
  FROM
      V$INSTANCE CROSS JOIN V$DATABASE;
  ```
  
  If the output from the above contains the `OPEN` value in the `STATUS` column and the `READ WRITE` value in the `OPEN_MODE` column then you're good to go
- The APEX 18.2.0 ZIP file for the desired version. You can download it from [OTN](https://www.oracle.com/technetwork/developer-tools/apex/downloads/index.html)
- A maintenance window of approximately 20 minutes during which APEX will be down while upgrading in the target PDB





