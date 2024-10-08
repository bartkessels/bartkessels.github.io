---
title: C# 12 updates - Introduction
description: A couple of weeks ago Microsoft has released C# 12 which packed a lot of new features. In the upcoming weeks I'll be diving into these updates and writing about it.
story: true
author: bart
layout: post
image: assets/images/c-sharp/c-sharp-12/introduction.png
caption: This image is generated using Dall-E
prompt: Generate an image of computer screen where some programming language is being displayed on the screen in a minimalistic flat style
featured: true
mermaid: false
date: 2023-12-20
categories: [c-sharp]
permalink: csharp/csharp-12/introduction
tags: [.NET, Microsoft, C#, C# 12]
related: csharp12
related_to: [csharp12, csharp]
---

A couple of weeks ago Microsoft has launched C# 12 which packed a lot of new features [(Microsoft, 2023)](https://learn.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-12).

If that's not a reason to start diving into the new C#-features, I don't know what is. The best part about this update, at least to me, is that there
are some concepts of which I'm not quite sure what they actually are, or even why I would want to use them in the first place.

That's why I'm starting a small series on the C# 12 features that I want to deep dive into, learning about the concepts, figuring out how to implement it and figure out what the use-cases are.

## Setup

For my own sanity and redelivery purposes, I'll be going over the environment I've setup for the dive into C# 12. I'll be using .NET 8, because it's the latest LTS release.

If you already have a working environment, feel free to ignore this section completely.

### Install .NET 8

Before I can dive into .NET, I have installed it using [Homebrew](https://homebrew.sh) on macOS.

```shell
$ brew install dotnet@8
```

_*Note_ the `@8` is not required since the latest version of the formula is already _8_. But for repeatability’s sake, I've included it.

### Set up the solution

All features will be added as a project to the `csharp-12-features` solution on [github.com/bartkessels/csharp-12-features](https://github.com/bartkessels/csharp-12-features).

The solution is created using the .NET cli.

```shell
$ mkdir csharp-12-features
$ cd csharp-12-features
$ dotnet new sln
```

And now the projects where each feature will live, this step assumes you're still in the `csharp-12-features` folder from creating the solution.

```shell
$ dotnet new console -n ProjectName
$ dotnet sln add ProjectName
```

_*Note_ each project will be a console project because it's pretty assumable that something is going to be printed to an output.