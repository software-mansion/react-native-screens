# Public v5 types: rules and examples

The rules with the files on `main` that show each of them. Read a model file
before copying a pattern from memory.

## Public surface

**Exported means documented.** Every type a barrel exports gets an entry in the
API reference. A type that a public prop or field uses but that is not exported
renders as a name without a link. The one exported type without an entry of its
own is `<Component>PropsBase`: its props are listed in the component's section.

```ts
// src/components/modals/form-sheet/index.ts
export type {
  FormSheetProps,
  FormSheetDetentChangedEvent, // used by FormSheetProps.onDetentChanged
} from './FormSheet.types';
```

**Common types are exported from `src/types.ts` only.** Model: `src/types.ts`,
which lists the types of `src/components/shared/types.ts` and the `Sheet*`
group types from `src/components/modals/sheet/`. Family files import them from
those folders.

**No renamed exports.**

```ts
// ❌ a reference, not a documented type
export type { ScrollEdgeEffect as ScrollViewMarkerScrollEdgeEffect } from '../shared/types';
// ✅ src/components/scroll-view-marker/ScrollViewMarker.types.ts
/**
 * Effect applied to the scrolling content at an edge of the scroll view
 * marked by {@link ScrollViewMarker}.
 *
 * @remarks
 * Accepts any {@link ScrollEdgeEffect} value.
 */
export type ScrollViewMarkerScrollEdgeEffect = ScrollEdgeEffect;
```

## Components and their props

**One props type per component.** `FormSheet` and `PageSheet` take the same
props, and each has its own complete interface (`FormSheet.types.ts`,
`PageSheet.types.ts`); their shared implementation `SheetBase` takes the
internal `SheetBaseProps`, which extends `SheetProps`. This way each component
has its own section with its props in the reference; the docs generator does not
support a props type shared by two components.

**Platform props: flat or under `ios` / `android`.** Both forms are allowed;
a component keeps the one it already uses. Flat, model:
`src/components/modals/form-sheet/FormSheet.types.ts` (`largestUndimmedDetentIndex`
has `@platform ios`). The docs list a flat prop with the other props, with its
platform badge. Under the keys, model:
`src/components/tabs/host/TabsHost.types.ts`; the docs list these props in
their own `ios.*` / `android.*` block.

```ts
/**
 * Props for {@link Tabs.Host}.
 */
export interface TabsHostProps extends TabsHostPropsBase {
  /**
   * iOS-specific props.
   *
   * @platform ios
   */
  ios?: TabsHostPropsIOS | undefined;
  /**
   * Android-specific props.
   *
   * @platform android
   */
  android?: TabsHostPropsAndroid | undefined;
}

/**
 * Cross-platform props for {@link Tabs.Host}.
 */
export interface TabsHostPropsBase { … }
```

The generator lists `ios.*` and `android.*` props in the component's section
only when the key's type is a plain reference to a type of the same family.
Today the bases are `TabsHostPropsBase`, `TabsScreenPropsBase` and
`StackHeaderConfigPropsBase`; a new one needs a change in the docs generator,
which `check-public-api` tells you to report. A ref with platform commands follows the same
pattern (`StackHeaderConfigRef` in `StackHeaderConfig.types.ts`).

## Type declarations

**Named unions.**

```ts
// ❌
actionOrigin: 'user' | 'programmaticJs' | 'programmaticNative' | 'implicit';
// ✅
actionOrigin: TabSelectionActionOrigin;
```

**Named objects at every level.** Model: `TabsScreenSpecialEffects` in
`src/components/tabs/screen/TabsScreen.types.ts`.

```ts
// ❌
specialEffects?: { repeatedTabSelection?: { popToRoot?: boolean; scrollToTop?: boolean } };
// ✅
export interface TabsScreenSpecialEffects {
  repeatedTabSelection?: TabsScreenRepeatedTabSelectionEffects | undefined;
}
export interface TabsScreenRepeatedTabSelectionEffects {
  popToRoot?: boolean | undefined;
  scrollToTop?: boolean | undefined;
}
specialEffects?: TabsScreenSpecialEffects | undefined;
```

`interface X { … }` and `type X = { … }` both work; the page of a `type` also
shows the whole object above its summary.

**Function types.**

