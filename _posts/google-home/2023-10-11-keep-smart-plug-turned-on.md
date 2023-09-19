---
title: Keep your smart plug turned on
toc: true
mermaid: true
date: 2023-10-11 00:15:00 +02
categories: [Google Home]
permalink: google-home/keep-your-smart-plug-turned-on
tags: [Google Home, Google, smart home, yaml, multiple lights, smart plug]
---

## Introduction

A couple of weeks back we bought a Philips smart plug so we can turn on and off the phone chargers when we're in bed. Our idea was that when we're out of bed or not at home, those chargers don't need to be on all the time. And what better way to do this than to use a smart plug.

But you might have a smart plug yourself and you might have noticed some odd (at least to me) behavior. When I was setting up the smart plug in the Philips Hue app, I clicked on adding a smart plug and instantly the "Add lights" screen popped up. So I closed that screen 'cause I don't want to setup a light. Again clicking the smart plug button and the "Add lights" screen came up. So I thought okay, this is kinda weird but let's go. Once I added the smart plug through the "Add lights" set up, I could add them to Google Home and start automating the plug.

## It turns off

That evening when we went to bed the smart plug was already turned on, it lives behind a timer automation, so we were really excited (I was at least). But as we do every evening we ask Google to turn off all the lights, and we hear this clicking noise without thinking anything about it. Cue the next morning, we wake up with our phones not charged and no indication that the chargers were on. So we ask Google to turn on the smart plug and our phones began charging.

That evening the same happened, we turn off all the lights and hear that clicking noise again. We knew that that noise was probably the smart plug so we also ask Google to turn on the smart plug and all was well. At least, for that evening.

## Keep the smart plug on

So I started tinkering in the Philips Hue app and the Google Home app so Google wouldn't see the smart plug as a light. When I saw the option in the Google Home app to change the type of the device I immediately set is as a plug hoping it would work. unfortunately, it didn't.

At that point I had kind of lost the hope that it would work so I gave myself a couple of days to think it over, not being able to let it go. All of a sudden I had this idea that I can update the automation that turns on the smart plug at a specific time, to also turn on the smart plug when it's turned off. The only thing I needed to add was a condition for the specific time range I want the plug to be on.

After testing that out for a couple of days, I am happy to share with you that it works! So here's my automation to keep the smart plug on when turning off all the lights.


```yaml
metadata:
  name: Smart plug bedroom
  description: Turn on the smart plug in the bedroom when it's (almost) bedtime

automations:
  starters:
    - type: time.schedule
      at: 9:30pm
    - type: home.state.HomePresence
      state: homePresenceMode
      is: HOME
    - type: device.state.OnOff
      state: on
      is: false
      device: Plug bedroom - Bedroom

  condition:
    type: and
    conditions:
      - type: time.between
        before: 09:00am
        after: 9:30pm
      - type: home.state.HomePresence
        state: homePresenceMode
        is: HOME

  actions:
    - type: device.command.OnOff
      on: true
      device: Plug bedroom - Bedroom
```

This automation turns the smart plug on when

* It's 9:30 pm and someone is home
* Someone comes home between 9 am and 9:30 pm
* When the smart plug is turned off between 9 am and 9:30 pm when someone is home
