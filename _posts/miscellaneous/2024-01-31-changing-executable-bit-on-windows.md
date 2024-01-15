---
title: Change the executable bit of file on Windows without WSL
description: When using Linux pipelines in your development process, it might happen that you need to execute a script. However, sometimes these scripts don't have the right permissions to be executed.
author: bart
layout: post
image: assets/images/miscellaneous/change-executable-bit-windows.png
caption: This image is generated using Dall-E
prompt: Generate an image of an automated pipeline that displays a warning sign on a computer screen in a minimalistic flat style
date: 2024-01-31
categories: [miscellaneous]
permalink: miscellaneous/change-executable-bit-windows
tags: [Windows, pipeline, permissions, executable, Linux, git]
related: git
related_to: [git, windows]
---

When using a Linux pipeline in your development process when you develop on a Windows system might give you error messages from time to time. Usually, at least in my experience, these are time-related issues because Windows has different naming conventions for timezone id's than Linux, for example `W. Europe Standard Time` on Windows versus `Europe/Amsterdam` on Linux.

But when you need to execute a script in your pipeline, the chances are high that you run into a `Permission denied` failure.

So, let's dive into the permissions on Unix-like systems and see where this error message comes from and how to fix this. For the purpose of having a single truth, everything in this blogpost is steered towards Linux. This might be true for other Unix-like systems, but that's not in the scope of this blogpost.

## Permissions

Before we can dive into the permissions itself, let's first find out how permissions actually work, so we understand why our solution works, and why we have this problem in the first place.

If we take a look at a post from [the Linux Foundation](https://www.linuxfoundation.org/), we see that permissions can be applied to three permission groups.

1. A user
2. A group
3. All users

The _All users_ group is a bit weird. This is used when you try to access a file or folder, and you're not the owner of the file/folder, and you're not in a group that has permissions on that file/folder. That's when you're given the permissions that are granted to the _All users_ group [(The Linux Foundation, 2022)](https://www.linuxfoundation.org/blog/blog/classic-sysadmin-understanding-linux-file-permissions).

Now that we know for which entities we can change the permissions, let's find out what permissions are available for a file. There are three permission types that we're interested in [(The Linux Foundation, 2022)](https://www.linuxfoundation.org/blog/blog/classic-sysadmin-understanding-linux-file-permissions).

1. Read
2. Write
3. Execute

These permissions are pretty self-explanatory, so I'm not going to cover them. However, the _Execute_ permission is the one that we need for our problem to be resolved.

To change the permissions of a file or folder we can use the `chmod` command. Which stands for _Change permission Mode_ [(Oracle, n.d.)](https://docs.oracle.com/cd/E86824_01/html/E54763/chmod-1.html) according to the Solaris man pages.

When using the `chmod` command we can use two operations the `+` and `-` which either adds the permission to the file, or removes the permission from the file. And if we specify the permission type, `r`, `w`, `x` we can easily update the permissions for our file to be executable by running `chmod +x <filename>` [(The Linux Foundation, 2022)](https://www.linuxfoundation.org/blog/blog/classic-sysadmin-understanding-linux-file-permissions).

## Using Git

However, if you're using Windows to develop your application you don't have access to the `chmod` command. At least not native, you can either use git bash or WSL, but I'd rather use the native tools that are already there instead of going the WSL route.

If we check out the [documentation for Git](https://git-scm.com/docs/git-add) we see that the `add` command has a flag called `chmod` which accepts the same `+` and `-` operations as the `chmod` command itself. However, it can only be used to change the executable bit of the file. As the documentation states

> Override the executable bit of the added files. The executable bit is only changed in the index, the files on disk are left unchanged.
> * [(Git, n.d.)](https://git-scm.com/docs/git-add#Documentation/git-add.txt---chmod-x)

This means that this executable bit is only changed for git, but not for your local file. This is fine however, because we're on Windows anyway and otherwise we'd use the `chmod` command to update the permission.

## The solution

To summarize, we can use `git add` command with the `chmod` flag to change the executable bit of the file. Our complete command would look like this.
```powershell
C:\Git > git add --chmod=+x <filename>
```

If we then do a status check we get the following results.

```powershell
C:\Git > git status

Changes not staged for commit:

    modified:   <filename>
```