```ts
// ❌
onCollapse?: ((e: NativeSyntheticEvent<GenericEmptyEvent>) => void) | undefined;
// ✅
onCollapse?: NativeEventHandler<EmptyEventPayload> | undefined;
onTabSelected?: NativeEventHandler<TabSelectedEvent> | undefined;
// ❌ an exported alias of an instantiation
export type SplitHostCollapseHandler = NativeEventHandler<EmptyEventPayload>;
```

`@param` and `@returns` go on the type that has the signature, not on an alias
of it.

**`extends`, not intersections.** The generator shows only the literal's
members of an intersection, not the base's, so `&` is used only where
`extends` cannot express the type.

```ts
// ❌
type WithTinting<Icon> = Icon & {
  tinting?: TabsPlatformIconTintingAndroid | undefined;
};
export type TabsScreenIconAndroid =
  | WithTinting<PlatformIconAndroidDrawableResource>
  | WithTinting<PlatformIconShared>;
// ✅ src/components/tabs/screen/TabsScreenIcon.types.ts
export interface TabsScreenIconDrawableResourceAndroid
  extends PlatformIconAndroidDrawableResource {
  tinting?: TabsPlatformIconTintingAndroid | undefined;
}
```

An interface that extends a base lists only its own fields; the page links the
base ("Extends …"), which is exported and has its own entry.

**Style props.**

```ts
// ❌ the page shows the whole expanded ViewStyle
nativeContainerStyle?: StyleProp<Pick<ViewStyle, 'backgroundColor'>> | undefined;
// ❌ rejects arrays; the field stops following React Native
export type TabsHostNativeContainerStyleProps = { backgroundColor?: ColorValue | undefined };
nativeContainerStyle?: TabsHostNativeContainerStyleProps | undefined;
// ✅
export type TabsHostNativeContainerStyleProps = {
  backgroundColor?: ViewStyle['backgroundColor'] | undefined;
};
nativeContainerStyle?: StyleProp<TabsHostNativeContainerStyleProps> | undefined;
```

A component that reads the fields calls `StyleSheet.flatten` first
(`TabsHost.ios.tsx`, `TabsHost.android.tsx`, `SheetBase.tsx`). Props whose name
ends in "Style" but whose value is a set of strings
(`primaryBackgroundStyle`) are not style props.

**Optional members.** The library compiles with `exactOptionalPropertyTypes`,
and "not passed" and `undefined` mean the same: `name?: Type | undefined`.

## Family aliases

```ts
// ❌ a common type used directly
direction?: Direction | undefined;
// ❌ one alias per component or platform when they take the same values
export type TabsHostDirection = Direction;
export type TabsScreenDirection = Direction;
// ❌ an alias of a type the family reaches only through another one
export type FormSheetBackgroundEffectColor = SheetBackgroundEffectColor;
// ✅ one alias, or one declaration, per family
export type TabsPlatformIconTintingAndroid = PlatformIconTintingAndroid;
export type TabsDirection = Direction | 'inherit';
export type FormSheetBackgroundEffect = SheetBackgroundEffect;
```

Model: the aliases at the top of
`src/components/modals/form-sheet/FormSheet.types.ts`.

**A field used on different platforms.** A field of a shared type lists every
platform it works on in any use; the component and the prop narrow it. When the
intersection still lists a platform where the field does not work in some use,
that use gets its own type — an alias does not help, because it shares the
fields and their comments. `SheetNativeContainerStyleProps.backgroundColor`
(`android, ios, tvos >= 26`) needs no split: `PageSheet` itself has no tvOS.

## Known deviations on `main`

Leave these as they are unless the task is to fix them:

- Names that predate the naming rules: `TabSelectedEvent`,
  `TabSelectionActionOrigin` and the other `TabSelection*` / `TabBar*` types,
  `MoreTabSelectedEvent`, the Host-only `Split*` types,
  `DisplayModeWillChangeEvent`, `Edge`, `InsetType`, the `PlatformIcon*` types
  with the platform in the middle, `BlurEffect`, `ScrollEdgeEffect`,
  `UserInterfaceStyle`. Renaming them is postponed.
- `SafeAreaViewProps.edges` is `Readonly<Partial<Record<Edge, boolean>>>`, and
  `StackHeaderToolbarMenuElementOptionsAndroid` extends
  `Partial<Omit<StackHeaderToolbarMenuItemBaseAndroid, 'id'>>`.
