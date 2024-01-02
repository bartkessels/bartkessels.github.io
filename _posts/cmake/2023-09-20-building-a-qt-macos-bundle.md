---
title: Building a Qt MacOS bundle using CMake
description: Build a stand-alone Windows executable of your Qt application using CMake.
author: bart
layout: post
image: assets/images/cmake/building-qt-macos-bundle.png
caption: This image is generated using Dall-E
prompt: Generate an image of an iMac displaying a spinning gear which is connected to an application icon in minimalistic flat style
mermaid: true
date: 2023-09-20 12:00
categories: [cmake]
permalink: cmake/building-a-qt-macos-bundle
tags: [Qt, CMake, MacOS, bundle, It Depends, automated]
related: cmake_build_qt_application
related_to: [cmake_build_qt_application, cmake_target]
---

## Introduction

The past couple of weeks I've been working on a new project, a Qt Widgets desktop application called It Depends.

As with all software projects, the question arises "how to properly build and release it?". For API's and mobile applications this is easily answered because there's an API to either release to the cloud, the Apple App Store and the Google Play Store. But for generic desktop applications this is a bit harder.

But tracing back this question, the first that needs to happen is it should be built automatically in a pipeline. After that we can start worrying about publishing it to some sort of store.
Because the project I'm working on is built using C++ with CMake I'd like to use CMake for the entire lifecycle management of the application, from compiling to publishing.

## Setting up the folder structure

For my application I have the following folder structure

```
- src/
  - main.cpp
  - CMakeLists.txt
- packaging/
  - macos/
    - icons/
      - icon.icns
      - CMakeLists.txt
    - CMakeLists.txt
- CMakeLists.txt
```

Where in the source folder the all the source code files are linked to the dependencies and are being compiled into the specified target.
In the packaging folder I have all the logic for each platform to publish for that specific platform, in the `packaging/CMakeLists.txt` file is just a simple `if-statement` to include the correct platform, for this tutorial that is going to be macOS.

For this tutorial we're going to use the setup from the [use CMake target in other folder](2023-09-13-use-cmake-target-in-another-folder.md) post from earlier.

__CMakeLists.txt__
```cmake
cmake_minimum_required(VERSION 3.15 FATAL_ERROR)

add_subdirectory(./src)
```

__src/main.cpp__
```cpp
int main(int argc, char** args)
{
  return 0;
}
```

__src/CMakeLists.txt__
```cmake
cmake_minimum_required(VERSION 3.15 FATAL_ERROR)

add_executable(
      test_target
      main.cpp
)

include(../packaging/CMakeLists.txt)
```

__packaging/CMakeLists.txt__
```cmake
cmake_minimum_required(VERSION 3.15 FATAL_ERROR)

set(CMAKE_INSTALL_PREFIX ${CMAKE_BINARY_DIR})

if(APPLE)
    include(${CMAKE_SOURCE_DIR}/packaging/macos/CMakeLists.txt)
endif()
```

Why this works, I suggest you read the [use CMake target in another folder](2023-09-13-use-cmake-target-in-another-folder.md) post from before.

Now we're going to implement the `CMakeLists.txt` file for the `packaging/macos` target with the following contents

```cmake
cmake_minimum_required(VERSION 3.15 FATAL_ERROR)

set(CPACK_BUNDLE_NAME ${CMAKE_PROJECT_NAME})
set(CPACK_GENERATOR "DragNDrop")

get_target_property(qmake_executable Qt5::qmake IMPORTED_LOCATION)
get_filename_component(_qt_bin_dir "${qmake_executable}" DIRECTORY)
find_program(MACDEPLOYQT_BIN macdeployqt HINT "${_qt_bin_dir}")

# Link Qt dependencies to TestTarget.app bundle
add_custom_command(TARGET ${CMAKE_PROJECT_NAME} POST_BUILD
        COMMAND ${MACDEPLOYQT_BIN} ${BUNDLE_NAME} -always-overwrite
)
```

What this file does, it tries to locate QMake executable using the `get_target_property(qmake_executable Qt5::qmake IMPORTED_LOCATION)` function. This still uses Qt5, so for Qt6 you might need to update it to `Qt` or `Qt6`.
And puts it into the `qmake_executable` variable.

Since we don't need the QMake executable but just the installation directory of Qt, we'll be using the `get_filename_component` function with the `DIRECTORY` argument to just get the directory where the QMake executable is located.
This will be stored inside the `_qt_bin_dir` variable.

Next we'll try to locate the `macdeployqt` executable which will copy the Qt dependencies to our own executable using the `find_program` function. To help CMake find the executable we give the `_qt_bin_dir` as the `HINT` argument.
This output will be stored in the `MACDEPLOYQT_BIN` command.

After all these steps we have the executable we need to execute __AFTER__ our build has finished. This is thus dependent on our target, which is the reason why we're using the `include(../packaging)` command after we declare our target using `add_executable(test_target main.cpp)` in the `src/CMakeLists.txt` file.

Therefore, we make use of the `add_custom_command` function with the `POST_BUILD` argument. Using this function we can execute any system command we'd like, and thus fire the `macdeployqt` command which is stored in our variable with the executable name as an argument to the `macdeployqt` command.
To make sure our application is re-linked every time we build again, we add the `-always-overwrite` flag to the `macdeployqt` call. This is

## Add a custom icon for your application

When using the `CMakeLists.txt` file from above it will give you an app bundle without an icon. To fix this we need to copy an icon into the app bundle itself.
This can be done using the `cp` command because an app bundle is basically a folder.

```cmake
add_custom_command(TARGET ${CMAKE_PROJECT_NAME} POST_BUILD
        COMMAND cp ${CMAKE_BINARY_DIR}/packaging/macos/icons/icon.icns ${BUNDLE_NAME}/Contents/Resources
)
```

## Build the macOS app bundle

To build our executable we can simply use our default generator with CMake and build it.

```bash
$ cmake . -G Ninja
$ ninja test_target
```

This will generate a stand-alone app bundle of your Qt application which is ready to be deployed.