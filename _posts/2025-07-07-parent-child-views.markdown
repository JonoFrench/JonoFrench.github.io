
# #️⃣ Different Ways of Displaying Parent–Child Views in SwiftUI

SwiftUI’s declarative model encourages building interfaces from small, reusable components. One of the foundational concepts is the **parent–child view relationship**, where the parent manages state and the child renders UI or interacts with that state.

This post explores **practical, real-world techniques** for parent–child communication in SwiftUI:

1. Passing data with initializers
2. Using `@Binding`
3. Using `ObservableObject`, `@StateObject`, `@ObservedObject`, and `@EnvironmentObject`
4. Using Preference Keys (child → parent)
5. Custom view containers with `@ViewBuilder`
6. NavigationStack and NavigationDestination
7. Bonus: Parent–child composition with `@Environment` and custom environment values

Let’s go section by section.

---

# ## 1. Passing Data via Standard Initializers

The most straightforward parent–child pattern is simply passing data through a child view’s initializer. This is perfect for **static** or **read-only** data.

### 🧩 Real-World Example: Product List → Product Row

```swift
struct Product: Identifiable {
    let id = UUID()
    let name: String
    let price: Double
}

struct ProductListView: View {
    let products = [
        Product(name: "MacBook Air", price: 1299),
        Product(name: "iPhone", price: 999),
        Product(name: "iPad Pro", price: 1099)
    ]

    var body: some View {
        List(products) { product in
            ProductRow(product: product)
        }
    }
}

struct ProductRow: View {
    let product: Product

    var body: some View {
        HStack {
            Text(product.name)
            Spacer()
            Text("$\(product.price, specifier: "%.2f")")
                .foregroundStyle(.secondary)
        }
    }
}
```

### **When to Use**

* Simple data display
* Child doesn’t need to modify the parent’s state
* You want clarity and explicit data flow

---

# ## 2. Passing State with `@Binding`

Bindings allow a child view to **mutate** state stored in the parent.

### 🧩 Real-World Example: Settings Toggle

A parent view shows multiple settings toggles. Each child toggle updates the parent’s state.

```swift
struct SettingsView: View {
    @State private var isDarkMode = false
    @State private var notificationsOn = true

    var body: some View {
        Form {
            SettingToggle(title: "Dark Mode", isOn: $isDarkMode)
            SettingToggle(title: "Notifications", isOn: $notificationsOn)
        }
    }
}

struct SettingToggle: View {
    let title: String
    @Binding var isOn: Bool

    var body: some View {
        Toggle(title, isOn: $isOn)
    }
}
```

### **When to Use**

* Child modifies parent’s state directly
* Reusable components (e.g., sliders, toggles, inputs)
* You want two-way data flow

---

# ## 3. Observable Objects & Environment Objects

This is the most scalable pattern. Use when you need shared, mutable state across multiple views.

---

## ### 3a. `ObservableObject` with `@ObservedObject`

Best for **passing state down one level**.

### 🧩 Real-World Example: Cart Item Updates

The parent owns a cart model; each row updates quantities.

```swift
class CartItem: ObservableObject, Identifiable {
    let id = UUID()
    let name: String
    @Published var quantity: Int

    init(name: String, quantity: Int = 1) {
        self.name = name
        self.quantity = quantity
    }
}

struct CartView: View {
    @State private var items = [
        CartItem(name: "Bananas"),
        CartItem(name: "Bread"),
        CartItem(name: "Milk")
    ]

    var body: some View {
        List(items) { item in
            CartRow(item: item)
        }
    }
}

struct CartRow: View {
    @ObservedObject var item: CartItem

    var body: some View {
        HStack {
            Text(item.name)
            Spacer()
            Stepper("Qty: \(item.quantity)", value: $item.quantity)
        }
    }
}
```

---

## ### 3b. `@EnvironmentObject`

Use this when state is shared across **deep view hierarchies** and you don’t want to pass objects manually through every initializer.

### 🧩 Real-World Example: Global App Session (login state)

```swift
class SessionData: ObservableObject {
    @Published var username: String = "Guest"
    @Published var isLoggedIn = false
}

struct RootView: View {
    @StateObject private var session = SessionData()

    var body: some View {
        MainView()
            .environmentObject(session)  // Inject once
    }
}

struct MainView: View {
    @EnvironmentObject var session: SessionData

    var body: some View {
        VStack {
            Text("Welcome, \(session.username)")
            if session.isLoggedIn {
                DashboardView()
            } else {
                LoginView()
            }
        }
    }
}
```

### **When to Use**

* App-wide or screen-wide state
* Authentication, settings, themes
* Avoiding “prop-drilling” through many initializers

---

# ## 4. Child → Parent Communication with Preference Keys

Preference Keys allow **children to send data upward**, which is otherwise not possible in SwiftUI.

