---
title: .NET benchmarks
description: Have you ever wanted to test if a solution or algorithm you've written or refactored is performing faster than the previous iteration? In this post, we'll take a look at how you can use the BenchmarkDotNet library to write benchmarks for your C# code.
author: bart
layout: post
image: assets/images/c-sharp/benchmarks.jpeg
caption: This image is generated using Dall-E
prompt: Generate an image of a computer screen with multiple graphs being displayed in a minimalistic flat style
mermaid: false
date: 2024-10-16
categories: [ c-sharp, benchmark, dotnet ]
permalink: csharp/benchmarks
tags: [ .NET, Microsoft, C#, BenchmarkDotNet, Benchmark ]
related: csharp
related_to: [ csharp, dotnet ]
---

Recently I came across the [BenchmarkDotNet](https://benchmarkdotnet.org/) library, which is an open source library
maintained by the .NET foundation.

This library allows us to write benchmarks for our own C# code, just by lookin at the readme on Github, it seems like an
easy to use library. So let's check it out.

## Set up the project

For this post, I'll be using .NET 9 with C# 13 because that's what I've installed on my machine.
This will, however, also work on other .NET versions or different C# versions.

To get started, we create a new project called `DotNetBenchmarks`.

```shell
$ dotnet new console -n DotNetBenchmarks
$ cd DotNetBenchmarks
```

You can also find this project
on [github.com/bartkessels/dotnet-benchmarks](https://github.com/bartkessels/dotnet-benchmarks).

## Add the BenchmarkDotNet package

Next, we can add the [BenchmarkDotNet](https://www.nuget.org/packages/BenchmarkDotNet/) Nuget package to our project.

```shell
$ dotnet add package BenchmarkDotNet
```

And that's all for the installation part.

## Writing our first benchmark

Before we create our first benchmark, let's first think of a use case where we can benchmark multiple implementations.
Let's create a small method that adds multiple numbers.
Yes, I hear you think how is this usefull for two methods? Well, we'll make one method that uses a for loop with a
counter and another method that uses LINQ.

```csharp
internal class Calculator
{
    internal int AddUsingLinq(int[] numbers)
    {
        return numbers.Sum();
    }

    internal int AddUsingForLoop(int[] numbers)
    {
        var sum = 0;
            
        for (var i = 0; i < numbers.Length; i++)
        {
            sum += numbers[i];
        }
           
        return sum;
    }
}
```

To be completely honest, I don't have any expectations on which method will be faster, or what the actual difference between the two will be.
Let's just try it out.

## Benchmarking the methods

Now that our methods have been written, we simply add the `[Benchmark]` attribute to the methods we want to benchmark.

```csharp
internal class CalculatorBenchmark
{
    private readonly Calculator _calculator = new();

    [Benchmark]
    internal void AddUsingLinq()
    {
        int[] numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        _calculator.AddUsingLinq(numbers);
    }

    [Benchmark]
    internal void AddUsingForLoop()
    {
        int[] numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        _calculator.AddUsingForLoop(numbers);
    }
}
```

Next we need to register our benchmark class to the benchmark runner in our `Program.cs` file.

```csharp
BenchmarkRunner.Run<CalculatorBenchmark>();
```

Now, let's dive into the code behind the `BenchmarkRunner.Run` method and see how it knows what methods we have declared as benchmarks.

Let's start by opening the `BenchmarkRunner.Run` method in Github, after a little digging I found in the [BenchmarkRunnerDirty](https://github.com/dotnet/BenchmarkDotNet/blob/9040e40187f2bbecea4aec724f995fde378f608b/src/BenchmarkDotNet/Running/BenchmarkRunnerDirty.cs#L21) file.
All this method does, is actually calling the `BenchmarkRunnerClean ` method, which in turn uses the `BenchMarkConverter` to retrieve all methods that have the `Benchmark` attribute, see [BenchmarkConverter.cs; line35](https://github.com/dotnet/BenchmarkDotNet/blob/9040e40187f2bbecea4aec724f995fde378f608b/src/BenchmarkDotNet/Running/BenchmarkConverter.cs#L35).

Then for each method it finds, it will execute it and temporarily save the results, see [BenchmarkRunnerClean.cs; line 121](https://github.com/dotnet/BenchmarkDotNet/blob/9040e40187f2bbecea4aec724f995fde378f608b/src/BenchmarkDotNet/Running/BenchmarkRunnerClean.cs#L121)

### Running the benchmarks

Now we know a bit more on how the benchmarks are run, let's actually run our own benchmarks. It's important to know that it's highly recommended to run the benchmarks in release mode, as debug mode probably impacts the runtime more than you'd like [(Dotnet Foundation and members, n.d.)](https://benchmarkdotnet.org/articles/guides/good-practices.html#use-the-release-build-without-an-attached-debugger). 
If for some reason, you run it using debug mode, you get the following message and your benchmarks won't run.

```
// Validating benchmarks:
//    * Assembly DotNetBenchmarks which defines benchmarks is non-optimized
Benchmark was built without optimization enabled (most probably a DEBUG configuration). Please, build it in RELEASE.
If you want to debug the benchmarks, please see https://benchmarkdotnet.org/articles/guides/troubleshooting.html#debugging-benchmarks.
```

To run our benchmarks, we just call `dotnet run` and set the configuration flag to `Release`.

```shell
$ dotnet run -c Release
```

After less than two minutes, I got the following result (this may differ for your machine).

```
| Method          | Mean     | Error    | StdDev   |
|---------------- |---------:|---------:|---------:|
| AddUsingLinq    | 14.50 ns | 0.203 ns | 0.169 ns |
| AddUsingForLoop | 15.01 ns | 0.365 ns | 1.054 ns |
```

As a small extra, we not only know how to write benchmarks for our own classes or methods, we also know that LINQ is faster in summing up numbers than writing your own for-loop.