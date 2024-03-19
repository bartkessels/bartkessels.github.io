---
title: Basic Git workflow
description: When you're working on large software projects with multiple people, you need some kind of tool to manage the code between you and your co-workers.
author: bart
layout: post
image: assets/images/git/basic-git-flow/introduction.png
caption: This image is generated using Dall-E
prompt: Generate an image of multiple git branches displayed on a computer screen in a minimalistic flat style
date: 2024-03-11
categories: [git]
permalink: git/basic-git-flow/introduction
tags: [Git, Version Control, Collaboration, Software Development]
related: git
related_to: [git]
---

In my career as a software developer, I've been using Git since the day I started college. It's a great tool to manage your code and collaborate with others.

In the upcoming series I'll be diving deeper into Git to understand the inner workings more. We'll be discussing topics like branching, merging, rebasing, and more.

For our examples, we'll be using plain text files, as they are easy to understand and don't require any specific knowledge about a programming language. This will also help to see the difference when we've updated a single file a lot better.

## Prerequisites

Before we get started, make sure you have Git installed on your machine. You van validate this by running the following command.

```zsh
$ git --version
```

If you see a version number (in my case _2.44.0_), you're good to go. Otherwise you need to install Git from the [website](https://git-scm.com/) or install it using a package manager for your operating system.

## Basic understanding of Git

* Uitleggen wat Git is
* Uitleggen welke termininology wordt gebruikt