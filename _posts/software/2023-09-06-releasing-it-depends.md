---
title: Releasing It Depends
description: Gat a grip on the versions of the dependencies your using by visualizing a generated CycloneDX SBOM file.
author: bart
layout: post
image: assets/images/software/itdepends.png
caption: Screenshot of It Depends with an SBOM loaded
date: 2023-09-06 12:00
categories: [software]
permalink: software/it-depends
tags: [It Depends, software bill of materials, CycloneDX]
---

## Introduction

I'm happy to introduce a new application I've been working on the past couple of weeks, _It Depends_. I've been working on it because at work I'd like to see, and search for that matter, the dependencies of the systems we build. We already configured a pipeline step to generate a SBOM using [CycloneDX for .NET](https://github.com/CycloneDX/cyclonedx-dotnet), so the next step is to view that SBOM.

This is where _It Depends_ comes into the picture to visualize those CycloneDX SBOM reports. Because I like building applications and am a huge fan of open source software, It makes sense to just start building an application and releasing it publicly for everyone to use and not just me.

* [View on Github](https://github.com/bartkessels/it-depends)
* [Download the latest release](https://github.com/bartkessels/it-depends/releases/latest)

As of right now, _It Depends_ can read CycloneDX SBOM files and display them in a GUI (see the image provided in this blogpost).

![itdepends.png](../../assets/images/software/itdepends-screenshot.png)

### Roadmap

#### Transitive dependencies insight

The dependencies list you see on the right side consists of all the dependencies of a software system, including the transitive dependencies. In the future there's going to be an update which allows for a better view of the direct and transitive dependencies which gives you a better insight in what packages you can actually update if necessary.

#### Check for updates

Eventually, _It Depends_ should also be able to connect to Maven Central or Nuget for example. This allows _It Depends_ to display a tag if a newer version is available.

There's a limitation to _It Depends_ however, it will not continuously check for updated versions, only when you open a SBOM file. For this functionality I recommend you use [dependency track](https://dependencytrack.org).