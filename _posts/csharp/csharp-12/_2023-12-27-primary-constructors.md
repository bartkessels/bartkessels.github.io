---
title: .NET 8 updates - Source Generators
toc: true
mermaid: false
date: 2023-12-27 23:14:00 +02
categories: [Upset]
permalink: dotnet/dotnet-8/source-generators
tags: [.NET, .NET 8, Microsoft, C#, Source Generator]
---

## Introduction

For those of you coming from Javascript or Kotlin, you're going to love this new update in C#.

In C# 12, Microsoft has (finally) added primary constructors. Which will get rid of those ugly member properties in our classes. At least, will they?

Let's create our test project and start playing around with it. Let's see what the limitations are, and how we can successfully use them.

## Implementation

Before we can start with actually playing with the primary constructors, we need to create a project inside our `csharp-12-features` solution.

```shell
$ dotnet new console -n PrimaryConstructor
$ dotnet sln add PrimaryConstructor
```

According to the documentation we can use it both with classes and structs (for records they were already available).

So let's create a repository class which has a (fake) dependency on a DbContext object. We can inject this dependency using our primary constructor.

Our old C# 11 (and below) code would look like this

```csharp
class PeopleRepository
{
    private readonly DbContext _context;
    
    public PeopleRepository(DbContext _context) =>
        _context = context;
}
```

As you can see, we have three lines of code just for declaring and initialising a single property. If we convert this to C# 12, this will look like a `record` constructor.

```csharp
public class PersonRepository(DbContext context)
{ 
    // TODO: Implement some logic
}
```

Let's create our fake `DbContext` class and give it a method to read all names from the _'database'_.

```csharp
namespace PrimaryConstructor;

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
{: file="csharp-12-features/PrimaryConstructor/DbContext.cs" }

Next we'll be implementing a method in our `PersonRepository` to get a persons name based on an index (yes, not a best practice but usable for our purpose).

```csharp
namespace PrimaryConstructor;

public class PersonRepository(DbContext context)
{
    public string GetName(int index) =>
        context.GetPeople().ElementAt(index);
}
```

As you can see we use the `context` from our primary constructor to call the `GetPeople` method from the `DbContext`.
The first thing that I noticed is that I can't access the `context` variable from the `this` pointer inside the `GetName` method. Which is weird to me, because neither the class nor the method are static.

### Not accessible through the 'this' pointer

If we take a look at the documentation of primary constructors, it clearly states that _Primary constructor parameters don't become properties, except in record types._ [(Microsoft, 2023)](https://learn.microsoft.com/en-us/dotnet/csharp/whats-new/tutorials/primary-constructors#primary-constructors). Which explains why it not accessible through `this`.
But the thing that I find fascinating, is that it _IS_ available for `record`s. Let's find out if we can see how this differnationat


If for example we look at the grammar for the instance constructor in C#, we see that

https://learn.microsoft.com/en-us/dotnet/csharp/whats-new/tutorials/primary-constructors#primary-constructors

## How does it work

## Use cases