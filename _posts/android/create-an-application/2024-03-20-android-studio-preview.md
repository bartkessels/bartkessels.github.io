---
title: Enable UI preview in Android Studio
description: When developing an Android app, you're likely to iterate through multiple UIs. When going through this process you don't want to build and run your app every iteration, for this you can use previews in Android Studio.
author: bart
layout: post
image: assets/images/android/create-an-application/android-studio-preview.png
caption: This image is generated using Dall-E
prompt: Generate an image of an integrated development environment on a computer screen which displays a phone UI in a flat minimalistic style
date: 2024-03-20
categories: [android]
permalink: android/enable-android-studio-preview
tags: [Android, Jetpack Compose, UI, App Development, UI Preview, Android Studio]
related: create_android_app
related_to: [android, jetpack_compose, create_android_app]
---

In our previous posts about [setting up Jetpack Compose](./2024-02-21-set-up-jetpack-compose.md) and [setting up Material Design](./2024-03-06-set-up-material-design.md) we've been through two UI iterations. To see each iteration we had to build and run our app. Now, this isn't that bad for just two iterations and our small UI, but let's say your working on a big project which consists of multiple components where you'd like to see each component separate from the entire app. This might become pretty tedious when you have to build your entire app just to see how a little component looks.

Luckily for this, we can use previews in Android Studio. This is different from the old XML-views we knew before, because the main difference between the View-based UI and Jetpack Compose is the fact that Compose doesn't need a View to render it's composables. Because of this, we can view the UI in Android Studio without having to run the app on an emulator or Android device [(Google, 2024)](https://developer.android.com/jetpack/compose/tooling).

## Add the dependency

For the Android Studio Preview to work, we need to install a dependency `androidx.compose.ui:ui-tooling-preview` in our `app` module.

```kotlin
dependencies {
    // ...
    
    implementation("androidx.compose.ui:ui-tooling-preview")
    debugImplementation("androidx.compose.ui:ui-tooling")
    
    // ...
}
```

This gives us the `Preview` annotation, which in turn will enable us to preview our UI without having to connect to an emulator in Android Studio [(Google, 2024)](https://developer.android.com/jetpack/compose/tooling/previews).

Execute a gradle sync and we're ready to preview our UI.

## Create a preview

Our `Main` composable lives inside the `main.kt` file, let's open this file and refactor the `Main` composable so it isn't as dependent on the view model as it is now. The reason that this is a problem is that we don't want to mock or stub our view model in the preview. We only want to display the preview as is, without it doing weird things because of the view model.

We'll create a new private composable called `MainInternal` which will have two parameters, on for the onClick handler of the button and one for the `MainState`.

```kotlin
@Composable
private fun MainInternal(
    state: MainState,
    onButtonClick: () -> Unit
) {
    val textToDisplay = when (state) {
        MainState.Uninitialized -> R.string.uninitialized_text
        MainState.Updated -> R.string.updated_text
    }

    Column {
        Text(stringResource(textToDisplay))
        Button(onClick = onButtonClick) {
            Text(stringResource(R.string.update_text_button))
        }
    }
}
```

Now we'll have to update our `Main` composable to only call the `MainInternal` composable with the parameters that we'll get from our view model.

```kotlin
@Composable
fun Main(
    viewModel: MainViewModel
) {
    MainInternal(
        state = viewModel.displayText.collectAsState().value,
        onButtonClick = viewModel::updateText
    )
}
```

Our app will look and function exactly the same as before, only now we have decoupled the view model from the actual view that we'd like to preview. Let's create a new private composable as our preview and let it call the `MainInternal` composable. Much like our `Main` composable the only difference will be that our preview composable will have the `Preview` annotation added.

```kotlin
@Preview
@Composable
private fun MainInternalPreview() {
    MainInternal(
        state = MainState.Uninitialized,
        onButtonClick = { }
    )
}
```

As you can see, we can give the `MainInternal` composable the exact values of the state that we want to display. So if we changed the logic of what it should do in case of an `Updated` state, we can just change the `MainState.Uninitialized` state parameter to `MainState.Updated` and our preview would render the `MainInternal` composable again with the different state.

Our entire `main.kt` file should look like this.

```kotlin
// ...

@Composable
fun Main(
    viewModel: MainViewModel
) {
    MainInternal(
        state = viewModel.displayText.collectAsState().value,
        onButtonClick = viewModel::updateText
    )
}

@Composable
private fun MainInternal(
    state: MainState,
    onButtonClick: () -> Unit
) {
    val textToDisplay = when (state) {
        MainState.Uninitialized -> R.string.uninitialized_text
        MainState.Updated -> R.string.updated_text
    }

    Column {
        Text(stringResource(textToDisplay))
        Button(onClick = onButtonClick) {
            Text(stringResource(R.string.update_text_button))
        }
    }
}

@Preview
@Composable
private fun MainInternalPreview() {
    MainInternal(
        state = MainState.Uninitialized,
        onButtonClick = { }
    )
}
```

## Display the preview

If we build the application, Android Studio should display the preview window by default, otherwise you can click on the _Code & Preview_ button in the upper right corner of the file you have open.

![Android Studio with code and the preview](/assets/images/android/create-an-application/android-studio-code-with-preview.png)