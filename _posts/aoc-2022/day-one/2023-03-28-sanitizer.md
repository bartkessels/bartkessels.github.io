---
title: Day 1 - Sanitizer
toc: true
mermaid: true
date: 2023-03-29 12:15:00 +02
categories: [Advent of Code 2022, Day One]
permalink: advent-of-code-2022/day-one/sanitizer
tags: [advent of code, kotlin, solution, day one]
---

## Preface

The objective of the first day is available on the [advent of code](https://adventofcode.com/2022/day/1) website, so it won't be shared here. On this page only the
steps of achieving a solution are given with a solution build in Kotlin.

## Design

When reading through the assignment we can identify in what kind of model we'd like to put our raw data. So the first step that we're going to do is think about
our data structure.

So we've got the following raw input.

```
1000
2000
3000

4000

5000
6000

7000
8000
9000

10000
```
{: file="Raw input" }

If we look at it, we can see that each 'elve' is divided by an empy line. And each number is the calories of one snack they're carrying. So in total we've got five elves,
each carrying one or more snack(s).

If we split up the raw data into specific elves, we want to get the following data structure.

|Elve one|Elve two|Elve three|Elve four|Elve five|
|:------:|:------:|:--------:|:-------:|:-------:|
| 1000   | 4000   | 5000     | 7000    | 10000   |
| 2000   |        | 6000     | 8000    |         |
| 3000   |        |          | 9000    |         |

So we can see that we first need to split the raw input on an empy line, which will give us five strings with the calories for each elve. So if we split those strings on a newline character (`\n`)
we get a list of calories inside our list of elves. Which means, we'll get something like this:

```kotlin
[
  [ "1000", "2000", "3000" ],   // Elve one
  [ "4000" ],                   // Elve two
  [ "5000", "6000" ],           // Elve three
  [ "7000", "8000", "9000" ],   // Elve four
  [ "10000" ]                   // Elve five
]
```

So the only thing we need to do, is map each calory inside our 'inner-list' to an integer.

## Implementation

### Sanitizer

Now we now how we want our data structure to look like, we can start creating the `getItems(): List<List<Int>>` method inside our `Sanitizer` class.
Because we've laid out the way we want to functionally setup our code. We can just implement it in Kotlin using the `split` and `map` methods on our input file.

```kotlin
class Sanitizer(
    private val resource: URL?
) {
    fun getItems(): List<List<Int>>? {
        return resource
            ?.readText()
            ?.split("\n\n") // 1a
            ?.map {         // 1b
                it
                  .split("\n")        // 2a
                  .map{ it.toInt() }  // 2b
            }
    }
}
```
{: file="aoc-2022/day1/src/main/kotlin/aoc/Sanitizer.kt" }

All our sanitizer does right now, is just retrieving each group of calories by splitting the entire file on `\n\n`. This will create the following output at step _1a_ and _1b_.

```kotlin
[
  "1000\n2000\n3000",
  "4000",
  "5000\n6000",
  "7000",
  "8000\n9000",
  "10000"
]
```

So, if we iterate over each item in the list and seperate each string on `\n` we have the calories as a string so we need to convert that as well. The splitting is
done in step _2a_ and the conversion to an integer is done in step _2b_. Which gives us the following data structure.

```kotlin
[
  [ 1000, 2000, 3000 ],
  [ 4000 ],
  [ 5000, 6000 ],
  [ 7000, 8000, 9000 ],
  [ 10000 ]
]
```

### Test case

To validate that our logic works as expected, we create a test case based on the sample data from the assignment. This way we can validate that our sanitizer gives us the
correct data structure which we can use in the assignments.

```kotlin
class SanitizerTest {
    @Test
    fun testGetItems() {
        // Arrange
        val resource = SanitizerTest::class.java.getResource("/input.txt")
        val sut = Sanitizer(resource)
        val expectedItems = listOf(
            listOf(1000, 2000, 3000),
            listOf(4000),
            listOf(5000, 6000),
            listOf(7000, 8000, 9000),
            listOf(10000)
        )

        // Act
        val result = sut.getItems()

        // Assert
        assertContentEquals(expectedItems, result)
    }
}
```
{: file="aoc-2022/day1/src/test/kotlin/aoc/SanitizerTest.kt" }
