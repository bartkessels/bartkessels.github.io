---
title: Plural string resource in your Android app
description: When your app supports multiple languages using the string resources, it's pretty assumable that at some point you'll be needing a string that is different for multiple amounts. In this blogpost we'll be discussing the solution on how to achieve this.
author: bart
layout: post
image: assets/images/android/plural-string-resource.png
caption: This image is generated using Dall-E
prompt: Generate an image of a phone displaying an xml file with multiple lines of text with numbers in a minimalistic flat style
date: 2024-03-04
categories: [android]
permalink: android/plural-string-resource
tags: [Android, UI, App Development, Multiple languages, i8n]
related: support-multiple-languages
related_to: [android]
---

In a [previous post](./create-an-application/2024-03-13-support-multiple-languages.md) about supporting multiple languages, we've discussed the use of string resources. Which are XML-files where you store the strings that are used in your app. 

This is a great way to support multiple languages, but what if you want to display a string to the user that is different for multiple amounts? For example, you want to display the string _You have clicked 1 time_ or _You have clicked 2 times_.

For this blogpost we'll be contuining with the app we've created in the [Create an Android app story](./create-an-application/2024-02-14-create-an-android-app.md), only on a different branch. We'll be using the [feature/plural-string-resource](https://github.com/bartkessels/basic-android-app/tree/feature/plural-string-resource) branch.

## Update the ViewModel

Before we'll add the string resource, we need to update our view model to keep track of the number of times we've clicked the button. We'll be adding a new property to our view model called `clickCount`.

```kotlin
// ... redacted

class MainViewModel: ViewModel() {
    private var clickCount = 0
    private val _displayText = MutableStateFlow<MainState>(MainState.Uninitialized)
    val displayText = _displayText.asStateFlow()

    fun updateText() {
        clickCount++
        _displayText.update { MainState.Updated }
    }
}

// ... redacted
```

Now, if we run our application we don't see any change. This is because we need to update our view state to include the `clickCount` property. We'll be updating our `Updated` implementation of `MainState` sealed class to include a new state called `UpdatedWithCount`. We only need this property on the `Updated` state because when the user hasn't pressed the button we don't want to change the current state of the app.

```kotlin
// ... redacted

sealed interface MainState {
    data object Uninitialized: MainState
    data class Updated(val clickCount: Int): MainState
}
```

This will also lead to another update to our `updateText` method in the view model, because we need to give the `clickCount` property as a constructor parameter to the `MainState.Updated` class we've just updated.

```kotlin
// ... redacted 

    fun updateText() {
        clickCount++
        _displayText.update { MainState.Updated(clickCount) }
    }
    
// ... redacted
```

If we try to compile our app, we see that the `MainInternal` composable function fails to compile. This is because of the `when` statement.

## Update the composable

To make our `when` statement compile again, we need to tell the compiler that the `ViewState.Updated` is a type instead of a singleton object. We can do this by adding a `is` statement to the `when` statement.

```kotlin
// ... redacted

    val textToDisplay = when (state) {
        MainState.Uninitialized -> R.string.uninitialized_text
        is MainState.Updated -> R.string.updated_text
    }
    
// ... redacted
```

## Update the strings resource

Now that we've updated our logic and our composable, we can start implementing the plural strings.

If we take a look at the documentation for plural strings, we see that we have multiple options for the quantity that we want to support, such as `zero`, `one`, `two`, `few`, `many` and `other`. For our use case, we only need to support `one` and `other` [(Google, 2024)](https://developer.android.com/guide/topics/resources/string-resource#Plurals).

Let's update our `updated_text` resource to make use of the plural string.

```xml
<resources>
    <!-- ... redacted -->
    
    <plurals name="updated_text">
        <item quantity="one">You have clicked 1 time</item>
        <item quantity="other">You have clicked %d times</item>
    </plurals>
    
    <!-- ... redacted -->
</resources>
```

As you can see, we've updated the `<string name="">` element to a `<plurals name="">` element. This gives us extra elements to work with multiple quantities. In our example we've only defined the quantity for one and other. The other quantity will be taken whenever the quantity doesn't match one.

To use our plural string, we need to update our `Main` composable to use the `quantityStringResource` instead of the `stringResource` method.

```kotlin
// ... redacted

    val textToDisplay = when (state) {
        MainState.Uninitialized -> stringResource(R.string.uninitialized_text)
        is MainState.Updated -> pluralStringResource(R.plurals.updated_text, state.clickCount)
    }

    Column {
        Text(textToDisplay)
        Button(onClick = onButtonClick) {
            Text(stringResource(R.string.update_text_button))
        }
    }

// ... redacted
```

We've changed the return type of our `when` statement from the resource id to the actual string, because our plural string resource needs to be accessed using the `pluralStringResource` method instead of the `stringResource` we need for the regular string resource. The `pluralStringResource` also required an extra parameter, the quantity. Since we'll be using the `clickCount` property from our `Updated` state, we can use that as the quantity.

If we run our application, and click the button a couple of times we see that our text is changing from _Hello world!_ to _You have clicked 1 time_ and _You have clicked 2 times_.

## Update the test cases

Because our application already contains UI tests, we need to make sure that they keep passing as well. So, last but definitely not least, we should also update our test cases.

Let's update the `shouldDisplayHelloAgainWhenTheMainStateIsUpdated` test case in our `MainTest` to `shouldDisplayYouHaveClickedOnceWhenTheMainStateIsUpdatedWithAClickCountOfOne` and add another test case to validate the text when the click count is five.

```kotlin
// ... redacted

    @Test
    fun shouldDisplayYouHaveClickedOnceWhenTheMainStateIsUpdatedWithAClickCountOfOne() {
        // Arrange & Act
        composeTestRule.setContent {
            MainInternal(
                state = MainState.Updated(clickCount = 1),
                onButtonClick = { }
            )
        }

        // Assert
        composeTestRule
            .onNodeWithText("You have clicked 1 time")
            .assertIsDisplayed()
    }

    @Test
    fun shouldDisplayYouHaveClickedXTimesWhenTheMainStateIsUpdatedWithAClickCountOfFive() {
        // Arrange
        val noClicks = 5

        // Act
        composeTestRule.setContent {
            MainInternal(
                state = MainState.Updated(clickCount = noClicks),
                onButtonClick = { }
            )
        }

        // Assert
        composeTestRule
            .onNodeWithText("You have clicked 5 times")
            .assertIsDisplayed()
    }

// ... redacted
```

You might notice that we moved from the `context.stringResource` to hardcoded strings for these test cases. This is something I did because it allows us to validate that our plural string resource is correct, and that the correct plural is used for the amount we test. If for example, we've swapped the text for the `one` and `other` quantity our test would fail in this case. If we use the `context.pluralStringResource`, we wouldn't detect that issue.