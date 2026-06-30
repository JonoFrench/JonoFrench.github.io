---
layout: post
title:  "App Intents in Swift Part II"
date:   2026-06-01 14:02:05 +0300
categories: swift development
---

# A Developer's Guide to App Intents in iOS

Apple has been steadily moving away from the idea that apps exist purely as standalone interfaces. Today, your app is expected to integrate with Siri, Spotlight, Shortcuts, widgets, Control Centre and, more recently, Apple Intelligence.

The technology that enables all of this is **App Intents**.

If you've looked at the documentation, you've probably found yourself staring at protocols like `AppIntent`, `AppEntity`, `EntityQuery`, `AppShortcutsProvider`, and wondering where to begin.

The good news is that App Intents aren't nearly as complicated as they first appear. Once you understand the building blocks, everything fits together quite naturally.

Let's build a mental model before diving into the code.

## Think in Actions, Not Screens

The biggest mindset shift is this:

**An App Intent represents something your app can do—not a screen in your app.**

For example, imagine you're writing a recipe application.

Your UI might contain screens such as:

* Home
* Categories
* Search
* Recipe Details

None of these are intents.

Instead, think about the actions users perform:

* Open a recipe
* Add a recipe
* Mark a recipe as favourite
* Start a cooking timer
* Generate a shopping list

These are all excellent candidates for App Intents.

If you can describe the action with a simple verb, it's probably an intent.

## Your First Intent

Every intent conforms to `AppIntent`.

Here's a very simple example:

```swift
import AppIntents

struct StartCookingIntent: AppIntent {

    static let title: LocalizedStringResource = "Start Cooking"

    func perform() async throws -> some IntentResult {

        print("Cooking started!")

        return .result(dialog: "Let's get cooking!")
    }
}
```

There are only three important pieces here:

* A title
* The `perform()` function
* A result

When the user triggers the intent—whether through Siri, Shortcuts or Spotlight—`perform()` is executed.

That's it.

## Adding Parameters

Most intents need input.

Suppose we want to open a specific recipe.

```swift
struct OpenRecipeIntent: AppIntent {

    @Parameter(title: "Recipe")
    var recipeName: String

    func perform() async throws -> some IntentResult {

        RecipeManager.shared.open(recipeNamed: recipeName)

        return .result()
    }
}
```

When this intent runs, iOS automatically collects the value.

In Siri:

> "Open Lasagne."

In Shortcuts:

A text field appears automatically.

You don't have to build any UI yourself.

## Why Strings Aren't Enough

Using a `String` works for simple cases.

But what happens if your app already has hundreds of recipes?

You don't want users typing names manually.

Instead, you expose your own data as an **AppEntity**.

## Introducing AppEntity

An `AppEntity` represents one of your application's objects.

For example:

```swift
struct Recipe: AppEntity {

    let id: UUID
    let name: String

    static var typeDisplayRepresentation =
        TypeDisplayRepresentation(name: "Recipe")

    var displayRepresentation: DisplayRepresentation {
        DisplayRepresentation(title: "\(name)")
    }

    static var defaultQuery = RecipeQuery()
}
```

Notice what isn't here.

There are no database lookups.

No searching.

No filtering.

An entity is simply a description of one object.

Think of it as making your model visible to the operating system.

## So Where Does the Searching Happen?

That's the job of an `EntityQuery`.

```swift
struct RecipeQuery: EntityQuery {

    func entities(
        for identifiers: [Recipe.ID]
    ) async throws -> [Recipe] {

        RecipeDatabase.shared.find(ids: identifiers)
    }

    func suggestedEntities() async throws -> [Recipe] {

        RecipeDatabase.shared.allRecipes()
    }

    func entities(
        matching string: String
    ) async throws -> [Recipe] {

        RecipeDatabase.shared.search(string)
    }
}
```

This is where Siri and Shortcuts ask questions like:

* What recipes exist?
* Which recipes match "lasagne"?
* Which ones should I suggest?

It's simply an adapter between your data layer and the system.

## Using Your Entity

Now your intent becomes much more powerful.

