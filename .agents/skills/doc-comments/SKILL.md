---
name: doc-comments
description: Use when writing or editing TSDoc comments (`/** … */`) on the v5 public API in `src/components/` or `src/types.ts` — summaries, `@remarks`, callouts, `@defaultValue`, `@param`, `@see`, `@platform`, `@experimental`, `{@link}`. Not for v4 (`src/legacy/`) or native code. For how the types themselves are declared, use `public-api-types`.
---

# Writing doc comments for the v5 public API

The API reference on the docs website is generated from these comments; what a
comment says, and how, is what the reader sees. The full tag reference with
examples is in [reference.md](reference.md).

## Layout

A doc comment is `/** … */` directly above the declaration. Any other comment
(a section label, a note for someone reading the code) is `//`.

The tags go in three sections, always in this order:

1. **Description** — the summary (first paragraph, no tag), then `@remarks`.
2. **More information** — `@defaultValue`, `@typeParam`, `@param`, `@returns`,
   `@example`, `@see`, in this order; callouts (`@note`, `@tip`, `@info`,
   `@warning`, `@danger`) anywhere in this section.
3. **Metadata** — `@namespace`, `@platform`, `@experimental`, `@deprecated`.

```ts
/**
 * Specifies the display mode for the tab bar.
 *
 * @remarks
 * The tab bar can be shown as a regular bar at the bottom of the screen or as
 * a sidebar.
 *
 * @defaultValue `'automatic'`
 * @see {@link TabsHostPropsIOS.tabBarSidebarPreferredPlacement | tabBarSidebarPreferredPlacement}
 * @platform ios >= 18
 */
tabBarControllerMode?: TabBarControllerMode | undefined;
```

## What every comment needs

- **A summary** on every documented type, prop, field and nested object key.
  A props type's summary is `Props for {@link X}.`
