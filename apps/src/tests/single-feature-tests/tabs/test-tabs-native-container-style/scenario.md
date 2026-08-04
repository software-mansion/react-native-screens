# Test Scenario: nativeContainerStyle

## Details

**Description:** Verifies the `nativeContainerStyle` prop on `TabsHost`,
which allows customising the background color of the native container
wrapping the tabs. The test validates that setting `backgroundColor`
via the picker applies the color to the correct native surface on each
platform, that the color persists when switching between tabs, and that
restoring `unset` returns the container to the system default. The prop
is a host-level setting: it is not per-route.

**OS test creation version:** iOS: 18.6 and 26.5, Android: API Level 36.

## E2E test

Incomplete: Not automated. Detox cannot assert native background-color
attributes on either platform, so visual verification must be done
manually.

## Prerequisites

- iOS device or simulator
- Android emulator or device

## Note

- On iOS the color fills the area behind the content screen and around
  the tab bar (the full `UITabBarController` view).
- On Android the color fills the `FrameLayout` that wraps currently focused
screen and the `BottomNavigationView`.
- On Android and iOS 18 and earlier, the tab bar may obscure the native container
  background color unless a transparent or semi-transparent tab bar background
  color is configured.
- On iOS 26, while the "liquid glass" tab bar partially obscures the color, it
  remains inherently visible through the material.

## Steps

### Baseline

1. Launch the app and navigate to **Native Container Style**.

- [ ] The **Config** tab is active. The `backgroundColor`
  picker shows `unset`.
- [ ] The container background is the system default (no custom color visible).
- [ ] **Android/iOS 18:** Tab bar background is red.
- [ ] **iOS 26:** The system default color is visible through the liquid glass tab bar.

---

### Setting backgroundColor to blue and yellow

2. On the **Config** tab, set the `backgroundColor` picker to `blue`.

- [ ] The picker displays `blue`. The native container's background changes to blue.
- [ ] The blue color is visible behind the tab content area.
- [ ] **Android/iOS 18:** The tab bar retains red color.
- [ ] **iOS 26:** The blue color is visible through the liquid glass tab bar.

3. Tap the **Transparent** tab in the tab bar.

- [ ] The **Transparent** screen content is displayed (featuring the "Transparent Tab" label and
  hint text).
- [ ] The container background remains blue.
- [ ] **Android/iOS 18:** The tab bar is transparent, making the blue background visible behind the tabs.
- [ ] **iOS 26:** The appearance of the tab bar area is identical to the previous step.

4. Tap the **Config** tab to switch back.

- [ ] The **Config** tab is shown again.
- [ ] The blue container background persists.

5. Set the `backgroundColor` picker to `yellow`.

- [ ] The yellow color is visible behind the tab content area.
- [ ] **Android/iOS 18:** The tab bar retains red color.
- [ ] **iOS 26:** The yellow color is visible through the liquid glass tab bar.

6. Tap the **Transparent** tab, observe the background, then return to **Config**.

- [ ] The container background remains yellow.
- [ ] **Android/iOS 18:** The tab bar is transparent, making the yellow background visible behind the tabs.
- [ ] **iOS 26:** The appearance of the tab bar area is identical to the previous step.

---

### Restoring to unset

7. Return to **Config** and set the `backgroundColor` picker back to `unset`.

- [ ] The container background returns to the system default.
- [ ] **Android/iOS 18:** The tab bar retains red color.
- [ ] **iOS 26:** The system default color is visible through the liquid glass tab bar.

8. Tap the **Transparent** tab and observe the background.

- [ ] The **Transparent** screen appears with the system-default container background.
- [ ] No color remnant from the previous `yellow` value is visible.

---

### Rapid color cycling (edge case)

9. From the **Config** tab, cycle the `backgroundColor` picker rapidly
    through `blue` → `yellow` → `purple` → `unset` → `blue`.

- [ ] The container background updates with each selection.
- [ ] No crash, no layout freeze, and no color bleed between selections.
- [ ] The final displayed color is blue.
