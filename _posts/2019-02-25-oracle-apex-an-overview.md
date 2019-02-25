---
title: "Oracle Application Express (APEX) - An Overview"
date: 2019-02-25 03:42:31 +0600
toc: true
toc_sticky: true
toc_label: "Table of Contents"
toc_icon: terminal
tags:
    - oracle
    - database
    - apex
    - overview
categories:
    - Oracle
    - APEX
---
This post intends to give an overview of Oracle Application Express (APEX) and its different components. This is the first in a series of posts about APEX
<!--more-->

The views expressed here are my own and do not necessarily reflect the views of Oracle
{: .notice}

This article is a work in progress
{: .notice--info}

Take a look at other posts in this series:

- [Oracle APEX - The Power of Interactive Reports]({{ site.baseurl }}{% link _posts/2019-02-25-oracle-apex-the-power-of-interactive-reports.md %})

## A Rapid Application Development Environment (RAD)

Oracle APEX is an application development environment that enables its users to create secure, robust, responsive, and accessible applications fast. APEX is intended to create Data-driven applications, this is, applications that require data, and therefore a Database (Specifically an Oracle Database) to work.

### Components

An *APEX Instance* is

- **Oracle Database** (Any edition, including Express Edition, from version 11g onwards)
    - **APEX Engine**: A set of PL/SQL packages, functions and procedures that interact with the APEX Schema, this engine comprises of the public PL/SQL APIs exposed to customers as well as some private ones.
    - **APEX Schema**: Database Objects that store the APEX Instance metadata, the schema exposes several views, known as the *APEX Views* for the customers to query their workspace's or application's metadata.
- **Oracle REST Data Services (ORDS)**: APEX is normally run with the help of ORDS, a REST server which acts as a middleman between the Database and APEX and which provides it with REST capabilities
- **Browser**: Any modern browser with which users will access APEX's UI and their Application's UI

## Low Code

APEX's main advantage is its *Low Code* nature, which allows its users to develop and deploy applications with little or no code. Most of development is Wizard-driven, although deep customizations can be done to both the back-end and the front-end of the application, allowing to develop a Minimum Viable Product (MVP) within hours and to improve it over time.

- No HTML, CSS, JS is required to implement a basic application
- SQL, PL/SQL are the main languages you'll be using within APEX

## Multi-tenancy

An APEX Instance is multi-tenant by nature, which means it can host a number of instance administrators in an isolated way by providing Workspaces for each of them work with. Workspaces in turn can host a multitude of individual users which can be either workspace administrators, developers or end users.

An APEX Instance structure can be simplified in the following way:

- **Workspaces**: Isolated slices of the APEX Instance which are linked to one or several Database Schemas on which the applications' data can be stored.
    - **Schemas**: Database slices on which data can be stored. Typically a schema will contain tables, packages, and other database objects which cover the application's needs
    - **Workspace Users**: Either *Administrators* (Which can modify the workspace configuration), *Developers* (Can create or modify applications), *End Users* (Can use the workspace's applications) or any combination of the three.
    - **Applications**: A set of objects that interact with the associates workspace's database schemas to provide functionality for the end-users.
        - **Pages**: A set of objects related to a particular business requirement, like *Register Users* or *Report on Monthly Sales*
            - **Regions**: A section of the page containing objects with which the user can interact. Regions can be of different types, either *Static*, *Dynamic*, *Report*, *Plug-ins*, etc.
                - **Items**: Typically form inputs on which data must be provided by the application's end users. This data could then be merged, inserted, updated or manipulated in some way by the application's logic

Although more components could be added to this list, this is the main set of components am APEX developer mist be aware of.

## Development Environment

APEX's development environment is divided into four main sections

### SQL Workshop

The functionality provided by the SQL Workshop is mainly intended for data manipulation: Data Loading, Unloading (Exporting), Querying (Via SQL), Manipulation (Either SQL or PL/SQL) among other things. Developers will spend 30 to 40% of their time in this section.

#### Object Browser

The object browser is one of the most used tools in SQL Workshop. As its name states, it let's you browse the database objects found in the workspace's associated schemas, in here you can also edit the properties of those objects and even modify the code that comprises them.

#### SQL Commands

A place where you can execute SQL or PL/SQL statements directly into the Database. This tool provides a developer with not only the basics but also with tools for performance analysis, command history recall and even a personal command library on which a developer can save custom code snippets. Bare in mind that commands that exceed the 32KB limit in size cannot be executed using this tool but in turn using the *SQL Scripts* tool in the SQL Workshop.

#### SQL Scripts

This tool serves to save an execute SQL Scripts, specially scripts longer than 32KB in size. It provides the developer with a report containing the scripts recently uploaded/ran, and each of such scripts can be edited and run into the main workspace schema.

#### Utilities

This is not particularly a tool but a set of little tools that can be used for particular purposes.

##### Data Workshop

The Data Workshop is the most important Utility from the set, it allows users to import and export data into their workspace's schemas with ease. This tool can import files in different **`<CHARACTER>` Separated Values** formats, like Comma (CSV) or Tab (TSV) Separated values, and in a special XML format that preserves the table's structure metadata, the one I recommend when exporting data from an APEX Instance to another one.

### Application Builder

The place where developers will be 60 to 70% of their time. The application builder contains several tools to import, export, list and edit applications, among other things.

Once within an application, you'll find several other application tools:

- Supporting Objects: A tool to define scripts for installing/uninstalling or upgrading the application at hand.
- Shared Components: A management tool for components shared among the application. These components include *Static Files* (Like images, JavaScript files, CSS files, among others), *Authentication Schemas* (Which define specific conditions to let users into the application), *Authorization Schemas* (Which define conditions as to what a particular group of users can or can't see)
- The Page Designer (Page Editing Tool): Whenever you click on a particular application page, you are presented with a set of four panels, one, at the left (The **Component Tree Panel**), one at the right (The **Attribute Editing Panel**), one at the bottom (The **Available Components Panel**) and one in the middle (The **Layout Editor**)

### Team Development

This section is usually underutilized, but it offers very powerful project management tools. You can log bugs, enhancements and even user feedback can get logged in here. You can manage application's development milestones and collect the different enhancements you want into a particular milestone, define deadlines and much more.

### Application Gallery

A place from which you can install pre-made applications, written by the APEX developers themselves to serve to particular purposes. These applications can be installed to be run or unlocked for development, and can even serve as examples on how to do a particular thing.
