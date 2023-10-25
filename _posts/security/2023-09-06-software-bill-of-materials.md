---
title: Software Bill of Materials
toc: true
mermaid: true
date: 2023-09-06 00:15:00 +02
categories: [Security]
permalink: security/software-bill-of-materials
tags: [software bill of materials, CycloneDX, OWASP, Log4Shell, Dependency Track, It Depends]
---

## Introduction

As a software developer it's important to know what dependencies your application are using. This is especially true after the vulnerability we've seen in versions _2.0-beta9_ to _2.14.1_ of _Log4J_ called _Log4Shell_ if you still remember that [(CISA, December 2021)](https://www.cisa.gov/news-events/cybersecurity-advisories/aa21-356a), [(NCSC, December 2021)](https://english.ncsc.nl/latest/news/2021/12/11/update-install-updates-to-address-serious-vulnerability-in-apache-log4j).

That December a lot of developers needed to search through their own systems and verify that they didn't use _Log4J_ or the impacted versions for that matter. But, that's not all there's to it. You might easily see the versions of the direct dependencies you're using, but what about transitive dependencies (i.e. the dependencies of your dependencies).

## SBOM

In order to know what your dependency tree looks like, you can generate a SBOM for your system. A SBOM, of software bill-of-materials, is a file that describes all your dependencies and transitive dependencies. This allows you to easily see all the dependencies that are (indirectly) used by your system, accompanied by their versions [(CISA, nd.)](https://www.cisa.gov/sbom), [(NCSC, nd.)](https://english.ncsc.nl/research/research-results/using-the-software-bill-of-materials-for-enhancing-cybersecurity). This last part is important to easily scan if you're, for example, using a vulnerable version of _Log4J_.

## CycloneDX

Now that we know how we can extract all our dependencies from our system, we need to get a specification so multiple tools can work together for either the generating of the SBOM or the reading of the SBOM.

Luckily, the Open World Wide Application Security Project or OWASP [(OWASP, nd.)](https://owasp.org/about/) has our covered. They've created a standard called CycloneDX which is a specification used to describe the structure of the SBOM file [(OWASP, nd.)](https://cyclonedx.org/capabilities/sbom/).

## Getting insights

Now that you've created your CycloneDX SBOM file, you need to get insights from that SBOM. We know the problem we want to solve, checking if we (indirectly) use a vulnerable package.

There are two routes you can take to get insights into your dependency versions.

1. Check the versions by hand, not continuously
2. Automatically check the versions continuously

For this first route you can use a tool like [_It Depends_](https://bartkessels.net/it-depends/releasing-it-depends). And for the second route you can use a tool like [_Dependency Track_](https://dependencytrack.org).

## Recommendation

Given the fact that vulnerabilities can be found at any time, I would recommend to set up a tool that continuously scans your SBOM for vulnerabilities. But to be effective, you should generate your SBOM every time you release you application into production. The reason you'd want that, is so you have insights in the dependency versions that are actually deployed and being used by a real audience.

In the current time and age, I assume you're already using a pipeline to build and deploy your application into production. In that same pipeline you'd want to add an extra step to generate a SBOM based on the version that's going to be deployed. You should then upload this SBOM into your own _Dependency Track_ server and check the results. This has the benefit, that, when a vulnerability is found your _Dependency Track_ server will notify you that you're using a vulnerable dependency in production without having to manually check which dependency or which version is vulnerable.

If, however, you don't have means to set up your own _Dependency Track_ server I'd recommend to at least check your dependency versions by hand using something like [_It Depends_](https://bartkessels.net/it-depends/releasing-it-depends) and keep an eye the updates of your dependencies or check your counties software security center updates.
