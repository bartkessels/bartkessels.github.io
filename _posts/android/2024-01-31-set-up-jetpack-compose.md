---
title: Set up Jetpack Compose
description: In Android development, the new standard for building UI's is Jetpack Compose. But how do you actually set it up for your application?
author: bart
layout: post
image: assets/images/android/set-up-jetpack-compose.png
caption: This image is generated using Dall-E
prompt: Generate an image of a phone with a bit of code being displayed behind the Android logo in a minimalistic flat style
date: 2023-01-31
categories: [android]
permalink: android/set-up-jetpack-compose
tags: [Android, Jetpack Compose, UI, App Development]
related: jetpack_compose
related_to: [android, jetpack_compose]
---

When building Android application in this time and age, it's pretty assumable that you're going to use Jetpack Compose for your UI, since it's also the recommended toolkit by Google [(Google, n.d.)](https://developer.android.com/jetpack/compose).

## Set up the project

For this blogpost, I've set up an empty project without any views. This means that my project structure looks like this.

```
- app/
  - src/
    - androidTest/
      - kotlin/
        - net.bartkessels.myapplication/
    - main/
      - kotlin/
        - net.bartkessels.myapplication/
    - test/
      - kotlin/
        - net.bartkessels.myapplication/
  - build.gradle.kts
- build.gradle.kts
- gradle.properties
- settings.gradle.kts
```

This is done with the following settings from the project setup in Android Studio.

* __Template__: No Activity
* __Name__: My Application
* __Package name__: net.bartkessels.myapplication
* __Language__: Kotlin
* __Minimum SDK__: 26 (Oreo)
* __Build configuration language__: Kotlin DSL

The __Name__, __Package name__ and __Minimum SDK__ can be changed to values that suit your needs.

You might have noticed that in the project structure, all the code lives under the `kotlin` folder. This is something I've done manually by renaming the `java` folder to `kotlin`. This isn't necessary, but I find it cleaner.

## Add Jetpack Compose

Now that we have our empty project, let's start by enabling JetPack Compose under the `android` section in the `app/build.gradle.ktx` file. Do this by adding the following contents in the `android` section and execute a `gradle sync` to implement the change to the project.

```kotlin
buildFeatures {
    compose = true
}

composeOptions {
    kotlinCompilerExtensionVersion = "1.5.4"
}
```

If we go and create a new Activity