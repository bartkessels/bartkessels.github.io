---
title: Releasing Upset
description: I've been struggling with my work laptop which meant that I had to reinstall everything a couple of times. So, offcourse I wrote an application to automate this process.
author: bart
layout: post
featured: true
image: assets/images/software/upset.png
caption: This image is generated using Dall-E
prompt: Generate an image of a person installing their computer and looking really exhausted in a minimalistic flat style
date: 2023-12-13 12:00
categories: [software]
permalink: software/upset
tags: [Installation, setting up, Windows, MacOS, Linux]
---

## Introduction

In the last couple of weeks I've had a bit of a rough patch with my work laptop. Which lead me to installing it over and over again.

The last time I had to get my laptop fixed by reinstalling Windows, I had this idea of creating an application which would do all the setup for me. But since it's a Windows laptop
that would lead to me having to write a Powershell script. Well, me being me, I din't really like that idea and I wanted to experiment in Rust a little bit anyway. So I decided
to create a Rust CLI application which would setup any computer using a yaml-configuration file.

And the name, as you might have guessed, is __Upset__. The reason behind this name is pretty clear, I was really upset with having to install my computer again (for the second time
that day), and it's an anagram for _set up_ which I find pretty funny.

* [View it on Github](https://github.com/bartkessels/upset)

## Roadmap

We'll Upset isn't quite finished yet, there are still some features I'd like to implement in the upcoming future.

* Add an extra required option to validate the required commands
    - In such a way, that if you configure Git as your VCS, it won't clone anything because it knows Git is not installed
* A method to copy files
* Setup an automatic pipeline to build an executable for each platform

## Contribute

If you're an open source fanatic as well, and love to digg a little into Rust I'd like to invite you to contribte to Upset. This can either be trough code-reviews, adding a feature you'd like
or even just submitting issues you've noticed.