---
layout: post
title:  "Enumerations in Swift"
date:   2022-01-01 14:02:05 +0300
categories: swift development
---

Enumerations, or "enums" for short, are a powerful and versatile feature in the Swift programming language. They provide a way to define a type with a limited set of related values, making your code more expressive, robust, and self-documenting. In this blog post, we'll dive into enums in Swift, exploring their syntax, use cases, and some advanced features.

## What is an Enum?

An enumeration is a user-defined data type in Swift that consists of a set of named values. These named values are called "cases," and each case represents a specific option or state that an enum can be in. Enums are incredibly flexible and can be used in a variety of scenarios.

## Defining Enums

You can define an enum in Swift using the `enum` keyword, followed by the name of the enum and a code block that lists the cases. Here's a simple example of an enum representing the days of the week:

{% highlight swift %}
enum Day {
    case sunday
    case monday
    case tuesday
    case wednesday
    case thursday
    case friday
    case saturday
}
{% endhighlight %}

In this example, we've defined an enum called `Day` with seven cases, each representing a day of the week.

## Using Enums

Once you've defined an enum, you can create instances of it and work with its cases. Here's how you can use the `Day` enum:

{% highlight swift %}
let today = Day.wednesday

switch today {
case .sunday, .saturday:
    print("It's the weekend!")
case .monday... .friday:
    print("It's a workday.")
default:
    print("Invalid day.")
}
{% endhighlight %}

In this code, we've assigned the `Day.wednesday` case to the `today` constant and used a `switch` statement to perform different actions based on the day. The use of enums makes your code more readable and less error-prone, as it's impossible to assign an invalid day, thanks to Swift's type safety.

## Associated Values

One of the powerful features of Swift enums is the ability to associate values with enum cases. This allows you to attach additional data to each case. For example, you can define an enum for different types of shapes and associate values with each case:

{% highlight swift %}
enum Shape {
    case circle(radius: Double)
    case rectangle(width: Double, height: Double)
    case triangle(base: Double, height: Double)
}

let myShape = Shape.circle(radius: 5.0)

switch myShape {
case .circle(let radius):
    let area = Double.pi * pow(radius, 2)
    print("The area of the circle is \(area)")
case .rectangle(let width, let height):
    let area = width * height
    print("The area of the rectangle is \(area)")
case .triangle(let base, let height):
    let area = 0.5 * base * height
    print("The area of the triangle is \(area)")
}
{% endhighlight %}

In this example, we've associated values (e.g., radius, width, and height) with each enum case, allowing us to calculate and print the area of a shape.

## Raw Values

Enums can also have raw values, which are pre-defined values of a specified type associated with each case. Raw values are useful when you need to map enum cases to specific data, such as integers or strings. Here's an example of an enum with raw values:

{% highlight swift %}
enum HTTPStatus: Int {
    case ok = 200
    case badRequest = 400
    case notFound = 404
    case internalServerError = 500
}

let status = HTTPStatus.notFound
print("The raw value of \(status) is \(status.rawValue)")
{% endhighlight %}

In this case, the `HTTPStatus` enum has raw values of type `Int`. You can access the raw value of an enum case using the `rawValue` property.

## Recursive Enums

Swift allows you to define recursive enums, which are enums where one or more cases have associated values that are of the same enum type. Recursive enums are particularly useful for modeling hierarchical or recursive data structures. Here's an example of a recursive enum representing arithmetic expressions:

{% highlight swift %}
indirect enum ArithmeticExpression {
    case number(Int)
    case addition(ArithmeticExpression, ArithmeticExpression)
    case multiplication(ArithmeticExpression, ArithmeticExpression)
}

let expression = ArithmeticExpression.addition(
    .number(3),
    .multiplication(.number(4), .number(2))
)

func evaluate(_ expression: ArithmeticExpression) -> Int {
    switch expression {
    case .number(let value):
        return value
    case .addition(let left, let right):
        return evaluate(left) + evaluate(right)
    case .multiplication(let left, let right):
        return evaluate(left) * evaluate(right)
    }
}

let result = evaluate(expression)
print("The result of the expression is \(result)")
{% endhighlight %}

In this example, we've defined an `ArithmeticExpression` enum that can represent complex arithmetic expressions, including addition and multiplication. The `indirect` keyword is used to indicate that this enum may have associated values of its own type.

## Conclusion

Enums are a fundamental and versatile feature of Swift, enabling you to represent a set of related values in a type-safe, expressive way. Whether you're working with simple options, complex data structures, or modeling states in your app, enums are a valuable tool in your Swift programming toolbox. Understanding when and how to use enums can lead to more readable, maintainable, and bug-free code.