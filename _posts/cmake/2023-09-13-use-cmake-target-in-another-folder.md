---
title: Use CMake target in another folder
description: Use the same CMake target from one folder in another (sub)directory using CMake's include function.
author: bart
layout: post
image: assets/images/cmake/cmake-target-in-other-folder.png
caption: This image is generated using Dall-E
prompt: Generate an image of a file that references other files from a directory in a minimalistic flat style
mermaid: true
date: 2023-09-13 12:00
categories: [cmake]
permalink: cmake/use-cmake-target-in-another-folder
tags: [CMake, include, add_subdirectory, target, different folder, scope]
---

## Introduction

With the release of [_It Depends_](../it-depends/2023-09-06-releasing-it-depends.md), I've been searching for a way to execute a command after a target has been built. The reason for this is that I'd like to have a flag which will trigger the `macdeployqt` application on the generated app bundle.

However, to make things more complicated, I want to do this in CMake on the default _It Depends_  target but I'd like to do this in a different `CMakeFile.txt` in a different folder from where the _It Depends_ target is created. So roughly the structure looks like this

* src/
    * CMakeLists.txt (`<- It Depends target is created here`)
* packaging/
    * CmakeLists.txt(`<- macdeployqt should be triggered here after the build of It Depends`)
* CmakeLists.txt (`<- include both folders here`)

Why is this complicated you might ask. Well, you can't access a target that's created in another CMakeLists.txt in a different folder.

Logically thinking you'd add both directories in the root `CMakeLists.txt` and that's all there is to it. Unfortunatly it's not that easy (well almost, I'll explain later).

### Test setup

So to test whether it's possible to add a `POST_BUILD` command to a target that's created in another folder, let's setup a test project.

Create the following file structure

* src/
    * main.cpp
    * CMakeLists.txt
* packaging/
    * CMakeLists.txt
* CMakeLists.txt

And give them the following contents

__CMakeLists.txt__
```cmake
cmake_minimum_required(VERSION 3.15 FATAL_ERROR)

add_subdirectory(./src)
add_subdirectory(./packaging)
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
```

__packaging/CMakeLists.txt__
```cmake
cmake_minimum_required(VERSION 3.15 FATAL_ERROR)

add_custom_command(TARGET test_target POST_BUILD
  COMMAND echo "The project has been built!"
)
```

### add_subdirectory

The first thought is to add `add_subdirectory(./packaging)` in the root `CMakeLists.txt` and add a reference to the `test_target` target in the `src/CMakeLists.txt` to execute a command after the build has finished. So this look exactly like our test setup above.

When running `cmake .` I got the following error message

```
CMake Error at packaging/CMakeLists.txt:3 (add_custom_command):
  TARGET 'test_target' was not created in this directory.
```

As you see, this message is pretty clear. We are simply not allowed to access the target from another directory.

### include

So I started searching the CMake documentation and came across the `include` function. Which, according to the documentation

> Loads and runs CMake code from the file given. Variable reads and writes access the scope of the caller [...]

Thus, meaning that if we call `include(../packaging/CmakeLists.txt)` from our `src/CMakeLists.txt` file we are in the same scope as where the target is created.

If we then run `cmake .` and build our target, we should be able to execute our custom command after the target is built.

So modify the `CMakeLists.txt` in the root and the `src/CMakeLists.txt` to look like this.


```cmake
cmake_minimum_required(VERSION 3.15 FATAL_ERROR)

add_executable(
      test_target
      main.cpp
)

include(../packaging) # <- Add this line
```
{: file="src/CMakeLists.txt" }

```cmake
cmake_minimum_required(VERSION 3.15 FATAL_ERROR)

add_subdirectory(./src)
# add_subdirectory(./packaging) # <- Remove this line
```
{: file="CMakeLists.txt" }

Well, this gives us the following error message.

```
CMake Error at src/CMakeLists.txt:8 (include):
  include requested file is a directory:

    ../packaging
```

Luckily it implicitly mentions the solution, we need to reference a file instead of a directory. So update the `include(../packaging)` line to `include(../packaging/CMakeLists.txt)` in `src/CMakeLists.txt`.

If we built our target, we see the following correct output:

```
[2/2] Linking CXX executable src/test_target
The project has been built!
```

### Solution

As explained above, we need to use the `include` function inside our `src/CMakeLists.txt` file (or the `CMakeLists.txt` file where you create your target).

This will allow you to use the same scope inside the `packaging` folder that you have in the `src` folder.

To recap and use the example structure again, we have the following folder structure.

* scr/
    * main.cpp
    * CMakeLists.txt
* packaging
    * CMakeLists.txt
* CMakeLists.txt

Where the files have the following contents.

```cmake
cmake_minimum_required(VERSION 3.15 FATAL_ERROR)

add_subdirectory(./src)
```
{: file="CMakeLists.txt" }


```cpp
int main(int argc, char** args)
{
  return 0;
}
```
{: file="src/main.cpp" }

```cmake
cmake_minimum_required(VERSION 3.15 FATAL_ERROR)

add_executable(
      test_target
      main.cpp
)

include(../packaging/CMakeLists.txt)
```
{: file="src/CMakeLists.txt" }

```cmake
cmake_minimum_required(VERSION 3.15 FATAL_ERROR)

add_custom_command(TARGET test_target POST_BUILD
  COMMAND echo "The project has been built!"
)
```
{: file="packaging/CMakeLists.txt" }

When we build the project, using Ninja in this example, we get the following output.

```bash
$ cmake . -G Ninja
Configuring [...]
$ ninja test_target
[2/2] Linking CXX executable src/test_target
The project has been built!
```