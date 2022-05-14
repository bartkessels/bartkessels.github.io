---
layout: post
title:  "Rewriting GetIt"
summary: "Rewrite of GetIt from GTK to Qt"
author: bartkessels
date: '2022-01-01'
displayThumbnail: false
thumbnail: /assets/img/posts/getit.png
keywords: GetIt, Qt, Gtk, C++
permalink: /blog/getit-rewrite/
usemathjax: true
---

As of right now GetIt is undergoing a massive rewrite to make the application more stable and
testable. This means that the branch you're currently watching (main) most likely contains a
broken build. If you need a working copy of GetIt please checkout the `main_old` or `master`
branches of the [GetIt github repo](https://github.com/bartkessels/GetIt).

The current state of GetIt is that the core functionality is done, thus meaning that it's able
to send a request and receive the response. This is however only possible by using the classes
directly (in other words, you need to modify the code yourself). The UI is another hurdle that
I'm trying to tackle in the best possible way, meaning that I want to decouple the UI logic from
the UI to make it testable. As of right now I've no exact idea of how I want (or going) to
accomplish this. So please check back in a couple of weeks to view the progress!