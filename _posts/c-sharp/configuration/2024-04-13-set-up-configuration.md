---
title: Set up configuration in C#
description: When building a C# application you're most likely than not going to need some sort of configuration. Whether it's API management keys or a feature flag. In this story we'll dive into the magic of loading configuration.
story: true
author: bart
layout: post
image: assets/images/c-sharp/configuration/set-up-configuration.png
caption: This image is generated using Dall-E
prompt: Generate an image of computer screen with multiple screens which all have a arrow pointing at the center most screen in a minimalistic flat style
featured: true
mermaid: false
date: 2023-04-13
categories: [c-sharp]
permalink: csharp/configuration/set-up-configuration
tags: [.NET, Microsoft, C#, C# 12]
related: csharp_configuration
related_to: [csharp]
---

In your C# application, it's pretty likely that you will be needing some sort of configuration. This can be anything from uri's pointing to external API's you need to access to feature flags that need to be flipped when you've deployed your application.

Luckily .NET has us covered with [ConfigurationBuilder](https://learn.microsoft.com/en-us/dotnet/api/microsoft.extensions.configuration.configurationbuilder?view=dotnet-plat-ext-8.0). This builder is used to store and retrieve key-value settings. These can, for example, be stored in a JSON file and retrieved during run time [(Microsoft, n.d.)](https://learn.microsoft.com/en-us/dotnet/api/microsoft.extensions.configuration.configurationbuilder?view=dotnet-plat-ext-8.0).

When we work with configuration, we usually also want to store data that should be kept outside the JSON configuration file, because it might contain data that is either unique for each developer or environment, or it might be sensitive and thus shouldn't be stored in a file that can be checked in with Git. To achieve this, the .NET framework has the `IConfigurationSource` interface where multiple providers inherit from, we can inject the configuration source we want using the `Add` extension method on the `ConfigurationBuilder` [(Microsoft, n.d.)](https://learn.microsoft.com/en-us/dotnet/api/microsoft.extensions.configuration.configurationbuilder.add?view=dotnet-plat-ext-8.0#microsoft-extensions-configuration-configurationbuilder-add(microsoft-extensions-configuration-iconfigurationsource)).

If we take a look at the documentation for the `IConfigurationSource` interface, we see a list of source that are available straight from the get go [(Microsoft, n.d.)](https://learn.microsoft.com/en-us/dotnet/api/microsoft.extensions.configuration.iconfigurationsource?view=dotnet-plat-ext-8.0).

* Command line
* Environment variables
* File configuration
* Memory configuration

In the upcoming blog posts, we'll dive deeper into the specifics of the C# configuration capabilities.

## Project setup

In the following posts, we'll be using the following project setup for our test application.

@TODO: Describe the set up of the .NET project
@TODO: Describe the prerequisites (.NET 8, Azure subscription)