### 🧩 Real-World Example: Child Views Report Their Height

Useful when the parent needs to align or animate based on child geometry.

```swift
struct HeightPreferenceKey: PreferenceKey {
    static var defaultValue: CGFloat = 0
    static func reduce(value: inout CGFloat, nextValue: () -> CGFloat) {
        value = max(value, nextValue()) // Take largest height
    }
}

struct MeasuringChild: View {
    var body: some View {
        Text("Dynamic content here")
            .padding()
            .background(
                GeometryReader { proxy in
                    Color.clear.preference(
                        key: HeightPreferenceKey.self,
                        value: proxy.size.height
                    )
                }
            )
    }
}

struct ParentReceiver: View {
    @State private var childHeight: CGFloat = 0

    var body: some View {
        VStack {
            Text("Child height: \(childHeight)")
            MeasuringChild()
        }
        .onPreferenceChange(HeightPreferenceKey.self) { value in
            childHeight = value
        }
    }
}
```

### **When to Use**

* Custom layouts
* Dynamic animation based on child size
* Reading scroll offsets or anchor points

---

# ## 5. Custom Containers with `@ViewBuilder`

Create flexible, reusable parent containers that accept arbitrary child content.

### 🧩 Real-World Example: Reusable Card Component

```swift
struct Card<Content: View>: View {
    let content: Content

    init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            content
        }
        .padding()
        .background(Color(.secondarySystemBackground))
        .cornerRadius(12)
        .shadow(radius: 2)
    }
}

struct ExampleCardUsage: View {
    var body: some View {
        Card {
            Text("New Message")
                .font(.headline)
            Text("You have one unread message.")
                .font(.subheadline)
        }
        .padding()
    }
}
```

### **When to Use**

* Layout wrappers
* Reusable visual components (cards, panels, sheets)
* Accepting multiple subviews in a structured format

---

# ## 6. NavigationStack & NavigationDestination

SwiftUI’s modern navigation system establishes parent–child relationships through navigation.

### 🧩 Real-World Example: Master → Detail Navigation

A list of recipes navigates to a recipe detail view.

```swift
struct Recipe: Hashable {
    let title: String
    let instructions: String
}

struct RecipeList: View {
    @State private var path = NavigationPath()

    let recipes = [
        Recipe(title: "Pancakes", instructions: "Mix and fry."),
        Recipe(title: "Pasta", instructions: "Boil and sauce.")
    ]

    var body: some View {
        NavigationStack(path: $path) {
            List(recipes, id: \.self) { recipe in
                NavigationLink(recipe.title, value: recipe)
            }
            .navigationDestination(for: Recipe.self) { recipe in
                RecipeDetail(recipe: recipe)
            }
            .navigationTitle("Recipes")
        }
    }
}

struct RecipeDetail: View {
    let recipe: Recipe

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text(recipe.title).font(.largeTitle)
            Text(recipe.instructions)
            Spacer()
        }
        .padding()
    }
}
```

### **When to Use**

* Pushing detail screens
* Type-safe navigation
* Multi-step flows like onboarding or checkout

---

# ## 7. Bonus: Parent–Child State via `@Environment`

You can define **custom environment values** to pass configuration or small pieces of state without bindings or objects.

### 🧩 Real-World Example: App Theme Mode

```swift
private struct IsPremiumUserKey: EnvironmentKey {
    static let defaultValue = false
}

extension EnvironmentValues {
    var isPremiumUser: Bool {
        get { self[IsPremiumUserKey.self] }
        set { self[IsPremiumUserKey.self] = newValue }
    }
}

struct PremiumEnvironmentExample: View {
    var body: some View {
        ContentView()
            .environment(\.isPremiumUser, true)
    }
}

struct ContentView: View {
    @Environment(\.isPremiumUser) var isPremiumUser

    var body: some View {
        Text(isPremiumUser ? "Premium features unlocked!" : "Upgrade to Premium")
    }
}
```

### **When to Use**

* Theming
* Lightweight configuration
* Feature flags

---

# #️⃣ Summary Table

| Technique            | Direction              | Best For                              |
| -------------------- | ---------------------- | ------------------------------------- |
| Initializers         | Parent → Child         | Simple read-only data                 |
| `@Binding`           | Parent ↔ Child         | Forms, toggles, controls              |
| `ObservableObject`   | Shared                 | Multi-view state, rows with own state |
| `@EnvironmentObject` | Shared (implicit)      | App-wide state like session           |
| Preference Keys      | Child → Parent         | Layout, geometry, scroll detection    |
| View Builders        | N/A                    | Reusable containers                   |
| NavigationStack      | Structural             | Screen → detail flows                 |
| Custom Environments  | Parent → deep children | Theming, flags                        |

---

