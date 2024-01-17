---
title: Install Oh My Posh on Windows
description: Install Oh My Posh on Windows to customize your Powershell.
author: bart
layout: post
image: assets/images/windows/install-oh-my-posh.png
caption: This image is generated using Dall-E
prompt: Generate an image of a person sitting behind a Windows laptop staring at a terminal window in a minimalistic flat style
date: 2024-02-07
categories: [windows]
permalink: windows/install-oh-my-posh
tags: [Windows, Powershell, Oh my posh]
related: windows
related_to: [windows, powershell]
---

## Introduction

As you might have seen in my earlier [Upset](../upset/2023-12-13-introduction.md) post, I had to install my work laptop quite few times. And each time I had to look up the way I have to set up Oh My Posh.
So I decided to write a small blog post about it, mainly because I think the documentation for Oh My Posh isn't as clear as I'd like it to be.

But first things first, what is Oh My Posh?

Oh My Posh is a prompt theme for, among other things, Powershell [(Oh My Posh, n.d.)](https://ohmyposh.dev). Because I'm using macOS privately with Oh My Zsh, I'd like to use a similar tool on my Windows work laptop. Because I like using native tools, I decided that on Windows I'll be using Powershell. And, with Oh My Posh I can customize my Powershell the way I want.

## Installation

### Install the latest version of Powershell

Run the following command to install the latest Powershell from the Microsoft Store.
This will be the same Powershell version that you'd otherwise install through the Microsoft Store application that is bundled with Windows.

```pwsh
> winget install Microsoft.Powershell -s msstore
```

Next to Powershell, I also use the Windows terminal that can be installed through the Microsoft Store or `winget`.

```pwsh
> winget install Microsoft.WindowsTerminal -s msstore
```

### Install Oh My Posh

```pwsh
> winget install JanDeDobbeleer.OhMyPosh -s winget
```

Check if Oh my Posh is installed by running `oh-my-posh` in your terminal/powershell application. If it gives you an error indicating that it might not be installed, either restart your terminal/powershell application or add the result of `(Get-Command oh-my-posh).Source` to your `PATH` variable.

You can find this `PATH` variable inside the `$profile` that your Powershell instance uses. To update the `PATH` permanently, execute `notepad $profile` and update the `PATH` variable there. This will make sure that every new Powershell instance you open, will contain the same items in the `PATH`.

If you get an error message stating that the `$profile` file cannot be found, you can create this file using the following Powershell command.

```pwsh
> New-Item -Path $PROFILE -Type File -Force
```

#### Install fonts

To make sure all the themes work from Oh My Posh, you should install the required fonts.
If you haven't done this and your terminal looks off. It's quite likely that the missing fonts are the issue here.
As, unfortunately, I've had that problem myself.

You can either install the fonts for your current user or for all users on your device. If you choose to install the fonts for all users, you must open the terminal/powershell application as administrator before executing the following command.

```pwsh
> oh-my-posh font install
```

Because most themes use icons, I have installed a Nerd Font. This font includes the icons used by those themes. So, if you find yourself having issues with the icons that aren't displayed, this might be the culprit.

I've noticed that if I don't install these fonts as administrator, that some tools (like Rider for example) will render the icons in the font incorrectly. Therefore, I recommend running the terminal as administrator before running the aforementioned command.

### Configure the font

Now that you've installed a font, you must configure the font inside the Powershell settings. If you skip this step, you might face issues with the rendering of your theme.

Inside the Windows Terminal press the shortcut `CTRL` + `SHIFT` + `,`. This will open a json-file where the configuration is stored.

Inside this json-file, search for the `font` object located under `profiles` > `defaults`. And add the following object, or update the `face` attribute if the `font` object already exists.

```json
{
  "font":
  {
    "face": "MesloLGM Nerd Font"
  }
}
```

In the above example the `face` is set to `MesloLGM Nerd Font`, but you need to set the value to the font you've installed in the previous step.

#### Set the theme

Oh My Posh includes a lot of custom themes off the bat. These themes can be found by running the `Get-PoshThemes` CMDLet. To use the theme you like you need to update your local `.powershellrc` file or your `$profile` file for the theme to load everytime you start a new Powershell instance.

When running the `Get-PoshThemes` CMDLet, for each theme the specified file is displayed, you need to copy the file for that theme into your `.powershellrc` or `$profile` file.

Open your `$profile` file using notepad `notepad $profile` and add or alter the following line

```
oh-my-posh init pwsh --config "$env:POSH_THEMES_PATH/<FILE_OF_THE_THEME>.json" | Invoke-Expression
```

This will execute the `init` command from Oh My Posh and set the theme to the file you copied before. To see your changes you can either close the current Powershell instance and open another one, or load the altered `$profile` file into your current session by running

```pwsh
> . $PROFILE
```