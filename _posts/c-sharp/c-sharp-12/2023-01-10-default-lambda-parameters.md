---
title: C# 12 updates - Default lambda parameters
description: In C# 12, Microsoft has added the ability to specify default values for your lambda parameters.
author: bart
layout: post
image: assets/images/c-sharp/c-sharp-12/default-lambda-parameters.png
caption: This image is generated using Dall-E
prompt: Generate an image of a computer screen with an IDE open and writing lambdas in C# in a minimalistic flat style
mermaid: false
date: 2023-11-10
categories: [c-sharp]
permalink: csharp/csharp-12/default-lambda-parameters
tags: [.NET, Microsoft, C#, C# 12, parameters, default parameters, lambda]
---

On the C# 12 website Microsoft has written a little bit about default parameters for lambda's, and in the documentation for lambda's I can't find it.

I can understand why Microsoft hasn't written a lot about it, because the title says it all. But what's weird to me is that they don't acknowledge this feature in their documentation. And in a way I think that's pretty obvious given the nature of lambda's. But more on that later.

## Implementation

Before we can start messing around with lambda's we'll be creating a new project inside our `csharp-12-features` solution.

```shell
$ dotnet new console -n DefaultLambdaParameter
$ dotnet sln add DefaultLambdaParameter
```

Let's create a list of names and iterate over it. This way we can use a lambda to print out each name.

```csharp
var names = new List<String> { "John Doe", "Jane Doe" };
foreach (var name in names)
{
    Console.WriteLine(name);
}
```

This is a pretty straight forward application, it just prints the names from the names list to the console.

Now the lambda-expression is inside the `ForEach` call on the `names` list. So if we extract it into a named lambda we need to add a parameter with the name we want to print.

```csharp
var printName = (string name) => { Console.WriteLine(name); };

var names = new List<string> { "John Doe", "Jane Doe" };
foreach (var name in names)
{
    printName(name);
}
```

In this case, our lambda doesn't have a default parameter value so let's set the default value to `"Name unknown"`.

```csharp
var printName = (string name = "Name unknown") => { Console.WriteLine(name); };

var names = new List<string> { "John Doe", "Jane Doe" };
foreach (var name in names)
{
    printName(name);
}
```

This doesn't change anything in our output, because we give a name everytime we run the lambda-expression.

The only difference in behaviour would be if we run the lambda-expression without an argument. But that does not justify our use case. So let's try it out with a null value and see if that calls the default parameter value. For this to work we need to change our datatypes (the `string`s to nullable `string`s).

```csharp
var printName = (string? name = "Name unknown") => { Console.WriteLine(name); };

var names = new List<string?> { "John Doe", "Jane Doe", null };
foreach (var name in names)
{
    printName(name);
}
```

We explicitly add a `null` reference in our list of names so we don't have to change anything in our _'logic'_. This outputs the following names:

```
John Doe
Jane Doe

```

As you see, we get an empty line because our `null` value does not resolve into the default argument value as I was expecting. This means that the only time our default argument value will be used, will only be when we execute our lambda-expression without any arguments.

## How does it work

The default parameter value is only used when the lambda-expression is executed without an argument. When using a nullable datatype, the default parameter is overwritten by the null-pointer which in a way gives us more control over our application flow because we might expect a nullable type.

## Use case

However, given the nature of lambdas which are usually used without being assigned to a variable, or let alone being used twice without being converted into a method or extension method. For me the default parameter value doesn't have any use case in an object-oriented project. This may be useful to functional applications where you might need to access a lambda expression a couple of times with or without a parameter. But then to me the question arises, why not just turn it into a function. Because the lambda already has a name, it's basically already a function (especially because they both live on the stack).

For my own needs, I don't see the need for default parameters or named lambda's for that matter. And for pure functional applications I'd rather use a function than a named lambda because that looks cleaner to me. So, this might be a personal preference whether it's a good feature for you.
