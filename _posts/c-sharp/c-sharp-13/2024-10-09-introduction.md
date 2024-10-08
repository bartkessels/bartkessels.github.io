---
title: C# 13 updates - Introduction
description: A couple of days ago, Microsoft has released C# 13 which has some interesting new features. In the upcoming weeks I'll be diving into these updates and writing about is.
story: true
author: bart
layout: post
image: assets/images/c-sharp-13/introduction.jpeg
caption: This image is generated using Dall-E
prompt: Generate an image of a computer screen where some programming language is being displayed on the screen with the number 13 in a minimalistic flat style
featured: true
mermaid: false
date: 2024-10-09
categories: [c-sharp]
permalink: csharp/csharp-13/introduction
tags: [.NET, Microsoft, C#, C# 13]
related: csharp13
related_to: [csharp13, csharp]
---

A couple of days ago, Microsoft has released C# 13 which has some interesting features and concepts I didn't know before [(Microsoft, 2024)](https://learn.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-13).

And as always, what's more fun then diving into the new language and learning some new concepts. That's why I'm again doing a small series on this years C# update.

## Setup

For my own sanity and redelivery purpose, I'll be going over the environment I've setup for checking out C# 13 with .NET 9 preview as that's the SDK where the new C# 13 features have landed [(Microsoft, 2024)](https://dotnet.microsoft.com/en-us/download/dotnet).

If you already have a working environment with C# 13, feel free to skip this section completely.

### Install .NET 9 preview

Because I don't have the .NET 9 preview SDK yet, I'll be installing it using [Homebrew](https://homebrew.sh) on MacOS.

```shell
$ brew install dotnet@preview
```

_*Note_ the `@preview` is required at the time of writing, because the default formula version is still `8` [(Homebrew, n.d.](https://formulae.brew.sh/cask/dotnet).

is not required since the latest version of the formula is already _8_. But for repeatability’s sake, I've included it.

### Set up the solution

All features will be added as a project to the `csharp-13-features` solution, which are posted on the [github.com/bartkessels/csharp-13-features](https://github.com/bartkessels/csharp-13-features).

Create a new solution using the .NET cli.

```shell
$ mkdir csharp-13-features
$ cd csharp-13-features
$ dotnet new sln
```

For each new feature we'll be adding a new project to the solution.

```shell
$ dotnet new console --framework net9.0 --langVersion=13 -n FeatureName
$ dotnet sln add FeatureName
```

The `framework` argument is used to specify which .NET framework we're targeting and the `langVersion` specifies which version of C# we want to use [(Microsoft, 2024)](https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-new-sdk-templates#console).

_*Note_ each project will be a console project, that way we can print something to the console if needed.