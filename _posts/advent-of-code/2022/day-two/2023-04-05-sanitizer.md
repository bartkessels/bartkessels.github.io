---
title: Advent of Code 2022, Day two - Sanitizer
description: Turn the input into a list of rock-paper-scissor games.
author: bart
layout: post
image: assets/images/advent-of-code/2022/day-2.png
caption: This image is generated using Dall-E
prompt: Generate an image of two elves playing rock paper scissors in minimalistic flat style
mermaid: true
date: 2023-04-05 12:00
categories: [advent-of-code-2022]
permalink: advent-of-code/2022/day-two/sanitizer
tags: [advent of code, kotlin, solution]
---

## Preface

The objective of the second day is available on the [advent of code](https://adventofcode.com/2022/day/2) website, so it won't be shared here. On this page only the
steps of achieving a solution are given with a solution build in Kotlin.

## Design

When reading through the assignment we can identify in what kind of model we'd like to put our raw data. So the first step that we're going to do is think about
our data structure.

So we've got the following raw input.

```
A Y
B X
C Z
```
{: file="Raw input" }

The strategy input is split into two columns, the first of which is our opponents strategy and the second column is our strategy. So we need to turn the data into
some kind of a match model like this.

|         | opponent strategy | own strategy |
|:-------:|:----------------:|:------------:|
| Match 1 | A                | Y            |
| Match 2 | B                | X            |
| Match 3 | C                | Z            |

We can do this by spliting the data into matches by splitting on the newline character. After that, we can split on the space character to get a pair of strategies.
Which means that we'll get something like this:

```kotlin
[
  { "A", "Y" }, // Match 1
  { "B", "X" }, // Match 2
  { "C", "Z" }  // Match 3
]
```

## Implementation

### Sanitizer

Now we now how we want our data structure to look like, we can start creating the `getItems(): List<Pair<Char, Char>>` method inside our `Sanitizer` class.
Because we've laid out the way we want to functionally setup our code. We can just implement it in Kotlin using the `split` and `zipWithNext` methods on our input file.

> The `zipWithNext` method is used to take an item from a list and concat it with the following item in a pair.
- [(Jetbrains, n.d.)](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/zip-with-next.html)

```kotlin
class Sanitizer(
    private val resource: URL?
) {
    fun getItems(): List<Pair<String, String>>? {
        return resource
            ?.readText()
            ?.split("\n")           // 1
            ?.map {
                it
                    .split(" ")     // 2
                    .zipWithNext()  // 3
                    .first()
            }
    }
}
```
{: file="aoc-2022/day2/src/main/kotlin/aoc/Sanitizer.kt" }

What our sanitizer does, is splitting the input on a newline character at _step 1_. That returns the following output.

```
kotlin
[
  "A Y",
  "B X",
  "C Z"
]
```

So at _step 2_ we split each string at the space character. Giving us a list of strings.

```kotlin
[
  [ "A", "Y" ],
  [ "B", "X" ],
  [ "C", "Z" ]
]
```

But, since we know that a match is between two players we don't want a list of strategies but just a pair. So at _step 3_ we use the `zipWithNext` method to turn
our list of strings, into a list of pairs. And because we only need one pair, we call the `first` method on the list of pairs.

Which will finally give us the data model we designed in the previous chapter.

### Test case

To validate that our logic works as expected, we create a test case based on the sample data from the assignment. This way we can validate that our sanitizer gives us the
correct data structure which we can use in the assignments.

```kotlin
class SanitizerTest {
    @Test
    fun testGetItems() {
        // Arrange
        val resource = {}::class.java.getResource("/input.txt")
        val sut = Sanitizer(resource)
        val expectedItems = listOf(
            Pair("A", "Y"),
            Pair("B", "X"),
            Pair("C", "Z")
        )

        // Act
        val result = sut.getItems()

        // Assert
        assertContentEquals(expectedItems, result)
    }
}
```
{: file="aoc-2022/day2/src/test/kotlin/aoc/SanitizerTest.kt" }
