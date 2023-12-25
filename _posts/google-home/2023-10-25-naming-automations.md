---
title: Naming your automations
description: Keep your automations yaml clean by adding names to each automation.
author: bart
layout: post
image: assets/images/google-home/naming-automations.png
caption: This image is generated using Dall-E
prompt: Generate an image of a robot performing multiple tasks and scanning each task for a name in a minimalistic flat style
mermaid: true
date: 2023-10-25 12:00
categories: [google-home]
permalink: google-home/naming-your-automations
tags: [Google Home, Google, smart home, yaml, multiple automations, clean, name]
---

## Introduction

In the [previous post](./2023-10-18-multiple-automations.md) we saw that we can have multiple automations in a single automation file. We also added comments so we know what the automations are without having to reverse engineer the starters and conditions. Instead of using comments we can also give each animation it's own name.

## Adding the name

If we look at a single animation, we can add the `name` attribute to the automation object like this.

```yaml
automations:
  - name: Turn on all the lights in the morning
    starters:
      - type: time.schedule
        at: 06:00am
    condition:
    actions:
```

This makes it very easy to have bigger automations and being able to comprehend what's happening without having to read through the starters and conditions. If, for example, we take our automation from the [previous post](./2023-10-18-multiple-automations.md) we can update it so it looks like this.

```yaml
metadata:
  name: Motion in hallway
  description: Turn on the hallway lights when motion is detected while I'm home and it's dark outside

automations:
  - name: Turn on the lights during the day
    starters:
      - type:  device.state.MotionDetection
        state: motionDetectionEventInProgress
        is: true
        device: MS Hallway - Default
    condition:
      type: and
      conditions:
        - type: home.state.HomePresence
          state: homePresenceMode
          is: HOME
        - type: time.between
          after: sunrise
          before: sunset
    actions:
      - type: device.command.OnOff
        on: true
        devices: Hallway light - Hallway

  - name: Turn on the lights during the night
    starters:
      - type:  device.state.MotionDetection
        state: motionDetectionEventInProgress
        is: true
        device: MS Hallway - Default
    condition:
      type: and
      conditions:
        - type: home.state.HomePresence
          state: homePresenceMode
          is: HOME
        - type: time.between
          after: sunset
          before: sunrise
        - type: or
          conditions:
            - type: device.state.OnOff
              state: on
              is: true
              device: Bedroom Light - Bedroom
            - type: device.state.OnOff
              state: on
              is: true
              device: Living room Light - Living Room
    actions:
      - type: device.command.OnOff
        on: true
        devices: Hallway light - Hallway
```