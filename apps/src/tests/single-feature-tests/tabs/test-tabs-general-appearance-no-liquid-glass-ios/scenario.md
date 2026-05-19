# Test Scenario: General Tab Bar Appearance (iOS 18 or lower)

## Details

**Description:** Exercises three iOS-only per-tab tab bar appearance props
via `standardAppearance` and `scrollEdgeAppearance` objects on
`TabsScreenAppearanceIOS`:

- `tabBarBackgroundColor`
- `tabBarBlurEffect`
- `tabBarShadowColor`

**OS test creation version:** iOS 18.6

## E2E test

No: All verifiable effects are purely visual (color, blur, shadow).
Detox has no access to color or blur attributes of native tab bar
elements, so automated assertions are not meaningful here.

## Prerequisites

- iOS simulator or device running **iOS 18.x** (iOS 18 or lower).

## Note

This scenario targets **iOS 18 or lower**. `tabBarBackgroundColor`,
`tabBarBlurEffect`, and `tabBarShadowColor` do not affect the tab bar
on iOS 26+ - running this scenario on iOS 26+ will show the
system-default Liquid Glass tab bar with no visible difference between
the configured tabs.

## Steps

### Baseline - Tab1: scroll-edge appearance only

1. Launch the app and navigate to
   the **Tab Bar General Appearance (iOS 18 or lower)** screen.

- [ ] Expected: Three tabs are visible - **Tab1**, **Tab2**, **Tab3**.
  Tab1 is selected. The tab bar shows a solid medium-dark green
  background with no blur effect and a medium-dark
  violet shadow line directly above the tab bar.

---

### Tab2: switching between appearances via scroll

2. Tap **Tab2** (scroll position starts at the top).

- [ ] Expected: Tab bar transitions to `standardAppearance` - solid
  very dark navy background, no blur, light salmon-red
  shadow line.

3. Scroll **Tab2** downward until the bottom of the list.

- [ ] Expected: Tab bar transitions to `scrollEdgeAppearance` -
  solid medium-dark green background, no blur, medium-dark violet
  shadow line.

4. Scroll **Tab2** back to the very top.

- [ ] Expected: Tab bar transitions back to `standardAppearance` during scroll
  and at the top of the list - solid
  very dark navy background, no blur, light salmon-red shadow line.

---

### Tab3: dynamic blur-effect picker

5. Tap **Tab3**.

- [ ] Expected: Tab3 is selected. The tab bar is semi-transparent light-red
  background, no blur, dark navy-blue shadow line.
  A `tabBarBlurEffect` picker is visible with the current value `none`.

6. In the `tabBarBlurEffect` picker, select
   `systemChromeMaterialDark`.

- [ ] Expected: The tab bar blur effect updates **immediately** without
  reloading the tab. Only the blur changes (making the background appear darker).
  The background behind the blur and shadow remain unchanged
  (semi-transparent light-red, dark navy-blue shadow)

7. Select `systemDefault` in the picker.

- [ ] Expected: The tab bar blur effect updates again immediately to
  the new value. The background and shadow remain unchanged.
  Blur effect creates the appearance of a material with normal thickness on background.

8. Select `none` in the picker to restore the initial blur value.

- [ ] Expected: Blur is removed. Tab bar returns to the base
  appearance (semi-transparent light-red background, dark navy-blue
  shadow, no blur).

---

### Tab switching stability

9. Switch **Tab1 → Tab2 (scrolled down) → Tab3 → Tab1** in quick
   succession.

- [ ] Expected: All three appearance props (`tabBarBackgroundColor`,
  `tabBarBlurEffect`, `tabBarShadowColor`) update correctly on each
  tab switch with no visual artifacts or crashes. Tab2 shows the
  `standardAppearance` if not at the bottom, and
  the `scrollEdgeAppearance` if it was scrolled down when revisited.

10.  Return to **Tab3**, select a `systemChromeMaterialDark` blur value
then switch to **Tab1** and back to **Tab3**.

- [ ] Expected: Tab3 retains the previously selected blur value. The
  tab bar shows the updated `scrollEdgeAppearance` (semi-transparent
  light-red, the selected blur, dark navy-blue shadow) as soon as
  Tab3 is active again.
