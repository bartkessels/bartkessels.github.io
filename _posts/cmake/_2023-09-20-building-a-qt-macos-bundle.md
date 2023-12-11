---
title: Building a Qt MacOS bundle using CMake
toc: true
mermaid: true
date: 2023-09-13 00:15:00 +02
categories: [CMake]
permalink: cmake/building-a-qt-macos-bundle
tags: [Qt, CMake, MacOS, bundle, It Depends, automated]
---

## Introduction

The past couple of weeks I've been working on a new project, a Qt Widgets desktop application.

As with all software projects, the question arises "how to properly build and release it?". For API's and mobile applications this is easilly answered because there's an API to either release to the cloud, the Apple App Store and the Google Play Store. But for generic desktop applications this is a bit harder.

Because, that same question can be split up in two
