---
title: Day 3 - Sanitizer
toc: true
mermaid: true
date: 2023-04-26 12:15:00 +02
categories: [Advent of Code 2022, Day Three]
permalink: advent-of-code-2022/day-three/sanitizer
tags: [advent of code, kotlin, solution]
---

## Preface

The objective of the third day is available on the [advent of code](https://adventofcode.com/2022/day/3) website, so it won't be shared here. On this page only the steps of achieving a solution are given with a solution build in Kotlin.

## Design

When reading through the assignment we can identify in what kind of model we'd like to put our raw data. So the first step that we're going to do is think about our data structure.

So we've got the following raw input.

```
vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw
```
{: file="Raw input" }

This input represents six rucksacks, where each rucksack consists of two compartments. The first compartment contains the
first half of each line, and the second compartment contains the second half.

So if we split our data based on this information, we get the following structure.

|            | Compartment A      | Compartment B      |
|-----------:|:-------------------|:-------------------|
| Rucksack 1 | _vJrwpWtwJgWr_     | _hcsFMMfFFhFp_     |
| Rucksack 2 | _jqHRNqRjqzjGDLGL_ | _rsFMfFZSrLrFZsSL_ |
| Rucksack 3 | _PmmdzqPrV_        | _vPwwTWBwg_        |
| Rucksack 4 | _wMqvLMZHhHMvwLH_  | _jbvcjnnSBnvTQFn_  |
| Rucksack 5 | _ttgJtRGJ_         | _QctTZtZT_         |
| Rucksack 6 | _CrZsJsPPZsGz_     | _wwsLwLmpwMDw_     |

To achieve this data structure we need to split up our input on a newline character. This will give us a list of all
rucksacks, but without the compartments.

```kotlin
[
    "vJrwpWtwJgWrhcsFMMfFFhFp",
    "jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL",
    "PmmdzqPrVvPwwTWBwg",
    "wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn",
    "ttgJtRGJQctTZtZT",
    "CrZsJsPPZsGzwwsLwLmpwMDw"
]
```

Now for each rucksack we need to count the number of characters inside the string and split it in half. Then we can add
both halfs into a pair so we get a list of pairs. In this list, each pair is a rucksack, and each pair item is a compartment.

```kotlin
[
    { "vJrwpWtwJgWr"    , "hcsFMMfFFhFp"     }, // Rucksack 1
    { "jqHRNqRjqzjGDLGL", "rsFMfFZSrLrFZsSL" }, // Rucksack 2
    { "PmmdzqPrV"       , "vPwwTWBwg"        }, // Rucksack 3
    { "wMqvLMZHhHMvwLH" , "jbvcjnnSBnvTQFn"  }, // Rucksack 4
    { "ttgJtRGJ"        , "QctTZtZT"         }, // Rucksack 5
    { "CrZsJsPPZsGz"    , "wwsLwLmpwMDw"     }  // Rucksack 6
]
```

## Implementation

### Sanitizer

Now we now how we want our data structure to look like, we can start creating the `getItems(): List<Pair<String, String>>` method inside our `Sanitizer` class.
Because we've laid out the way we want to functionally setup our code. We can just implement it in Kotlin using the `split` and `map` methods on our input file.

```kotlin
class Sanitizer(
    private val resource: URL?
) {
    fun getItems(): List<Pair<String, String>>? =
      resource
          ?.readText()
          ?.split("\n")
          ?.map {
              val compartmentSize = it.length / 2 // Step 1
              val firstCompartment = it.substring(0, compartmentSize) // Step 2
              val secondCompartment = it.substring(compartmentSize, it.length) // Step 3

              Pair(firstCompartment, secondCompartment)
          }
}
```
{: file="aoc-2022/day3/src/main/kotlin/aoc/Sanitizer.kt" }


At _step 1_ we sum up the entire length of the string and divide it by two because we know that each rucksack has only
two compartments. At _step 2_ and _step 3_ we retrieve the compartments by retrieving the substring of the entire rucksack.

At _step 2_ we start the substring at index 0 up until the compartmentSize. Because the substring `endIndex` parameter is exclusive [(Jetbrains, n.d.)](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/substring.html), we can threat it as if it's a 1-based index. At step 3, we take the rest of the string with the compartmentSize as the `startIndex`. Because the `startIndex` is inclusive [(Jetbrains, n.d.)](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/substring.html), we don't need to subtract or add anything.

Which will finally give us the data model we designed in the previous chapter.

### Test case

To validate that our logic works as expected, we create a test case based on the sample data from the assignment. This way we can validate that our sanitizer gives us the correct data structure which we can use in the assignments.

```kotlin
class SanitizerTest {
    @Test
    fun testGetItems() {
        // Arrange
        val resource = SanitizerTest::class.java.getResource("/input.txt")
        val sut = Sanitizer(resource)
        val expectedItems = listOf(
            Pair("vJrwpWtwJgWr", "hcsFMMfFFhFp"),
            Pair("jqHRNqRjqzjGDLGL", "rsFMfFZSrLrFZsSL"),
            Pair("PmmdzqPrV", "vPwwTWBwg"),
            Pair("wMqvLMZHhHMvwLH", "jbvcjnnSBnvTQFn"),
            Pair("ttgJtRGJ", "QctTZtZT"),
            Pair("CrZsJsPPZsGz", "wwsLwLmpwMDw")
        )

        // Act
        val result = sut.getItems()

        // Assert
        assertContentEquals(expectedItems, result)
    }
}
```
{: file="aoc-2022/day3/src/test/kotlin/aoc/SanitizerTest.kt" }
