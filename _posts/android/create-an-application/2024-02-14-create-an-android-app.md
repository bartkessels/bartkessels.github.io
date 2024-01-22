---
title: Create an Android app
description: Have you ever wanted to build your own Android app? We'll in this story we're going to dive straight into the details on how to do this!
author: bart
layout: post
image: assets/images/android/create-an-application/create-an-android-app.png
caption: This image is generated using Dall-E
prompt: Generate an image of a person sitting behind a computer screen which is displaying a phone on the screen in a minimalistic flat style
date: 2024-02-14
categories: [android]
permalink: android/create-an-android-app
tags: [Android, App Development]
related: create_android_app
related_to: [android]
story: true
featured: true
---

Have you ever had the urge to build your own Android app? Well, I have, and in this story I'll be covering the basics on how you can build an Android app.

The app we'll be building is just a small hello world application, but it will be using the latest Android technologies. The reason for this simple application is that I can use this story as an accelerator when I want to either build an app or want to test some new features in Android.

## Prerequisites

Before we can start building our application, let's make sure that we have everything we need.

1. Download and install [Android Studio](https://developer.android.com/studio)
2. Setup a [virtual Android device](https://developer.android.com/studio/run/managing-avds)<sup>1</sup>
3. Some knowledge about the Android lifecycle and Kotlin

<sup>1</sup>: Skip this step if you have an actual device

## Create the project

The project can be created using the wizard in Android Studio where I've used the following settings. You can obviously change them to your own needs.

* __Template__: No Activity
* __Name__: My Application
* __Package name__: net.bartkessels.myapplication
* __Language__: Kotlin
* __Minimum SDK__: 26 (Oreo)
* __Build configuration language__: Kotlin DSL

However, changing the template might cause some extra work if you're going to use Jetpack compose eventually as the template you can choose might include the old school XML-views. This isn't a big deal, but might take some extra time to remove them.

## Project structure

When running the wizard with the previously mentioned settings, your folder structure should look like this (I've ignored the Gradle scripts).

One thing that I always change when creating a new project is changing the name of the `java`-folder to `kotlin`. This isn't necessary, but I find it cleaner. If you choose to keep the `java`-folder, this won't impact your application. You need to be aware of the fact that the following posts will be referencing the `kotlin`-folder.

```
- app/
  - src/
    - androidTest/
      - kotlin/
        - net.bartkessels.myapplication/
    - main/
      - kotlin/
        - net.bartkessels.myapplication/
      - res/
        - drawable/
        - mipmap-*/
        - values/
        - values-night/
        - xml
    - test/
      - kotlin/
        - net.bartkessels.myapplication/
  - build.gradle.kts
- build.gradle.kts
- gradle.properties
- settings.gradle.kts
```

## Running the project

You want to run your project to see what you've just created. However, we haven't created anything as far as Android is aware. So, running your application will result in the `Default Activity not found` error message in Android Studio.

Where regular applications rely on a `main` method or function, Android requires the use of _Activities_ as an entry point [(Google, 2024)](https://developer.android.com/guide/components/activities/intro-activities). And as you see, the _No Activity_ template does not include an activity (just like the name says).

In the following stories we'll be creating an activity, and you'll be able to run your own application!