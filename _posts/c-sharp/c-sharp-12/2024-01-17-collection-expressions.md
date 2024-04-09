---
title: C# 12 updates - Collection expressions
description: C# 12 finally introduces some new syntactical suger that I'm eager to use in production because it improves the readability of the code.
author: bart
layout: post
image: assets/images/c-sharp/c-sharp-12/collection-expressions.png
caption: This image is generated using Dall-E
prompt: Generate an image of a happy person writing code in front of a laptop in a minimalistic flat style
mermaid: false
date: 2024-01-17
categories: [c-sharp]
permalink: csharp/csharp-12/collection-expressions
tags: [.NET, Microsoft, C#, C# 12, collections]
related: csharp12
related_to: [csharp12, csharp]
---

When reading through the [what's new in C# 12](https://learn.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-12) post from Microsoft, I was really happy when I saw _'Collection expressions`_. Because at work, we use both C# and Kotlin, and initializing a list with a default set of values in Kotlin looks a lot cleaner to me than the current C# initialization does.

So I'm really eager to start playing with this and using it in production code-bases to improve the readability.

## Implementation

Let's create a new project to start playing around with the new collection expressions inside the `csharp-12-features` solution.

```shell
$ dotnet new console -n CollectionExpressions
$ dotnet sln add CollectionExpressions
```

If you remember the previous post about [default lambda parameters](./2024-01-10-default-lambda-parameters.md), we created a list of names using the 'old' syntax like this.

```csharp
var names = new List<String> { "John Doe", "Jane Doe" };
```

But if we change this code to the new collection expressions, we get this much cleaner line of code.

```csharp
List<string> names = ["Jane Doe", "John Doe"];
```

The only downside for me is that I can't use the `var` keyword. But that is not that weird because the compiler needs to know which type of list is being created. But I would like to see the compiler getting a bit smarter and guess the type from the assigned value. In our example a list of `string`s.

## How does it work

Just like the previous initialization of a list, it desugars the code into the following example.

```csharp
List<string> list = new List<string>(2);
list.Add("Jane Doe");
list.Add("John Doe");
List<string> list2 = list;
```

## Use case

For me, I'll be using this syntax everytime I need to initialize a list with default values. For example, in test projects when I need to test a method that needs a list as an input. For now, I don't have exact use cases for an actual production application which has a defined set of values, because the applications I work on mostly get their data from a database or another source.