```swift
struct OpenRecipeIntent: AppIntent {

    @Parameter(title: "Recipe")
    var recipe: Recipe

    func perform() async throws -> some IntentResult {

        RecipeManager.shared.open(recipe)

        return .result()
    }
}
```

Notice the difference.

We're no longer passing a string.

We're passing an actual `Recipe` object.

That's one of the biggest strengths of App Intents.

## Returning Values

Intents don't just perform actions.

They can also return data.

Imagine creating a recipe.

```swift
let recipe = Recipe(...)

return .result(value: recipe)
```

A Shortcut can then use that returned recipe as input to the next action.

This makes App Intents composable.

One intent feeds another.

Exactly how Shortcuts is designed to work.

## Opening Your App

Sometimes everything happens in the background.

Sometimes you want to navigate into your app.

Apple provides protocols such as `OpenIntent` and mechanisms for deep linking.

For example:

* Open today's journal
* Navigate to a recipe
* Show a shopping list

The user never has to search through your navigation hierarchy.

## App Shortcuts

Creating an intent doesn't automatically make it discoverable.

To expose commonly used actions, create an `AppShortcutsProvider`.

```swift
struct RecipeShortcuts: AppShortcutsProvider {

    static var appShortcuts: [AppShortcut] {

        AppShortcut(
            intent: StartCookingIntent(),
            phrases: [
                "Start cooking in \\(.applicationName)"
            ],
            shortTitle: "Cook"
        )
    }
}
```

These shortcuts immediately appear in the Shortcuts app.

Users can edit them, automate them and trigger them with Siri.

## Common Architecture

One mistake many developers make is putting business logic directly inside the intent.

Avoid this.

Instead:

```
App Intent
      │
      ▼
View Model / Manager
      │
      ▼
Repository
      │
      ▼
Persistence
```

Your intent should be extremely thin.

Ideally, `perform()` is only a few lines long.

This keeps the same business logic reusable from:

* SwiftUI
* Widgets
* App Intents
* Unit tests

## Handling Dependencies

You'll quickly notice that App Intents aren't SwiftUI views.

You don't have access to environment objects.

Instead, inject dependencies just as you would elsewhere.

Examples include:

* Shared managers
* SwiftData model containers
* Core Data contexts
* Repositories
* Services

Keeping your architecture clean makes intents almost trivial to write.

## App Intents and SwiftData

App Intents work very nicely with SwiftData.

A typical pattern is:

```swift
let context = ModelContext(container)

let recipes = try context.fetch(...)
```

Convert the results into your `AppEntity` types, and your query is complete.

You don't expose SwiftData models directly.

Instead, think of `AppEntity` as the public API that the operating system understands.

## Testing

One advantage of App Intents is that they're easy to test.

Since the interesting work should happen in your business layer, you can test that independently.

Your intent tests often become little more than:

* Does the correct manager get called?
* Is the correct value returned?
* Is the dialog correct?

If your `perform()` method is hundreds of lines long, it's usually a sign that too much logic lives there.

## Apple Intelligence

With iOS 18 and later, App Intents have become even more important.

Apple Intelligence uses App Intents as one of the primary ways of understanding what your application is capable of doing.

The richer your intents are, the more opportunities the system has to surface your app in intelligent ways.

In many respects, App Intents have become the public interface to your application's capabilities.

## Final Thoughts

App Intents can initially feel overwhelming because there are several protocols involved. In practice, each one has a single responsibility:

* `AppIntent` — defines an action.
* `@Parameter` — supplies the input.
* `AppEntity` — describes your app's data.
* `EntityQuery` — allows the system to find that data.
* `AppShortcutsProvider` — advertises useful shortcuts.

Once you see these as separate pieces of the same puzzle, the framework becomes much easier to understand.

Rather than thinking about views and navigation, think about capabilities. Every useful action in your app can become an intent, and once you've exposed those capabilities, iOS can make them available across Siri, Spotlight, Shortcuts, widgets, automations and Apple Intelligence with surprisingly little additional code.

If you're building a modern iOS app, App Intents are no longer an optional extra—they're quickly becoming one of the primary ways users interact with your application.
