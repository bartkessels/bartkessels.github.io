---
title: C# 13 updates - Params collections
description: A new update of C# introduced the use of other collection types for the params modifier. In this post we'll be diving into the new types.
story: true
author: bart
layout: post
image: assets/images/c-sharp-13/params-collections.jpeg
caption: This image is generated using Dall-E
prompt: Generate an image of a computer screen where a list of multiple items is displayed as a programming language in a minimalistic flat style
featured: true
mermaid: false
date: 2024-10-16
categories: [c-sharp]
permalink: csharp/csharp-13/params-collections
tags: [.NET, Microsoft, C#, C# 13, Collections, params modifier]
related: csharp13
related_to: [csharp13, csharp, csharp-collections]
---

At first glance, this might not look like such a big update, but I still like to try it out and see how it works.

## Implementation

As always, we need to create a new project inside our `csharp-13-features` solution to start playing around with the new collections for the `params` modifier.

```shell
$ dotnet new console --framework net9.0 --langVersion 13 -n ParamsCollections
$ dotnet sln add ParamsCollections
```

Let's take a look at the previous limitation of only using arrays as the datatype.

```csharp
class PeopleRepository
{
    public void AddPeople(params string[] names)
    {
        foreach (var name in names)
        {
            Console.WriteLiine(name);
        }
    }
}
```

In this example, we have the method `AddPeople` which accepts any number of strings as parameters and places them into
the `names` array. If we take a look at the documentation for arrays, we see that they implement the `IList` and `IEnumerable` methods [(Microsoft, 2023)](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/arrays).

```csharp
class PeopleRepository
{
    public void AddPeople(params IEnumerable<string> names)
    {
        foreach (var name in names)
        {
            Console.WriteLiine(name);
        }
    }
}
```

This allows us to directly pass the values from the `params` to another method we're calling.

### Generated Intermediate Language

Now, let's see how this actually looks in the intermediate language.

If we first take a look at the `params` with the array datatype.

```csharp
.method public hidebysig instance void
    AddPeople(
      string[] names
    ) cil managed
  {
    .custom instance void [System.Runtime]System.Runtime.CompilerServices.NullableContextAttribute::.ctor(unsigned int8)
      = (01 00 01 00 00 ) // .....
      // unsigned int8(1) // 0x01
    .param [1]
      .custom instance void [System.Runtime]System.ParamArrayAttribute::.ctor()
        = (01 00 00 00 )
    .maxstack 2
    .locals init (
      [0] string[] V_0,
      [1] int32 V_1,
      [2] string name
    )
    
    // Rest of de IL-code is redacted
```

As you can see, we still get the array as a data type. Now let's see what happens when we change the data type to `IEnumerable<string>`.

```csharp
.method public hidebysig instance void
    AddPeople(
      class [System.Runtime]System.Collections.Generic.IEnumerable`1<string> names
    ) cil managed
  {
    .custom instance void [System.Runtime]System.Runtime.CompilerServices.NullableContextAttribute::.ctor(unsigned int8)
      = (01 00 01 00 00 ) // .....
      // unsigned int8(1) // 0x01
    .param [1]
      .custom instance void [System.Runtime]System.Runtime.CompilerServices.ParamCollectionAttribute::.ctor()
        = (01 00 00 00 )
    .maxstack 1
    .locals init (
      [0] class [System.Runtime]System.Collections.Generic.IEnumerator`1<string> V_0,
      [1] string name
    )
    
    // Rest of the IL-code is redacted
```

In this case, we still get the `IEnumerable` data type, where I would've expected that it would be compiled back to the array data type because it implements the `IEnumerable` interface.

## How does it work

Just as with a regular parameter that accepts the `IEnumerable` data type, we can pass this data type to the `params` modifier allowing us to directly use this value to call other methods.
This gives us the flexibility to write an API that accepts an N-amount of parameters without having the caller to instantiate a new list.

## Use cases

Right now, the only use-case I see is the one described above so I don't have to call `parameter.ToList()` if I need to call another method which only accepts an `IList` instead of an array.

But apart from that, I would use this, so I can have interfaces as parameters instead of concrete types. Which I think is a best practice in most cases.