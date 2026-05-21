# Test Scenario: Tab Bar General Appearance (No Liquid Glass)

## Details

**Description:** Validates per-tab tab bar visual appearance on iOS versions
without Liquid Glass support. Each tab exercises a distinct combination of
`standardAppearance` and `scrollEdgeAppearance` props - specifically
`tabBarBackgroundColor`, `tabBarBlurEffect`, and `tabBarShadowColor` - to
confirm that the correct colors and blur effects render at rest, during
scroll, and at the scroll edge. A runtime picker on Tab4 verifies that
`tabBarBlurEffect` updates live without a restart.

**OS test creation version:** iOS 18.6

## E2E test

No: Visual color verification (background color, shadow color, blur effect)
is not reliably detectable by Detox view-hierarchy testing. Confirming the
exact rendered color of a native tab bar requires visual inspection.

## Prerequisites

- iOS 18 device or simulator (the tested props have no effect on iOS 26+)

## Note

- `tabBarBackgroundColor`, `tabBarBlurEffect`, and `tabBarShadowColor` are
  **iOS-only** props and have no effect on Android.
- `scrollEdgeAppearance` activates when the bottom scroll content edge is
  aligned with the tab bar edge. On a tab with no `ScrollView`, the
  `scrollEdgeAppearance` is always active. If not explicitly defined,
  UIKit uses `standardAppearance`, modified to have a transparent background.
- `tabBarBlurEffect` only visibly blurs the background when the background
  color has an alpha value less than 1.

## Steps

### Baseline

1. Launch the app and navigate to the
   **Tab Bar General Appearance No Liquid Glass** screen.

- [ ] Expected: **Tab1** is selected and its content is visible.
  The tab bar shows four items: Tab1, Tab2, Tab3, Tab4.

---

### Tab1 - no ScrollView, no scrollEdgeAppearance defined

2. Observe the tab bar while **Tab1** is selected. Tab1 has no `ScrollView`
   and no `scrollEdgeAppearance` defined.

- [ ] Expected: The tab bar background is fully transparent. No colored
  background or custom shadow line is visible.

---

### Tab2 - scrollEdgeAppearance always active, no ScrollView

3. Tap **Tab2**.

- [ ] Expected: Tab2 content is displayed. The tab bar background appears
  as a semi-transparent dark purple with a vivid purple shadow line.
  Since `tabBarBlurEffect` is not set, it falls back to `systemDefault`
  - a subtle system blur is visible through the semi-transparent background.
  The navy dark `standardAppearance` background color is not visible through semi-transparent background.

---

### Tab3 - standardAppearance at top, scrollEdgeAppearance at bottom

4. Tap **Tab3**.

- [ ] Expected: Tab3 is selected and shows a `ScrollView` at the top
  of the list. The tab bar reflects `standardAppearance`: navy dark
  background with dark red shadow. No blur effect is applied.

5. Scroll **down** through the Tab3 list until the bottom of the content
   is aligned with or past the tab bar.

- [ ] Expected: When the scroll edge reaches the tab bar,
  `scrollEdgeAppearance` activates. The tab bar background changes to
  semi-transparent dark purple with a vivid purple shadow. The
  `tabBarBlurEffect` is `systemChromeMaterialDark`, so a dark chromatic
  blur effect is visible through the semi-transparent background.

6. Scroll **back up** on Tab3.

- [ ] Expected: `scrollEdgeAppearance` deactivates and
  `standardAppearance` is restored - background returns to navy dark with
  dark red shadow and no blur.

---

### Tab4 - runtime tabBarBlurEffect update via picker

7. Tap **Tab4**. Observe the tab bar at the top of the list.

- [ ] Expected: Tab4 is selected with a `ScrollView`. At the top,
  `standardAppearance` is active: background is semi-transparent navy,
  shadow is dark navy. The blur picker shows `none` by default - the
  background renders as a flat semi-transparent tint with no blur visible.
  The image at the bottom of the scroll content is visible through the
  semi-transparent tab bar background when scrolled into view.

8. On **Tab4**, use the **tabBarBlurEffect** picker to select
   `systemChromeMaterialDark`.

- [ ] Expected: The tab bar immediately updates - a dark chromatic blur
  is applied over the same semi-transparent navy background. The background
  and shadow colors remain unchanged; only the blur effect changes. Content
  is still visible through the blurred background.

9. On **Tab4**, change the picker to `systemDefault`.

- [ ] Expected: The blur effect changes to UIKit's default tab bar blur.
  The background and shadow remain the same. Content is still visible
  through the blurred background.

10. Change the picker back to `none`.

- [ ] Expected: Blur is removed. The tab bar background is again a flat
  semi-transparent navy tint with no blur.

11. Scroll **down** through the Tab4 list until the bottom edge of the
   content is aligned with the tab bar.

- [ ] Expected: `scrollEdgeAppearance` activates. The tab bar background
  changes to dark purple with a vivid purple shadow. `tabBarBlurEffect`
  is `none` for this appearance - the purple background renders as a
  solid opaque color with no blur.

12. Scroll **back up** to the top of Tab4.

- [ ] Expected: `standardAppearance` is restored - background returns to
  semi-transparent navy and shadow to dark navy.

---

### Tab switching - appearance isolation

13. Switch rapidly between Tab1, Tab2, Tab3, and Tab4 several times.

- [ ] Expected: Each tab's configured appearance is applied immediately
  upon selection with no visual artifacts, flicker, or carry-over of the
  previously selected tab's appearance.
