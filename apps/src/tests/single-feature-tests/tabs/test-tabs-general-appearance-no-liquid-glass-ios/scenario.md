# Test Scenario: Tab Bar General Appearance (No Liquid Glass) (iOS)

## Details

**Description:** Validates per-tab tab bar visual appearance on iOS 18 and
lower (no Liquid Glass). Three tabs exercise distinct combinations of
`standardAppearance` and `scrollEdgeAppearance`: specifically
`tabBarBackgroundColor`, `tabBarShadowColor`, and `tabBarBlurEffect`,
to confirm that the correct colors and blur effects render at rest, during
scroll, and at the scroll edge. Runtime toggles on Tab1 and Tab2 let the
tester verify each appearance prop independently. A runtime picker on Tab3
verifies that `tabBarBlurEffect` updates live without a restart.

**OS test creation version:** iOS 18.6

## E2E test

Incomplete: Not automated. All observable outcomes are purely visual - background color, shadow
color, and blur effect on the native tab bar. These cannot be reliably
detected by Detox view-hierarchy or snapshot testing.

## Prerequisites

- iOS 18 simulator or device (the tested props have no effect on iOS 26+)

## Note

- The `tabBarBackgroundColor`, `tabBarBlurEffect`, and `tabBarShadowColor`properties
  are explicitly configured for iOS in this scenario,
  and have no effect on Android.
- On iOS 26+ (Liquid Glass), all three props are inert; this scenario
  only applies to iOS 18 and lower.
- `scrollEdgeAppearance` activates when the bottom edge of scrollable
  content aligns with the top edge of the tab bar. On a tab with no
  `ScrollView`, the view is always considered "at scroll edge".
- When `scrollEdgeAppearance` is `undefined`, UIKit derives it from
  `standardAppearance` with a transparent background and shadow (UIKit fallback).
- `tabBarBlurEffect` is only visually apparent when
  `tabBarBackgroundColor` has an alpha value less than 1.
- A `trees.jpg` image is positioned absolutely behind the tab bar at
  app level, making semi-transparent/blurred backgrounds easy to verify
  visually.
- The shadow line on the top edge of the tab bar is very faint; if your monitor
settings make it invisible, please verify it under a high-contrast environment.
- The color values described as "system defaults" (such as the gray titles for
unselected tabs in Step 3) are controlled entirely by UIKit and can changein future
iOS versions.

## Steps

### Baseline

1. Launch the app and navigate to the
   **Tab Bar General Appearance No Liquid Glass** screen.

- [ ] Expected: **Tab1** is selected and its content is visible.
  The tab bar shows three items: Tab1, Tab2, Tab3. Both toggles on
  Tab1 are set to **false**. A green background is visible through the tab bar area.

---

### Tab1 - no ScrollView, both toggles false (default)

2. Observe the tab bar while **Tab1** is selected and both toggles
   are **false** (default state).

- [ ] Expected: No `standardAppearance` or `scrollEdgeAppearance` is
  set. UIKit uses its default appearance - the tab bar background is transparent
  with no custom color or shadow. The view's green background is
  visible through the tab bar area. Titles of unselected tab bar items are
  darker green, while the selected tab title is written in default blue.

---

### Tab1 - standardAppearance true, scrollEdgeAppearance false

3. On Tab1, enable the **standardAppearance** toggle.

- [ ] Expected: `standardAppearance` is applied. Because Tab1 has no
  `ScrollView`, the view is always at the scroll edge, so UIKit derives
  `scrollEdgeAppearance` from `standardAppearance` with a transparent
  background. The tab bar shows a transparent background (no dark navy)
  and no red shadow line. The view's green background is
  visible through the tab bar area. Titles of unselected tab bar items are
  gray, while the selected tab title is written in the default blue color.

---

### Tab1 - standardAppearance false, scrollEdgeAppearance true

4. Disable **standardAppearance** and enable
   **scrollEdgeAppearance**.

