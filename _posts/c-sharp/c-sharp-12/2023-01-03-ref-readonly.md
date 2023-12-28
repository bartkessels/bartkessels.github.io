---
title: C# 12 updates - ref readonly
description: In C# 12, Microsoft has added the ref readonly parameter modifier.
author: bart
layout: post
image: assets/images/c-sharp/c-sharp-12/ref-readonly.png
caption: This image is generated using Dall-E
prompt: Generate an image of a computer screen with an IDE open and someone trying out the new ref readonly modifier from C# in a minimalistic flat style
mermaid: false
date: 2023-01-03
categories: [c-sharp]
permalink: csharp/csharp-12/ref-readonly
tags: [.NET, Microsoft, C#, C# 12]
---

If we take a look at the release notes, Microsoft states that the `readonly ref` modifier more clarity allows where the `ref` or `in` modifiers where used before [(Microsoft, 2023)](https://learn.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-12#ref-readonly-parameters).

When taking a look at the documentation for the `ref readonly` modifier, it states that the modifier can be used to force the call site to pass in a reference and the callee cannot change the reference [(Microsoft, 2023)](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/method-parameters#ref-readonly-modifier).

My expectations for this is, that when combined with the [primary constructor](./2023-12-27-primary-constructor.md) it can be used to declare readonly fields in a class that are injected through the constructor. But let's find out if that's the case.

## Implementation

Before we can start with playing around with the `ref readonly` modifier, let's create a new project inside our `csharp-12-features` solution.

```shell
$ dotnet new console -n RefReadonlyModifier
$ dotnet sln add RefReadonlyModifier
```

Let's re-use our `PeopleRepository` and `DbContext` from our previous post about the [primary constructor](./2023-12-27-primary-constructor.md).

__DbContext__
```csharp
namespace RefReadonlyModifier;

public class DbContext
{
    public IEnumerable<string> GetPeople() =>
        new List<string>
        {
            "John Doe",
            "Jane Doe"
        };
}
```

__PersonRepository__
```csharp
namespace RefReadonlyModifier;

public class PersonRepository(DbContext context)
{
    public string GetName(int index) =>
        context.GetPeople().ElementAt(index);
}
```

This is the exact same code as before, so let's add the `ref readonly` modifier to the `DbContext` datatype in our `PersonRepository` constructor.

```csharp
public class PersonRepository(ref readonly DbContext context)
{
    public string GetName(int index) =>
        context.GetPeople().ElementAt(index);
}
```

This gives us the following error-message when we try to access the `context` parameter from the `GetName` method.

```
cannot use 'ref readonly' primary constructor parameter 'context' inside an instance member
```

When looking back at the documentation it's pretty obvious because it clearly states _'...must be present in the method declaration. ...'_. So we can only use it for methods. Let's update our `PersonRepository` to pass the `DbContext` as a readonly reference to the `GetName` method.

```csharp
public class PersonRepository()
{
    public string GetName(ref readonly DbContext context, int index) =>
        context.GetPeople().ElementAt(index);
}
```

This will make the `context` variable read only as expected. If we take our `PersonRepository` and put it into a tool like [sharplab.io](https://sharplab.io) we get the generated C# code which will desugar the `ref readonly` modifier.

```csharp
public class PersonRepository
{
    [System.Runtime.CompilerServices.NullableContext(1)]
    public string GetName([In][RequiresLocation] ref DbContext context, int index)
    {
        return Enumerable.ElementAt(context.GetPeople(), index);
    }
}
```

We see that two attributes `In` and `RequiresLocation` are added. If we remove the `readonly` modifier both attributes are gone. So let's find out what those attributes exactly are.

### In attribute

This attribute makes sure that the `context` is passed as a reference [(Microsoft, 2021)](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/in).

> The `in` modifier allows the compiler to create a temporary variable for the argument and pass a readonly reference to that argument.
> * [(Microsoft, 2023)](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/method-parameters#in-parameter-modifier).

This is the attribute that makes sure we cannot change to location of the pointer at the call-site of our method.

### RequiresLocation attribute

Looking at the official documentation, there's not much to find except for this little bit of text.

> Reserved for use by a compiler for tracking metadata. This attribute should not be used by developers in source code.
> * [(Microsoft, n.d.)](https://learn.microsoft.com/en-us/dotnet/api/system.runtime.compilerservices.requireslocationattribute?view=net-8.0)

Let's take a look at the spec and see if we can find more information.

SPEC: https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/proposals/csharp-12.0/ref-readonly-parameters

## How does it work

## Use cases