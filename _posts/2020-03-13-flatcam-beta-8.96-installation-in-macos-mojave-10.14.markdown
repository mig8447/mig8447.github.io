---
title: "FlatCAM beta 8.96 installation in macOS Mojave 10.14"
date: 2020-03-13 12:49:29 -0600
toc: true
toc_sticky: true
toc_label: "Table of Contents"
toc_icon: terminal
tags:
    - flatcam
    - python
    - mojave
    - macos
    - homebrew
categories:
    - Manufacturing
    - Electronics
    - FlatCAM
---
This post intends to be a guide to install FlatCAM 8.86 in macOS Mojave 10.14
<!--more-->

## My experience

I spent around 6 hours trying to install FlatCAM. I used the provided instructions in the [FlatCAM Manual - OSX Installation](http://flatcam.org/manual/installation.html#osx) document without success. Turns out that the instructions in that page are crafted for macOS Sierra, whose release date was back in 2016. Homebrew, which is the recommended tool to install the dependencies upgrades frequently and with such updates in Jan 1st of 2020, it removed Python 2 and any of its related libraries due to Python 2 End of Life. This made it difficult to get FlatCAM installed because version 8.5 is based in Python 2. After a few hours trying to force the installation of old packages in Homebrew I found the [macOS installation no longer possible](https://bitbucket.org/jpcgt/flatcam/issues/231/mac-os-installation-no-longer-possible) issue in their repository which stated that version 8.96 did support Python 3 and PyQT5 which are the versions currently (As of March 13 2020) installed by Homebrew so I decided to give it a try and came up with the following list of commands to execute.

## Installation process

Note that lines starting with `#` are comments and are not meant to be pasted in the terminal but for clarity to the reader
{: .notice--info}

```bash
# Go to our Downloads folder
cd ~/Downloads
# Update Homebrew packages' list
brew update
# Install FlatCAM depencencies Python3, PyQT5, gets and spatialindex
brew install python pyqt geos spatialindex
# Install Python 3's virtualenv. This is useful not to pollute our global libraries directory
pip3 install virtualenv
# Download FlatCAM 8.96, currently in beta
wget https://bitbucket.org/jpcgt/flatcam/downloads/FlatCAM_beta_8.96_sources.zip
# Unarchive the files
unzip FlatCAM_beta_8.96_sources.zip
# Change to the FlatCAM directory
cd FlatCAM_beta_8.96_sources
# Create a Python virtual environment
virtualenv env
# Activate the virtual environment
source env/bin/activate
# Install all Python dependencies in the virtual environment
pip3 install numpy matplotlib rtree scipy shapely simplejson lxml rasterio ezdxf svg.path freetype-py fontTools ortools vispy PyOpenGL PyQT5
# Get out of the virtual environment
deactivate

# Create a script to execute FlatCAM
cat <<'EOF' > FlatCAM
#!/bin/bash

# Make sure the Homebrew executable paths are in the PATH env variable
export PATH='/usr/local/bin:/usr/local/sbin:'"$PATH"

# Find the script's real path
script_directory="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
if real_script_path="$( readlink "$script_directory/$( basename "$0" )" )"
then
    real_script_directory="$( dirname "$real_script_path" )"
else
    # shellcheck disable=SC2034
    real_script_directory="$script_directory"
fi

exit_code=0

# Enable FlatCAM's virtual env
source "$script_directory"'/env/bin/activate'
# Execute FlatCAM, log the output to FlatCAM.log
python3 "$script_directory"'/FlatCAM.py' &> "$script_directory"'/FlatCAM.log'
# Capture the exit code
exit_code="$?"
# Disable the virtual env
deactivate
# Exit the script with the exit code returned by FlatCAM
exit "$exit_code"

EOF
# Create an AppleScript to execute the script we just created
cat <<'EOF' > FlatCAM.scpt
    set script_path to POSIX path of ((path to me as text) & "::") & "FlatCAM"
    do shell script script_path
EOF
# Compile the AppleScript into an application
osacompile -o FlatCAM.app FlatCAM.scpt
# Move up one directory (Back to ~/Downloads)
cd ..
# Move the application folder to the computer's Applications
mv FlatCAM_beta_8.96_sources /Applications/FlatCAM_beta_8.96
# Open the application from the terminal (This is not needed, you can open it double clicking the file in the Applications folder)
open /Applications/FlatCAM_beta_8.96/FlatCAM.app
```

Once you're done, a window like the following will appear:

<figure>
    <a href="/assets/images/posts/2020-03-13-flatcam-beta-8.96-installation-in-macos-mojave-10.14/001.jpg"><img src="/assets/images/posts/2020-03-13-flatcam-beta-8.96-installation-in-macos-mojave-10.14/001.jpg"></a>
    <figcaption>FlatCAM 8.86 Running in macOS Mojave</figcaption>
</figure>

## Caveats

I'm not sure why, but sometimes, when quitting the program, something fails and errors are returned. I'll have to live with it but if someone can help debug the issue that would be great

## Resources

- https://bitbucket.org/jpcgt/flatcam/src
- http://flatcam.org/manual/installation.html#osx
- https://gist.github.com/natevw/3e6fc929aff358b38c0a
- https://wolfgang.reutz.at/2017/04/25/installing-flatcam-on-macos-sierra/
- https://bitbucket.org/jpcgt/flatcam/issues/231/mac-os-installation-no-longer-possible
- https://www.cyberciti.biz/faq/mac-osx-applescript-run-shell-script/
- https://superuser.com/a/670898/968840
- https://apple.stackexchange.com/a/255593/176108
