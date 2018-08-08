#!/bin/bash

# We're sourcing a script here so that we don't pollute the
# main bash scope with variables set in here
source <( echo "$(
    # The below line should already be in your .bashrc file
    #source "$HOME"'/lib/commons.sh'
    
    # Complex processing here

    # Set SOFTWARE_HOME to the directory above the script location if unset or
    # null
    SOFTWARE_HOME="${SOFTWARE_HOME:-$( dirname "$( get_real_script_directory )" )}"

    # Apache Settings
    APACHE_HOME="$SOFTWARE_HOME"'/'"$( basename "$( get_real_script_directory ) )"
    APACHE_DOCROOT="$APACHE_HOME"'/htdocs'

    get_quoted_variable APACHE_HOME true
    get_quoted_variable APACHE_DOCROOT true
)" )
