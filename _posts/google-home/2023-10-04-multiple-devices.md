---
title: Easily turn on or off multiple lights
description: Cleanup your automations by controlling multiple lights in the same step.
author: bart
layout: post
image: assets/images/google-home/control-multiple-lights-at-once.png
caption: This image is generated using Dall-E
prompt: Generate an image of a person trying to control multiple lights in a small home in the dark in a minimalistic flat style
date: 2023-10-04 12:00
categories: [google-home]
permalink: google-home/easily-control-multiple-lights
tags: [Google Home, Google, smart home, conditions, yaml, multiple lights, turn on, turn off]
---

## Introduction

Recently I was creating an automation where I wanted to turn of multiple lights at once. The automation was supposed to turn off all the lights in the living room and the kitchen when the sun comes up. The hallway lights still needed to be on because there’s no sunlight in the hallway. Therefore, I couldn’t just run the turn off all lights voice command.

### The verbose method

Now is this very easy using the yaml automations where you can just copy the action and change the name of the light, but to me this didn’t look very pleasing having more than five lights. Because it looked like this.

```yaml
# ... redacted

automations:  
  # ... redacted

  actions:
    - type: device.command.OnOff
      on: false
      devices: Hallway light - Hallway
    - type: device.command.OnOff
      on: false
      devices: Front light - Living Room
    - type: device.command.OnOff
      on: false
      devices: Back light - Living Room
```

### The cleaner method

After some playing with the onOff action and trying to use the collection syntax of yaml [(YAML Language Development Team, 2021)](https://yaml.org/spec/1.2.2/#collections). And if we look at the documentation that Google provides, we see that the device actions support the use of multiple devices with the collection syntax [(Google, n.d.)](https://support.google.com/googlenest/answer/13460475?sjid=4162496325683235059-EU#actions&zippy=%2Cdevice-actions%2Cactions).

So if we use the collections instead of copying the action for each light our yaml file will look like this.


```yaml
# ... redacted

automations:  
  # ... redacted

  actions:
    - type: device.command.OnOff
      on: false
      devices:
        - Hallway light - Hallway
        - Front light - Living Room
        - Back light - Living Room
```

As you see, this looks a lot cleaner than our previous verbose method of copying each action.