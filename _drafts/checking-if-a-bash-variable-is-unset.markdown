---
title: "Checking if a Bash variable is unset"
date: 2018-06-25 23:37:16 -0500
toc: true
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
<!--
When not performing substring expansion, using the form described below (e.g., ‘:-’), Bash tests for a parameter that is unset or null. Omitting the colon results in a test only for a parameter that is unset. Put another way, if the colon is included, the operator tests for both parameter’s existence and that its value is not null; if the colon is omitted, the operator tests only for existence.
-->
# TL;DR
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

# How NOT to do it
## Wrong solution number 1
You're doing it wrong
```
if [[ -z "$variable" ]]; then
    echo 'unset';
fi
```

### Why?
According to the [conditional expressions documentation](https://www.gnu.org/software/bash/manual/bash.html#Bash-Conditional-Expressions-1), the `-z string` will "return" true if the length of the passed string (The expansion of `"$variable"` in our case) is zero. Lets analyze that statement for a second... What does `"$variable"` expands to if it is unset? Unless you have Bash's `-u` (For which I will dedicate another post) option set, the result of such expansion will be an empty string (Or a null value in Bash slang). What did `-z` "returned" when the length of the passed string was zero? True!. This means that `-z` doing its job just fine but it also means that it will "return" true even if the variable is set to an empty value.

## Wrong solution number 2
Almost! but not quite
```
if [[ -z "${variable:+set}" ]]; then
    echo 'unset';
fi
```
### Why?
According to the [parameter expansion documentation](https://www.gnu.org/software/bash/manual/bashref.html#Shell-Parameter-Expansion-1):
> `${parameter:+word}`
> If parameter is null or unset, nothing is substituted, otherwise the expansion of word is substituted.

So yes, `"${variable:+set}"` will expand to nothing (aka an empty string, aka a null value) if parameter is unset, But it will also do it if the parameter is null!, which defeats our purpose once again.

# Difference between a set variable and a null variable
So why all of this? There's a fundamental thing to understand here, a null (empty) variable is NOT the same as an unset variable.
The difference is basically that the empty variable is part of the environment on which I'm running my commands and an unset variable is not. 

For non-bash "speakers" a null variable is the equivalent of a variable set to an empty string in any other language, while an unset variable would be the equivalent of not declaring the variable at all. 
Who can tell me what happens in Java if a variable I'm using somewhere is not declared? The code won't compile!.
The world isn't that black or white with Bash though (Again, except if you set the -u option in Bash), bash will gladly compare an unset variable to whatever you want, Why is it a problem? Because, sometimes you want to have the ability to discern if a user did not set a variable or if it was set to an empty value on purpose, in our Java example this would be comparable to have the ability to discern between a `null` object and an "empty" one, which is IMHO a fundamental ability to have.

# The Bash's `[[` Conditional Construct
https://www.gnu.org/software/bash/manual/bash.html#Conditional-Constructs-1
# Bash's parameter expansion
## The `+` expansion
## Look ma!, no colon
# Usecases

# Glossary
**TL;DR**: Too Long; Didn't Read (See https://blog.oxforddictionaries.com/august-2013-update/)
**aka**: Also Known As
**IMHO**: In My Humble Opinion
