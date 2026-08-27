# Test Scenario: Header Title & Subtitle Appearance (iOS)

## Details

**Description:** Verifies customization of the title, large title and subtitle
text appearance in the iOS stack v5 header — color, font size, font family,
font weight and font style — configured through the `standardAppearance` and
`scrollEdgeAppearance` objects of the header config. Subtitle appearance keys
apply to both the regular and the large subtitle (UIKit derives the large
subtitle appearance from `subtitleTextAttributes`).
The two appearance objects are configured independently and can be toggled off 
so they are not passed at all. The scenario checks that a default appearance
renders identically to no appearance, `scrollEdgeAppearance` attributes deriving from
`standardAppearance` if not defined, restoring props to their defaults at runtime,
and `PlatformColor` resolution.

**OS test creation version:** iOS 26

## E2E test

TBD.

## Prerequisites

- iOS simulator; subtitle and large subtitle (both the text and the subtitle
  appearance keys) require iOS 26+. On older iOS versions the subtitle-related
  options should have no effect while title/large title styling keeps working.

## Note

- `standardAppearance` applies when scrollable content is scrolled under the
  header; `scrollEdgeAppearance` applies when content edge is aligned with the
  header edge (and for large-title headers at rest). When only
  `standardAppearance` is set, the system derives the scroll-edge appearance
  from it.
- `color` options: `red` / `blue` are literals; `platform` is
  `PlatformColor('systemGreenColor')`.

## Steps

1. Launch the app and navigate to the **Stack Header Title Appearance (iOS)** screen.
2. Enable `standardAppearance`. Under title, select `red` for `color`.
  - Title is red, font family, size (!), weight, style remain default
3. Under title select 30 for `fontSize`, Times New Roman for `fontFamily`, 900 for `fontWeight`,
   italic for `fontStyle`. Under subtitle select blue for `color`, 12 for `fontSize`,
   Courier New for `fontFamily`, 400 for `fontWeight`, normal for `fontStyle`.
  - Updated configuration is visible on both title and subtitle
4. Set `largeTitleEnabled`.
  - No configuration is applied to large title. Large subtitle has the same configuration as subtitle.
5. Select the same options for `largeTitle` as for `subtitle`.
  - Updated configuration for large title is visible and matches large subtitle.
6. Scroll the content all the way to the top.
  - The text keeps the configuration from `standardAppearance`.
7. Unset `largeTitleEnabled`. Enable `scrollEdgeAppearance`. Select all the same options
   as in 3. but swap `title` and `subtitle` options. Scroll to top.
  - Upon scrolling to the edge, configurations swap but are otherwise identical.
8. Set large title `color` to `platform`.
  - Large title color is updated to a shade of green.
