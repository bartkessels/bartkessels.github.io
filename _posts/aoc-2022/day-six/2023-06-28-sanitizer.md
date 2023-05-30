---
title: Advent of Code 2022, Day 6 - Sanitizer
toc: true
mermaid: true
date: 2023-05-17 12:15:00 +02
categories: [Advent of Code 2022, Day Six]
permalink: advent-of-code-2022/day-six/sanitizer
tags: [advent of code, kotlin, solution]
---

## Preface

The objective of the sixth day is available on the [advent of code](https://adventofcode.com/2022/day/6) website, so it won't be shared here. On this page only the steps of achieving a solution are given with a solution build in Kotlin.

## Design

When reading through the assignment we see that the sanitizer isn't very complex. We have a input-file with a single string as the input. So our sanitizer can just return that single line and trim the start and end of it.

Because this sanitizer is pretty basic, we're not going to create a design.

## Implementation

### Sanitizer

Now we now that we want to get a string from the input-data, we create a `getDatastreamBuffers()` method with the return type of `String?`.

#### getStacks method

```kotlin
class Sanitizer(
    private val resource: URL?
) {
    fun getDatastreamBuffers(): String? =
        resource
            ?.readText()
            ?.trim()
}
```
{: file="aoc-2022/day6/src/main/kotlin/aoc/Sanitizer.kt" }

### Test case

To validate that our sanitizer works as expected, we can validate that the output is a string of the test-data we've got from the assignment.

```kotlin
class SanitizerTest {
    @Test
    fun testGetItems() {
        // Arrange
        val input = {}::class.java.getResource("/input.txt")
        val expectedData = "mjqjpqmgbljsphdztnvjfqwrcgsmlb"
        val sut = Sanitizer(input)

        // Act
        val actualData = sut.getDatastreamBuffers()

        // Assert
        assertEquals(expectedData, actualData)
    }
}
```
{: file="aoc-2022/day6/src/test/kotlin/aoc/SanitizerTest.kt" }
