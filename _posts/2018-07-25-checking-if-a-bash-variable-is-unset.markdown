---
title: "Checking if a Bash variable is unset"
date: 2018-07-25 23:37:16 -0500
excerpt_separator: "<!--more-->"
toc: true
toc_sticky: true
toc_label: "Unset $variables"
toc_icon: terminal
tags:
    - bash
    - unix
    - linux
    - gnu
    - unset
    - variable
    - test
    - check
    - tldr
    - aka
categories:
    - Linux
    - Bash
---
This post explores the differences between a null (empty) variable and an unset variable in Bash. It also contains a snippet to check whether a variable is set or not and gives you a use case so you can give it a real-world application.
<!--more-->

## TL;DR
Check if unset
```
if [[ -z "${variable+set}" ]]; then
    echo 'unset';
fi
```
Check if set
```
if [[ -n "${variable+set}" ]]; then
    echo 'set';
fi
```

## How NOT to do it
### Wrong solution number 1
You're doing it wrong

```
if [[ -z "$variable" ]]; then
    echo 'unset';
fi
```

#### Why?
According to the [conditional expressions documentation](https://www.gnu.org/software/bash/manual/bash.html#Bash-Conditional-Expressions-1), the `-z string` will "return" true if the length of the passed string (The expansion of `"$variable"` in our case) is zero. Lets analyze that statement for a second... What does `"$variable"` expands to if it is unset? Unless you have Bash's `-u` (For which I will dedicate another post) option set, the result of such expansion will be an empty string (Or a null value in Bash slang). What did `-z` "returned" when the length of the passed string was zero? True!. This means that `-z` doing its job just fine but it also means that it will "return" true even if the variable is set to an empty value.

### Wrong solution number 2
Almost! but not quite

```
if [[ -z "${variable:+set}" ]]; then
    echo 'unset';
fi
```

#### Why?
According to the [parameter expansion documentation](https://www.gnu.org/software/bash/manual/bashref.html#Shell-Parameter-Expansion-1):
> `${parameter:+word}`
> If parameter is null or unset, nothing is substituted, otherwise the expansion of word is substituted.

So yes, `"${variable:+set}"` will expand to nothing (aka an empty string, aka a null value) if parameter is unset, But it will also do it if the parameter is null!, which defeats our purpose once again.

## A null variable vs an unset variable
So why all of this? There's a fundamental thing to understand here, a null (empty) variable is NOT the same as an unset variable. The difference is basically that the empty variable is part of the environment on which I'm running my commands and an unset variable is not. 

For non-bash "speakers" a null variable is the equivalent of a variable set to an empty string in any other language, while an unset variable would be the equivalent of not declaring the variable at all. Who can tell me what happens in Java if a variable I'm using somewhere is not declared? The code won't compile!. The world isn't that black or white with Bash though (Again, except if you set the -u option in Bash), bash will gladly compare an unset variable to whatever you want, Why is it a problem? Besides what I would explain in the `-u` post, because sometimes you want to have the ability to discern if a user did not set a variable or if it was set to an empty value on purpose, in our Java example this would be comparable to have the ability to discern between a `null` object and an "empty" one, which is IMHO a fundamental ability to have.

### Look ma!, no colon
So [Wrong solution number 2](#wrong-solution-number-2) almost had it, it was making use of parameter expansion, it was making use of the `-z` operator, but it fell short in a small-but-very-important-thing: The colon `:`. If only the developer who wrote it had read a couple of lines above the [parameter expansion definitions](https://www.gnu.org/software/bash/manual/bashref.html#Shell-Parameter-Expansion-1) he would have noticed the following:
> When not performing substring expansion, using the form described below (e.g., ‘:-’), Bash tests for a parameter that is unset or null. Omitting the colon results in a test only for a parameter that is unset. Put another way, if the colon is included, the operator tests for both parameter’s existence and that its value is not null; if the colon is omitted, the operator tests only for existence.

> [...] if the colon is omitted, the operator tests only for existence.

Tada :tada:!, so the solution, is to remove the colon `:` from the [Wrong solution number 2](#wrong-solution-number-2) code, which leaves us with:

```
if [[ -z "${variable+set}" ]]; then
    echo 'unset';
fi
```

**Question for you**: Why do we have to double quote the parameter expansion? Comment in the box below, if the answer is in the first 50 comments, I'll put the answer and the name of the commenter in an edit to this post, if the answer is not there, I'll still be putting the answer in an edit. Until then... happy Bash-ing

## Use case
One of the most comon usecases for this is to see if a positional parameter in a script was set or intentionally left empty. If we're looping trough our parameters, we would want to stop at the last parameter, not at the first null one. 

## Glossary
**TL;DR**: Too Long; Didn't Read (See https://blog.oxforddictionaries.com/august-2013-update/)  
**aka**: Also Known As  
**IMHO**: In My Humble Opinion  
