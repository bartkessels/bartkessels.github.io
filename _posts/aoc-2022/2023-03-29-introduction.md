---
title: Introduction to Advent of Code 2022
toc: true
mermaid: true
date: 2023-03-29 12:00:00 +02
categories: [Advent of Code 2022]
permalink: advent-of-code-2022/introduction
tags: [advent of code, kotlin, introduction, solution]
---

Over the next couple of weeks I'll be posting about the Advent of Code 2022 solutions. For each day I'll create three posts, a post about the data sanitation.
And of course for both parts a seperate blog post, so one post can just focus on one particular problem.

The objective of each day is available on the [advent of code](https://adventofcode.com/2022/day/1) website, so it won't be shared here.

I'll be using Kotlin to create this years Advent of Code because I want to learn Kotlin and this will be a nice starting point.

## Project structure

Before we can get started with the actual Advent of Code, we need to setup our project stucture. For this I'll be using different submodules for each day, so we can truly
seperate the different objectives.

```
- aoc-2022
  - day1
    - src
      - main
        - kotlin
          - aoc
            - PartOne.kt
            - PartTwo.kt
            - Sanitizer.kt
            - main.kt
        - resources
          - input.txt
      - test
        - kotlin
          - aoc
            - PartOneTest.kt
            - PartTwoTest.kt
            - SanitizerTest.kt
        - resources
          - input.txt
    - build.gradle.kts
  - day2
    - src
      - main
        - kotlin
          - aoc
            - PartOne.kt
            - PartTwo.kt
            - Sanitizer.kt
            - main.kt
        - resources
          - input.txt
      - test
        - kotlin
          - aoc
            - PartOneTest.kt
            - PartTwoTest.kt
            - SanitizerTest.kt
        - resources
          - input.txt
    - build.gradle.kts
  - dayN
    - src
      - main
        - kotlin
          - aoc
            - PartOne.kt
            - PartTwo.kt
            - Sanitizer.kt
            - main.kt
        - resources
          - input.txt
      - test
        - kotlin
          - aoc
            - PartOneTest.kt
            - PartTwoTest.kt
            - SanitizerTest.kt
        - resources
          - input.txt
    - build.gradle.kts
  - settings.gradle.kts
```
{: file="Folder structure" }

The puzzle input well be stored in the `input.txt` file under the resources folder. For the tests, the `input.txt` will contain the sample input.
This way, we can setup our test cases to use the sample input and validate that the output equals the sample answer. And we don't need to update our 
code when switching between the sample data and the actual data.

### Decisions

In our file structure you can see that we've already made some decisions for our implementation. One being that we create a module for each day, and another one
being that we seperate the data sanitation and the two parts of each day.

The reason we create a module for each day, is that experience has thought me that no day depends on the previous day. So it doesn't make sense to put all the different
types of objectives in the same project or module.

And for the seperation between the data sanitation and the parts of each day, this is done so each part can focus on it's specific logic without worrying about the data structure.
You could say that both parts of the day can be put in one class or one file, but I think it's cleaner to completely seperate them and have duplicate code than to have very
generic shared code.

The `main.kt` file contains a Main class and a main method as the entry-point for the module. This is used to execute the code with the actual input data. In most cases
the main method will look something like the following code. So for this reason, this code isn't shared in the upcoming blogposts.

```kotlin
fun main() {
    val resource = {}::class.java.getResource("/input.txt")
    val sanitizer = Sanitizer(resource)

    // Part one
    val partOne = PartOne(sanitizer)
    println("Part one: ${partOne.getResult()}")

    // Part two
    val partTwo = PartTwo(sanitizer)
    println("Part two: ${partTwo.getResult()}")
}
```
{: file="main.kt" }
