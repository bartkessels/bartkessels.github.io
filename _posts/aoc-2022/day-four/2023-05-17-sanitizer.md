---
title: Advent of Code 2022, Day 4 - Sanitizer
toc: true
mermaid: true
date: 2023-05-17 12:15:00 +02
categories: [Advent of Code 2022, Day Four]
permalink: advent-of-code-2022/day-four/sanitizer
tags: [advent of code, kotlin, solution]
---

## Preface

The objective of the fourth day is available on the [advent of code](https://adventofcode.com/2022/day/4) website, so it won't be shared here. On this page only the steps of achieving a solution are given with a solution build in Kotlin.

## Design

When reading through the assignment we can identify in what kind of model we'd like to put our raw data. So the first step that we're going to do is think about our data structure.

So we've got the following raw input.

```
2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8
```
{: file="Raw input" }

Were each line are two elves comparing their clean up range. This means that on the first line one elve is responsible for cleaning up range 2 through 4 and another one is responsible for the range 6 through 8.

This means that we want to get the following data structure.

```kotlin
[
    {           // Line 1
      { 2, 4 }, // First elve
      { 6, 8 }  // Second elve
    },
    {           // Line 2
      { 2, 3 }, // First elve
      { 4, 5 }  // Second elve
    },
    {           // Line 3
      { 5, 7 }, // First elve
      { 7, 9 }  // Second elve
    },
    {           // Line 4
      { 2, 8 }, // First elve
      { 3, 7 }  // Second elve
    },
    {           // Line 5
      { 6, 6 }, // First elve
      { 4, 6 }  // Second elve
    },
    {           // Line 6
      { 2, 6 }. // First elve
      { 4, 8 }  // Second elve
    }
]
```

In this data structure we have a list with pairs where each pair is made up of two pairs, so the data type is going to be `List<Pair<Pair<Int, Int>, Pair<Int, Int>>>`. Where the list is equal to all the lines, the first pair is equal to both elves and the inner pairs are the ranges that each elve needs to clean up.

## Implementation

### Sanitizer

Now we now how we want our data structure to look like, we can start creating the `getItems(): List<Pair<Pair<Int, Int>, Pair<Int, Int>>>` method inside our `Sanitizer` class.

```kotlin
class Sanitizer(
    private val resource: URL?
) {
    fun getItems(): List<Pair<Pair<Int, Int>, Pair<Int, Int>>>? =
      resource
            ?.readText()
            ?.split("\n")
            ?.map { // Step 1
                val ranges = it.split(",")
                Pair(ranges[0], ranges[1])
            }
            ?.map {
                // Step 2
                val firstElveRanges = it.first.split("-")
                val secondElveRanges = it.second.split("-")

                // Step 3
                Pair(
                    Pair(firstElveRanges[0].toInt(), firstElveRanges[1].toInt()),
                    Pair(secondElveRanges[0].toInt(), secondElveRanges[1].toInt())
                )
            }
}
```
{: file="aoc-2022/day4/src/main/kotlin/aoc/Sanitizer.kt" }

At _step 1_ we have each line of two ranges, so we need to split up that line that get two ranges. We do this by splitting the line on the `-` character and putting that result into an pair. Then at _step 2_ we split each item in the pair on the `,` character, so we have the start and end range of each elve. We then convert that result to an integer an put it in another pair at _step 3_.

### Test case

To validate that our logic works as expected, we create a test case based on the sample data from the assignment. This way we can validate that our sanitizer gives us the correct data structure which we can use in the assignments.

```kotlin
class SanitizerTest {
    @Test
    fun testGetItems() {
        // Arrange
        val resource = {}::class.java.getResource("/input.txt")
        val sut = Sanitizer(resource)
        val expectedItems = listOf(
            Pair(
              Pair(2, 4),
              Pair(6, 8)
            ),
            Pair(
              Pair(2, 3),
              Pair(4, 5)
            ),
            Pair(
              Pair(5, 7),
              Pair(7, 9)
            ),
            Pair(
              Pair(2, 8),
              Pair(3, 7)
            ),
            Pair(
              Pair(6, 6),
              Pair(4, 6)
            ),
            Pair(
              Pair(2, 6),
              Pair(4, 8)
            )
        )

        // Act
        val result = sut.getItems()

        // Assert
        assertContentEquals(expectedItems, result)
    }
}
```
{: file="aoc-2022/day4/src/test/kotlin/aoc/SanitizerTest.kt" }
