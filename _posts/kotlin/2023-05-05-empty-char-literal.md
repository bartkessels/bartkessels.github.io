---
title: Kotlin giving an empty char literal error
description: How to fix the Empty Char Literal error messages in Kotlin.
author: bart
layout: post
image: assets/images/kotlin/empty-char-literal-error.png
caption: This image is generated using Dall-E
prompt: Generate an image of a computer screen with a terminal on it displaying a large error message in a minimalistic flat style
date: 2023-05-05 12:00
categories: [kotlin]
permalink: kotlin/empty-char-literal
tags: [kotlin, error, problem, char, literal, solution]
---

So the last couple of weeks I've been working out the advent of code of 2022 in Kotlin. The reason herefore can be found in the [Advent of Code 2022 introduction](../aoc-2022/2023-03-29-introduction.md).

When working on day three, I came accross a weird error message when trying to return an empty character from one of my methods. The `return ''` statement gave me this error message `Empty Character Literal`.

## The solution

So after some Googling I came accross a Java thread on Stack Overflow, saying that in Java a character can not be empty just like other primitives ([the Stackoverflow post](https://stackoverflow.com/questions/8534178/how-to-represent-empty-char-in-java-character-class#:~:text=An%20empty%20String%20is%20a,has%20to%20have%20a%20value.)).

So in Kotlin (and Java for that matter), the solution was as simple as returning a `0`. But that was a bit strange for me, given that I want to return a char I don't want to return some random magic number.

So I started digging into the documentation for the `Char` datatype on the Kotlin site where I found the static property `Char.MIN_VALUE`. Which according to the docs contains the '_The minimum value of a character code unit._' [(Jetbrains, n.d.)](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-char/-m-i-n_-v-a-l-u-e.html).

If we print this value, we get nothing as the output. Just as we expected. But looking into the documentation for the basic types of Java, the minimum value for a char literal is 0 [(Oracle, n.d.)](https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html). So when we're converting the char to an integer, we get the expected `0` as an integer.

```kotlin
fun main() {
    println(Char.MIN_VALUE) // Prints nothing
    println(Char.MIN_VALUE.toInt()) // Prints 0
}
```