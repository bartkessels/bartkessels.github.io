---
title: Copy to clipboard using vim bindings in Intellij
description: Copy the contents of the yank operation from vim to your clipboard when using any Intellij IDE.
author: bart
layout: post
image: assets/images/miscellaneous/copy-clipboard-vim-intellij.png
caption: This image is generated using Dall-E
prompt: Generate an image of a person using an IDE on a computer trying to copy a line of code in a minimalistic flat style
date: 2024-01-24
categories: [miscellaneous]
permalink: miscellaneous/copy-vim-to-clipboard-intellij
tags: [vim keybindings, Intellij, Jetbrains, CLion, Idea, Ryder, Windows, macOS]
related: vim
related_to: [vim, intellij]
---

Both at work and for my personal projects I use Jetbrains IDE's based on the Intellij platform, Ryder for C# and CLion for Rust and C++. To be more productive using the IDE's I like to make use of the vim-keybindings plugin. However, there was one downside for me and that was copying from vim to the local Windows clipboard. 

For macOS, I don't really find this an issue because I can still use `CMD` + `C`/`V`, but on Windows (and Linux) the `CTRL` + `C`/`V` keys are mapped to a vim command.

But one benefit of yanking directly to the clipboard is that I don't have to think about where I want to copy to or paste from. I just use `y` or `p` for both use-cases.

## Configuration

To configure this behaviour create a file called `.ideavim` in your local folder, `~`, with the following contents.

```shell
$ touch ~/.ideavimrc
$ echo "set clipboard+=unnamed" > ~/.ideavimrc
```

\* _Note_: The `~` path which directs to your home- or user-folder works on Windows, macOS and Linux.

The `.ideavimrc` file is a configuration file which is similar to the `.vimrc` file you might already know/use. The only difference is, is that the `.ideavimrc` is only applied to the vim keybindings in your intellij IDE. The benefit of this file is, that you can use it on multiple devices or for multiple Intellij IDE's [(Jetbrains, n.d.)](https://lp.jetbrains.com/ideavim). Whereas the `.vimrc` is applied to your system-wide VIvim configuration.

What the `set clipboard+=unnamed` does is, it will set the clipboard used by Intellij to unnamed, which is also the clipboard that gets synchronized with your OS clipboard.

