---
name: public-api-types
description: Use when adding or changing a component, prop or exported type of the v5 public API in `src/components/` or `src/types.ts` — where a type is declared, whether it is exported, how props are split into `PropsBase` and the `ios` / `android` keys, named unions and objects, family aliases of common types, naming. Not for v4 (`src/legacy/`). For the doc comments on these declarations, use `doc-comments`.
---

# Declaring public v5 types

The API reference on the docs website is generated from the declarations in
`src/components/` and `src/types.ts`. How a type is declared decides what the
reader sees: whether it gets an entry, whether its values and fields are listed,
and whether links resolve. The full rules with examples are in
[reference.md](reference.md).

Work through the decisions in this order.

## 1. Is it public?

- A type that a public prop, field, parameter or type argument uses is
  exported, and so is every type in between, such as a base interface.
  An exported type is documented: it gets its own entry.
- A type that nothing public uses is not exported, even if the native side
  needs it (`OnDismissEventPayload` only passes between native code and
  `Stack.Screen`, so the `stack` barrel does not list it).
- Public types never refer to types from `src/fabric/` (codegen).

## 2. Where is it declared and exported?

"Exported" means listed in the explicit `export type { … }` list of the
family barrel or of `src/types.ts`. The `export` keyword in the declaring file
is not enough: the component sub-barrels (`tabs/host/index.ts`,
`stack/screen/index.ts`) re-export everything with `export type *`, but only
what the family barrel lists reaches the package.

- **One family** (`tabs`, `stack`, `split`, `form-sheet`, …): declared in the
  family's `*.types.ts`, listed in its barrel
  `src/components/<family>/index.ts` (modals:
  `src/components/modals/<family>/index.ts`).
- **Several families**: declared in `src/components/shared/types.ts` and
  listed once, in `src/types.ts`. Never re-exported from a family barrel;
  family files import it from `../shared/types` (or the relative path).
- **A group of related families** (the `Sheet*` types of `FormSheet` and
  `PageSheet`): declared in the group's folder (`src/components/modals/sheet/`)
  and listed in `src/types.ts`. What only the shared implementation needs
  (`SheetBase`, `SheetBaseProps`, `SheetProps`, `SheetPresentationStyle`) is
  not listed there.
- **A new family**: its barrel is added to `src/index.tsx`, or to
  `src/experimental/index.ts` for an experimental one.
- No renamed exports (`export type { A as B }`). A second name is its own
  alias with its own comment.

## 3. The component and its props type

- Each component has its own props type, `<Component>Props`, even when two
  components take the same props — write both out, the way `FormSheetProps`
  and `PageSheetProps` are. The shared implementation takes an internal type.
- Platform-only props are either flat in `<Component>Props`, with their
  `@platform`, or grouped under the `ios` / `android` keys. Keys are not
  required. A component keeps the form it already uses; check its props type.
  Do not move existing props from one form to the other; that breaks users'
  code.
- For a new component, the author decides. Do not choose silently: propose a
  form and ask. As a guide, the components with the keys have many props of
  each platform; the flat ones have only a few.
- A component with the keys splits its props:
  `<Component>PropsBase` holds the shared props, `<Component>Props` extends it
  and adds `ios?: <Component>PropsIOS | undefined` and
  `android?: <Component>PropsAndroid | undefined`, declared in
  `<Component>.ios.types.ts` / `<Component>.android.types.ts`. Each key points
  directly at that type — no `Partial<…>`, no inline object. Model:
  `src/components/tabs/host/TabsHost.types.ts`.
- A key is added only for a platform that has props of its own: no empty
  `<Component>PropsAndroid` just to have both keys.
- A component without platform props has no base.

## 4. The type of each prop and field

- A set of string literals is a named, exported union, never inline.
- An object value is a named, exported type at every level of nesting
  (`interface X { … }` or `type X = { … }`).
- A callback or render function is a named, exported function type. An event
  handler is `NativeEventHandler<Payload>` from `src/types.ts`, written inline
  on the prop; the payload is a named type, or `EmptyEventPayload`. Only the
  methods of a command object (a component's ref) are written inline.
- An object that extends another is `interface X extends Base`. An
  intersection (`A & { … }`) only where `extends` cannot express the type, and
  no generic helpers that build public types.
- A style prop is `StyleProp<Shape>`, where `Shape` is a named type whose fields
  are typed from React Native (`backgroundColor?: ViewStyle['backgroundColor']`).
  A component that reads the fields itself calls `StyleSheet.flatten` first.
- Types from React Native (`ColorValue`, `ViewProps['children']`) are used as
  they are.
- Every optional member is `name?: Type | undefined`.

## 5. Common types: the family alias

A type from `src/types.ts` that the family's props or fields use **directly**
gets one alias in the family, named with the family prefix and the common
type's name: `export type TabsDirection = Direction;`, or an extension such as
`export type TabsColorScheme = ColorScheme | 'inherit';`. Props use the alias.

- No alias for a common type the family reaches only through another one
  (`SheetBackgroundEffectColor` inside `SheetBackgroundEffect`).
- No alias that no prop or field uses.
- No alias for `NativeEventHandler` and `EmptyEventPayload`, and no exported
  alias of any generic instantiation.
- One alias per family, not per component or platform — unless the components
  or platforms take, or are likely to take, different values; then each gets
  its own from the start (`TabsHostDirection`, `TabsScreenDirection`).

## 6. Name

- PascalCase. A type of one component takes the component prefix
  (`TabsScreenItemAppearanceIOS`); a type shared by the family's components
  takes the family prefix (`TabsDirection`).
- A type that models something of one platform takes the platform suffix at
  the end: `…IOS`, `…Android`. A general idea that is implemented on one
  platform today has no suffix (`FormSheetLargestUndimmedDetentIndex` is
  iOS-only in v5, but the idea is not).
- Before naming a platform-specific prop or type, look for the same idea on
  the other platform (`TabsHostPropsIOS.tabBarControllerMode` is how iOS shows
  tabs on wide screens). When it is the same idea, the names match and neither
  takes the platform suffix; say in your report that one cross-platform prop
  may fit better than two platform ones.
- String literal values are camelCase. An experimental prop inside a stable
  component has the `experimental_` prefix; the props of an experimental
  component do not.
- Some existing names on `main` do not follow these rules (for example
  `TabSelectedEvent`, `TabBarControllerMode`, `Edge`). Renaming them is
  postponed; do not rename them as a side effect, and do not copy their
  pattern for new types.

## Outside the task

These rules apply to what the task adds or changes. When you notice code or a
comment outside the task that breaks them, do not change it: list it in your
report with the file and line, so that it can go into a separate pull request.

## Then

- Write the doc comments with the `doc-comments` skill.
- Check the change with the `check-public-api` skill.