- **`@platform`** on every component, prop, field of a type and command (a
  method of a component's ref), including the `ios` / `android` keys — even a
  prop inside `TabsHostPropsIOS` gets `@platform ios`. A type itself never has
  it: unions, aliases, interfaces, function types, props types, ref types.
- **`@defaultValue`** on every prop that has a default.
- **`@param`** for every parameter, **`@typeParam`** for every type parameter
  and **`@returns`** for every non-`void` return, on the type that has the
  signature.
- **`@experimental`** on an experimental component and on its props type
  (not on each of its props); on a single experimental prop of a stable
  component together with the `experimental_` prefix.

## `@platform`

- Platforms in lower case and alphabetical order: `android`, `ios`, `tvos`,
  `visionos`. A platform is listed only where the symbol is implemented; an
  unlisted platform is unsupported — no "not supported on tvOS" text.
- A version only above the library's minimum: `@platform ios >= 26`,
  `@platform android >= 33, ios`. An API that works from the minimum or
  earlier has the platform alone. No trailing `.0`. Upper bound `ios <= 18`,
  range `ios 16 - 18`; a space on each side of `>=`, `<=` and `-`.
- Check every platform and version in two places, never in the prop's name:
  the native code (`@available`, `RNS_IPHONE_OS_VERSION_AVAILABLE`,
  `TARGET_OS_TV`, `Build.VERSION.SDK_INT`) and the availability of the platform
  API that code calls, in Apple's or Android's documentation. The code shows
  where the library implements the symbol: a platform is listed only there, so
  a cross-platform prop that iOS does not handle yet is `@platform android`.
  The platform API shows the version each platform needs. When the two
  disagree, report it instead of choosing one.
- Read the minimums from the source every time, do not assume them:
  `min_supported_ios_version`, `min_supported_tvos_version` and
  `min_supported_visionos_version` in `RNScreens.podspec`, and
  `rnsDefaultMinSdkVersion` in `android/build.gradle`. If any of them is not
  there, stop and report it instead of guessing; this skill then needs an
  update.
- The text never repeats the requirement ("Available from iOS 26.").
- A field is tagged for itself, with every platform it works on in any use of
  its type. The reader gets the platforms that the component, the prop and the
  field all list.
- A union value has no tag, and the union's comment names no platforms or
  versions. When one value needs a newer version, each prop that accepts the
  type says so in its `@remarks`, with what the value does on older versions.

## Never

- **No `@since`**, and no library versions in the text ("since 5.2",
  "changed in 5.3"). The docs are versioned instead.
- No `@summary`, `@description`, `@default` or `@supported`; no
  `{@link X#y}`.
- No "EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE" text.
- No `@see` and no `{@link}` to the prop's own type; the page already links
  it.
- No callout inside `@remarks`, and no more than one `@remarks`.
- No tag written as plain text. "Note:", "Tip:", "Important:", "Warning:" go
  into `@note`, `@tip`, `@info`, `@warning` or `@danger`; "See also …" or a
  standalone "See X." into `@see`; "Defaults to …" into `@defaultValue`;
  "Example:" into `@example`; "Deprecated, use X" into `@deprecated`. The
  website renders each tag in its own form, and plain text loses that.
- No "For example" in `@remarks`. An example goes into `@example` (code, with an
  optional title and a sentence or two around it), or is left out.
- No description of what UIKit, React Native or another library does with each
  value, and no "maps to the UIKit X of the same name". Name the values and add
  a `@see` to their documentation; for another library's type, one sentence on
  what we accept and a `@see`.

## Text

- Values in backticks, string values with their quotes: `` `'inherit'` ``,
  `` `false` ``, `` `undefined` ``. JSX, HTML and `<`, `>`, `{`, `}` in
  backticks too.
- Components named the way users write them: `Tabs.Host`, never `TabsHost`.
- A prop or field does not repeat what its type documents: the values of a
  union, the fields of an object, or behaviour that is the same wherever the
  type is used. That goes on the type.
- The values of a union are listed on the type, in its `@remarks`, after a
  sentence that introduces them — only when the values have descriptions.
  A union that extends another one lists all its values, described or not,
  when it has at most three in total; with more, it links to the extended
  union and lists only the added values that have descriptions (reference.md,
  "Value lists").
- A family alias of a common type says what it is for, then points at the
  common type: `Accepts any {@link SheetDetents} value.` for a union,
  `See {@link SheetNativeContainerStyleProps} for its fields.` for an object
  (model: the aliases at the top of `FormSheet.types.ts`).
- Every sentence tells the reader something the name, the type and the summary
  do not; `@remarks` does not restate the summary. A prop's summary says what
  the prop does for all its values, not only for some of them.
- A component's summary says what it is for, not only that it works around
  something. Things the system defines (system insets, bar items) are given as
  examples ("such as …"), never as a complete list.
- An implementation detail that may change goes into its own `@note`, which
  starts with "This is an implementation detail and may change."; behaviour the
  user can rely on stays in `@remarks`, also when it differs between
  platforms.
- Every claim about behaviour is true in the native code and concrete: a
  number, not "more"; the condition, not "in some cases". A value that UIKit,
  Material or the system decides (a limit, a width threshold) may change with
  their version: give it in an implementation-detail `@note`, and keep the
  general behaviour in `@remarks`.
- A limitation, a requirement or an error goes into `@info`, or into
  `@warning` when it can hurt the user, and says what the user of the library
  sees and when: "Throws an error during render when …", "Requires the
  predictive back gesture to be enabled in the app's manifest." Use callouts
  sparingly: each renders as a banner on the page, so only what the reader must
  not miss goes into one; the rest stays in `@remarks`.
- Wrap comment text at 80 columns; code blocks and tables are exempt.

## Links

- A component, prop or type of the library mentioned in the text is a
  `{@link}`: `{@link Tabs.Host}`, `{@link ContainedModalProvider}`.
- A member is linked through the type that declares it, with its own name as
  the text: `{@link TabsHostPropsBase.colorScheme | colorScheme}`.
- Link only the first mention within one comment, that is within the comment
  of one type, prop, field, component or command, across its summary and all
  its tags; later mentions in the same comment are in backticks.
- A prop's comment does not link to the prop itself, nor to the prop's own
  type; its own name stays in backticks.
- The summary of an event payload links the prop that sends it:
  `Payload of {@link StackScreenProps.onBackGestureEnd | onBackGestureEnd}.`
  A group type that several components use (`SheetDetentChangedEvent`) names
  the event in backticks; its family aliases link their own prop.
- React Native types (`View`, `Image`) are not linked.
- A link that is part of a sentence stays in the text. A pointer that stands on
  its own goes into `@see`, as in `reference.md`.
- Our own docs are linked by name, never by URL.

## Editing existing comments

When the task is to bring an existing comment in line with these rules (tags,
format, links), keep the author's wording. Change the text only where it is
wrong or breaks a rule above, and say so.

## `//` comments

A `//` comment in the library is read by someone who never saw the discussion
behind the code: no answers to a review ("on purpose"), no task or plan IDs,
no "for now" or "in a later PR". A constraint that is not obvious is stated as
a fact.

## Outside the task

These rules apply to what the task adds or changes. When you notice code or a
comment outside the task that breaks them, do not change it: list it in your
report with the file and line, so that it can go into a separate pull request.

A comment that the change makes wrong is part of the task, not outside it.
Search the existing comments that describe what the change touches (the native
view, the behaviour, the props it interacts with) and update the ones that are
no longer true.

## Then

Check the change with the `check-public-api` skill.
