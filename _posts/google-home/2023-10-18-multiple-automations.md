---
title: Keep your automations clean
toc: true
mermaid: true
date: 2023-10-18 00:15:00 +02
categories: [Google Home]
permalink: google-home/keep-your-automations-clean
tags: [Google Home, Google, smart home, yaml, multiple automations, clean]
---

## Introduction

Since Google has introduced their new [automations](https://home.google.com/the-latest/) tool, I've been moving everything back from Siri Shortcuts to the Google Home ecosystem. After adding all the animations one by one, the overview was completely gone. We had more than twenty automations all with different names and different starters. When an automation wasn't working properly, for example the lights would "flash" bright and then turn to a brightness of 70%, I had to search in the overview for the correct automations and then guess which one was the cause of the problem.

As you might think yourself, this was far from what I dreamt would be the ideal smart home setup. That's when I started Googling for a solution to add conditions to a specific starter.

## Case

The first thing I wanted were the hallway lights to always turn on during the day, but at night only when either the living room lights are on or when the bedroom light is on. What I wanted was this (note, this does not work):

```yaml
metadata:
  name: Motion in hallway
  description: Turn on the hallway lights when motion is detected while I'm home and it's dark outside

automations:
  starters:
    - type:  device.state.MotionDetection
      state: motionDetectionEventInProgress
      is: true
      device: MS Hallway - Default
      condition:
        type: home.state.HomePresence
        state: homePresenceMode
        is: HOME
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
```

But that didn't pass the validation step in the editor, thus I got back to Googling another solution.

## Multiple starters

When Googling I came across another example from Google where I saw something that was just what I wanted. There's an option to add multiple automations using the collection syntax from yaml [(YAML Language Development Team, 2021)](https://yaml.org/spec/1.2.2/#collections)!

This gives us the option to have multiple different starters with their own conditions to be placed in the same automation, thus keeping our overview clean and making it easy to group automations.

Given our previous automation, we can turn that into a working automation by rewriting it.

```yaml
metadata:
  name: Motion in hallway
  description: Turn on the hallway lights when motion is detected while I'm home and it's dark outside

automations:
  # Turn on the lights during the day
  - starters:
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

  # Turn on the lights during the night
  - starters:
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
