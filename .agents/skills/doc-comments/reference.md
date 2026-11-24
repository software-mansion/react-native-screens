# Doc comment tags: reference

Each allowed tag with its form and an example. The custom tags
(`@platform`, the callouts, `@namespace`) are declared in `tsdoc.json`; the
others are standard TSDoc. No other tag is allowed. Nothing in this repository
rejects an unknown tag — the docs generator does — so check by hand.

## Summary

The first paragraph, without a tag: a short heading that says what the symbol
is. A sentence or two; longer explanation goes to `@remarks`.

- A component is described on the symbol users write: the key in the family's
  namespace constant (`Host: TabsHost` in `src/components/tabs/index.ts`) or
  the exported component (`FormSheet`). The implementation files of a
  namespaced component have no doc comment on the export.
- A props type: `Props for {@link Tabs.Host}.` A `<Component>PropsBase`:
  `Cross-platform props for {@link Tabs.Host}.`
- An event payload:
  `Payload of {@link TabsHostPropsBase.onTabSelected | onTabSelected}.` A
  group type used by several components names the event in backticks instead.

## `@remarks`

Behaviour, platform differences, edge cases, interactions with other props, a
union's values. The tag is alone on its line; the text goes below it. One per
comment.

## Callouts

| Tag        | Use it for                                                            |
| ---------- | --------------------------------------------------------------------- |
| `@note`    | Something to keep in mind: an exception, an edge case.                |
| `@tip`     | A recommended practice, or the setting that makes the prop work well. |
| `@info`    | Neutral context: a limitation, where a value comes from.              |
| `@warning` | Behaviour that will surprise the user and can hurt them.              |
| `@danger`  | Irreversible or destructive consequences only.                        |

Each renders as a large box, so use one only when the reader's attention is
really needed. The tag is alone on its line, with no title; several render in
order. Never inside `@remarks`.

## `@defaultValue`

A value in backticks, or a full sentence when there is no single value. Never
starts with "Defaults to".

```ts
@defaultValue `false`
@defaultValue `'automatic'`
@defaultValue Material's default inset is used.
```

## `@typeParam`, `@param`, `@returns`

```ts
@typeParam T - Payload the native event carries.
```

```ts
/**
 * Updates properties of a menu action at runtime.
 *
 * @param menuElementId - The ID of the menu action to update.
 * @param options - Object with the properties to change. Omitted keys keep
 *   their current values; an explicit `undefined` resets a property to its
 *   default.
 * @platform ios
 */
setMenuItemOptions: (
  menuElementId: string,
  options: StackHeaderMenuItemOptionsIOS,
) => void;
```

- The hyphen after the name is required. One `@param` per parameter, in the
  order of the signature; a continuation line is indented by two spaces.
- `@returns The element to render as the bottom accessory.` — required unless
  the return type is `void`.
- An alias of another function type (`type XIOS = XShared;`) has neither; they
  go on the aliased type.

## `@example`