- [ ] Expected: The tab bar shows a semi-transparent dark purple background with
the default blur applied, featuring a bright purple shadow line.

---

### Tab1 - both standardAppearance and scrollEdgeAppearance true

5. Enable **standardAppearance** (both toggles now true).

- [ ] Expected: Both appearances are set. The tab bar shows a
  semi-transparent dark purple background and a bright purple shadow line from `scrollEdgeAppearance`.
  System default blur is applied as `tabBarBlurEffect` is not set.

6. Disable both toggles to restore default state before moving to Tab2.

- [ ] Expected: The tab bar returns to the UIKit system default
  appearance (no custom color or shadow).

---

### Tab2 - ScrollView, both toggles true (default)

7. Tap **Tab2**.

- [ ] Expected: Tab2 is selected, displaying a `ScrollView` scrolled to the top
  of the list. Both toggles are **true** by default. The tab bar background is solid
  dark blue with a red shadow line.
  No blur effect is applied.

8. Scroll all the way to the **bottom** of Tab2 until the trees image
    and end of content are visible.

- [ ] Expected: At the bottom edge of the content,
  `scrollEdgeAppearance` activates — the tab bar shows a transparent dark purple
  background, a bright purple shadow, and the `systemChromeMaterialDark` blur effect.
  The view's green background is visible through the blurred, dark transparent purple
  tab bar background.

9. Scroll **back to the top** of Tab2.

- [ ] Expected: The background returns to solid dark blue with a red shadow line.
No blur effect is applied.

---

### Tab2 - standardAppearance true, scrollEdgeAppearance false

10. Disable **scrollEdgeAppearance** and scroll to the bottom edge.

- [ ] Expected: `scrollEdgeAppearance` is unset. UIKit derives it from
  `standardAppearance` with a transparent background. Scrolling to the
  bottom edge now shows a transparent tab bar (no purple fill)
  without shadow. At the top of the screen and during scrolling, the tab bar still
  has a solid dark blue background with a red shadow line.

---

### Tab2 - both toggles false

11. Disable **standardAppearance** (both toggles now false).

- [ ] Expected: No custom appearances are set. The tab bar reverts to
  the UIKit system default throughout all scroll positions. No custom
  color or shadow is applied at the top, middle, or bottom of the scroll content.
  At the bottom, the tab bar background is transparent without a shadow; in all
  other positions on the screen, the background is semi-transparent with the default blur and shadow.

12. Re-enable both toggles to restore Tab2 default state before
    proceeding.

- [ ] Expected: Both toggles are true; scrollEdgeAppearance and
  standardAppearance configurations are restored.

---

### Tab3 - blur picker, standardAppearance only varies by blur

13. Tap **Tab3**.

- [ ] Expected: Tab3 is selected, showing a `ScrollView` and tabBarBlurEffect
  set to `systemDefault`.
  The blur effect is set to UIKit's default tab bar
  blur. Background is semi-transparent navy and shadow is red.
  Content is visible through the blurred background.

14. Use the **tabBarBlurEffect** picker to select
    `systemChromeMaterialDark`. Observe the tab bar.

- [ ] Expected: The tab bar immediately updates. A dark chromatic blur
  is now applied over the semi-transparent navy background. The shadow
  remains red. Background and shadow colors are unchanged - only
  the blur effect changes. Content is visible through the blurred
  background.

15. Scroll to the **bottom edge** of the Tab3 list.

- [ ] Expected: `scrollEdgeAppearance` activates: solid yellow
  background, vivid purple shadow, blur set to `none`.
  The yellow background
  renders as a flat opaque color with no blur, regardless of the picker
  selection.

16. Scroll back to **middle-list** and use the picker to select `none`.

- [ ] Expected: Blur is removed. The tab bar background is a flat
  semi-transparent navy tint with red shadow and no blur.

---

### Stability - tab switching

17. Switch rapidly between Tab1, Tab2, and Tab3 several times.

- [ ] Expected: Each tab's configured appearance is applied immediately
  upon selection. No crash occurs.
