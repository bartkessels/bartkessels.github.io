---
title: C# 12 updates - Primary Constructor
description: For those of you coming for Javascript or Kotlin, you're going to love this new feature. Set your member variables through a primary constructor.
author: bart
layout: post
image: assets/images/c-sharp/c-sharp-12/primary-constructor.png
caption: This image is generated using Dall-E
prompt: Generate an image of a computer screen with an IDE open and someone trying out the new primary constructor from C# in a minimalistic flat style
mermaid: false
date: 2023-12-27
categories: [c-sharp]
permalink: csharp/csharp-12/primary-constructor
tags: [.NET, Microsoft, C#, C# 12]
related: csharp12
related_to: [csharp12, csharp]
---

For those of you coming from Javascript or Kotlin, you're going to love this new update in C#.

In C# 12, Microsoft has (finally) added primary constructors. Which will get rid of those ugly member properties in our classes. At least, will they?

Let's create our test project and start playing around with it. Let's see what the limitations are, and how we can successfully use them.

## Implementation

Before we can start with actually playing with the primary constructors, we need to create a project inside our `csharp-12-features` solution.

```shell
$ dotnet new console -n PrimaryConstructor
$ dotnet sln add PrimaryConstructor
```

According to the documentation, we can use it both with classes and structs (for records they were already available).

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

As you can see, we have three lines of code just for declaring and initializing a single property. If we convert this to C# 12, this will look like a `record` constructor.

```csharp
public class PersonRepository(DbContext context)
{ 
    // TODO: Implement some logic
}
```

Let's create our fake `DbContext` class and give it a method to read all names from the _'database'_.

__DbContext.cs__
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

If we take a look at the documentation of primary constructors, it clearly states that _Primary constructor parameters don't become properties, except in record types._ [(Microsoft, 2023)](https://learn.microsoft.com/en-us/dotnet/csharp/whats-new/tutorials/primary-constructors#primary-constructors). Which explains why it not accessible through `this`.
But the thing that I find fascinating, is that it _IS_ available for `record`s however.

If we look at the documentation for `record`s, Microsoft states that _When you declare a primary constructor on a record, the compiler generates public properties for the primary constructor parameters._ [(Microsoft, 2023)](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/record). Which is different from the
primary constructor where the documentation says _t's important to view primary constructor parameters as parameters even though they are in scope throughout the class definition_ [(Microsoft, 2023)](https://learn.microsoft.com/en-us/dotnet/csharp/whats-new/tutorials/primary-constructors#primary-constructors).

### Generated C# code

If we take our example and put it inside a tool like [sharplab.io](https://sharplab.io) we can see the code that is being generated for the primary constructor.

```csharp
[System.Runtime.CompilerServices.NullableContext(1)]
[System.Runtime.CompilerServices.Nullable(0)]
public class PersonRepository
{
    [CompilerGenerated]
    [DebuggerBrowsable(DebuggerBrowsableState.Never)]
    private DbContext <context>P;

    public PersonRepository(DbContext context)
    {
        <context>P = context;
        base..ctor();
    }

    public string GetName(int index)
    {
        return Enumerable.ElementAt(<context>P.GetPeople(), index);
    }
}
```

We see that the primary constructor parameter is added as a member variable to our class, but it's accessed through the `P` variable based on a generic type of the name of our parameter. So what happens when we try to use the `P` member ourselves.

```csharp
public class PersonRepository(DbContext context)
{
    public string GetName(int index) =>
        <context>P.GetPeople().ElementAt(index);
}
```

As I expected, we cannot access it directly because it gives our the error message that it cannot resolve the `context` symbol.

## How does it work

Parameters that are given through the primary constructor are just the same as parameters you get through any method or function. The only real difference is the fact that the
parameters from the primary constructor are available in the entire class.

Unfortunately, it suffers the same issue as regular pass-by-reference parameters have. You can change the value they point to. Thus meaning that you can update the
primary constructor variable in method `x` while you expected it to be something else in method `y`.

## Use cases

My personal preference for constructors is to initialize read-only fields for dependency injection. And my first thought for using this was for data transfer objects. But thinking over that again, I think I'd rather use `record`s for that.

You can, however, use them to initialize dependencies inside your constructor and going against dependency injection in a way.
But for some use-cases that might a valid consideration. As for me, I don't think I have a valid use-case for it just yet. But we'll see how it works itself out in the future.