The smallest code that works, in a ` ```tsx ` block. An optional plain-text
title on the tag's line, and a sentence or two around the code. Larger examples
belong in the hand-written guides.

````ts
/**
 * …
 * @example Selecting a tab from JS
 * Pass the key of the tab to select and the provenance of the last state
 * received from the native side.
 * ```tsx
 * <Tabs.Host navStateRequest={{ selectedScreenKey: 'home', baseProvenance }}>
 *   <Tabs.Screen screenKey="home" title="Home">
 *     <HomeScreen />
 *   </Tabs.Screen>
 * </Tabs.Host>
 * ```
 */
````

## `@see`

A pointer that does not fit into a sentence. The link goes on the tag's line; a
short explanation may follow.

```ts
@see {@link TabsHostPropsBase.rejectStaleNavStateUpdates | rejectStaleNavStateUpdates}
@see {@link https://developer.apple.com/documentation/uikit/uitabbarcontroller/mode | UITabBarController.Mode}
@see {@link PageSheet} for a sheet that differs only in its iPad layout.
```

## `@namespace`

On every constant that groups components (`Tabs`, `Stack`, `Split`), and
nowhere else.

## `@platform`

```ts
@platform android, ios
@platform android, ios, tvos, visionos
@platform ios >= 18
@platform ios >= 18, tvos >= 18
@platform android >= 33, ios
@platform ios <= 18
@platform ios 16 - 18
```

- iOS and tvOS versions are written like UIKit availability; Android versions
  are API levels. `ios >= 26.1` keeps its minor version, `ios >= 18.0` is
  `ios >= 18`.
- A platform is listed once: not `ios >= 16, ios <= 18`.
- Function parameters and type parameters have no tag.

A field is tagged for itself. One type may be used by props with different
platforms; the reader gets the intersection:

```ts
// Used by FormSheet (android, ios, tvos >= 26) and PageSheet (android, ios).
export type SheetNativeContainerStyleProps = {
  /**
   * Specifies the background color of the native container hosting the sheet
   * content.
   *
   * @platform android, ios, tvos >= 26
   */
  backgroundColor?: ViewStyle['backgroundColor'] | undefined;
};
```

A union value that needs a newer version is described on each prop that
accepts it:

```ts
/**
 * Defines the resting positions of the sheet.
 *
 * @remarks
 * An empty array also gives the sheet a single large detent. On Android, at
 * most three detents are supported. `'fitToContents'` is supported on
 * iOS 16+.
 *
 * @platform android, ios
 */
detents?: FormSheetDetents | undefined;
```

## `@experimental`

```ts
/**
 * Component that handles the safe area.
 *
 * @platform android, ios
 * @experimental
 */
export function SafeAreaView(props: SafeAreaViewProps) { … }

/**
 * Props for {@link SafeAreaView}.
 *
 * @experimental
 */
export interface SafeAreaViewProps extends ViewProps { … }
```

Specific facts stay in the text (why the API is temporary, what to use
instead); the generic "experimental" sentence does not.

## `@deprecated`

The reason and the replacement, preferably as a link. A deprecated symbol keeps
all its other tags.

```ts
/**
 * Hides the tab bar.
 *
 * @defaultValue `false`
 * @platform android, ios
 * @deprecated Renamed to {@link TabsHostPropsBase.tabBarHidden | tabBarHidden}.
 */
hidden?: boolean | undefined;
```

## `{@link}`

```ts
{@link StackHeaderConfigPropsIOS.largeTitleEnabled}
{@link PlatformIconShared}
{@link Tabs.Host}
{@link TabsHostPropsBase.onTabSelected | onTabSelected}
{@link https://reactnavigation.org/docs/bottom-tab-navigator | React Navigation: Bottom Tabs}
```

- Through the declaring type: `StackHeaderConfigPropsIOS.largeTitleEnabled`,
  not `Stack.HeaderConfig.ios.largeTitleEnabled`.
- Another family or a common type is linked the same way, without importing
  it.
- `| text` when the target's name contains a type the reader does not write
  (`TabsHostPropsBase`), or when the sentence needs other wording.
- The first mention within one comment (of one type, prop, field, component
  or command) is linked, later ones in the same comment are in backticks.

## Value lists

On the union type, in `@remarks`, after an introducing sentence, and only when
the values have descriptions:

```ts
/**
 * Interface style applied to a container's content.
 *
 * @remarks
 * The following values are supported:
 * - `'light'` — the light interface style.
 * - `'dark'` — the dark interface style.
 */
export type ColorScheme = 'light' | 'dark';
```

A type that extends another union describes only what it adds —
`Accepts any {@link BlurEffectStyle} value, plus:` — except a short union of
well-known values (`ColorScheme`, `Direction`), which may be listed in full:

```ts
/**
 * Color scheme used by Tabs and any child containers.
 *
 * @remarks
 * The following values are supported:
 * - `'inherit'` — the interface style of the parent.
 * - `'light'` — the light interface style.
 * - `'dark'` — the dark interface style.
 */
export type TabsColorScheme = ColorScheme | 'inherit';
```

## What the type says

```ts
// ❌ the prop repeats the icon variants and how every Android icon is loaded
/**
 * Specifies the icon for the menu element.
 *
 * @remarks
 * - `{ type: 'drawableResource', name }` — a drawable resource with the given
 *   name. For loading SVGs use this type.
 * - …
 *
 * The icon will be visible only if the menu element is shown in the Toolbar.
 *
 * @platform android
 */
icon?: StackPlatformIconAndroid | undefined;
// ✅ the variants and loading are on the icon types; the prop says what is its own
/**
 * Specifies the icon for the menu element.
 *
 * @remarks
 * The icon will be visible only if the menu element is shown in the Toolbar.
 *
 * @platform android
 */
icon?: StackPlatformIconAndroid | undefined;
```
