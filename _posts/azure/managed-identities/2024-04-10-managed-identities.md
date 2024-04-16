---
title: Azure - Managed Identities
description: If you connect to multiple Azure resources, you probably have a lot of connection strings in your code. This can be quite a hassle to manage. Managed Identities can solve this problem by providing a way to authenticate to Azure resources without the need to store credentials in your code.
author: bart
layout: post
image: assets/images/azure/managed-identities/managed-identities.png
caption: This image is generated using Dall-E
prompt: Generate an image of a computer screen with multiple applications that are all connected to each other in a minimalistic flat style
mermaid: false
date: 2024-04-10
categories: [azure]
permalink: azure/managed-identities/introduction
tags: [Azure, Microsoft, Managed Identities, Entra ID]
related: azure
related_to: [azure, managed_identities]
---

Why would you want to use managed identities in the first place? Well, they make it easier for you as a developer to authenticate to other Azure resources without having to configure connection strings for every resource.

Let's say, we have a web app with a database and a service bus connection. In our web app we would need to configure two connection strings. One for the database and one for the service bus. For only two resources, this isn't such a big deal you might think.

But what if we add more resources, we need to add more connection strings. And again, this might not bother you. But the truth is, this configuration doesn't scale. It keeps growing with every resource, and if our web app configuration gets breached, we need to cycle every connection string.

This can be solved by using managed identities. Managed identities are a resource that abstracts the connection strings away in our code, but still authenticates through the Entra ID to the resources the web app connects to [(Microsoft, 2023)](https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/overview).

If we visualize this for both authentication mechanisms, we get the following graph.

```mermaid
graph TD
    
```


- Waarom wil je managed identities gebruiken
- Wat zijn managed identities
  - Hoe staan ze in Entra ID geregistreerd?
  - Hoe werkt het onderwater
  - Wat zijn role assignments
- Hoe configureer je managed identities
  - Hoe zet je een managed identity op voor Azure
  - Hoe gebruik je de managed identity in je code
  - Hoe ga je om met lokaal de code draaien