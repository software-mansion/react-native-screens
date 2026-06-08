# Test Scenario: nativeContainerStyle

## Details

**Description:** Verifies the `nativeContainerStyle` prop on `TabsHost`,
which allows customising the background color of the native container
wrapping the tabs. The test validates that setting `backgroundColor`
via the picker applies the color to the correct native surface on each
platform, that the color persists when switching between tabs, and that
restoring `unset` returns the container to the system default. The prop
is a host-level setting: it is not per-route.

Platform surfaces affected:
- **iOS** — applied to the `UITabBarController`'s root view (behind
  both the content area and the tab bar).
- **Android** — applied to the `FrameLayout` that wraps the currently
  focused screen and the `BottomNavigationView`.

**OS test creation version:** iOS: 18.6 and 26.5, Android: API Level 36.

## E2E test

Incomplete: Not automated. Detox cannot assert native background-color
attributes on either platform, so visual verification must be done
manually.

## Prerequisites

- iOS device or simulator
- Android emulator or device

## Note

- The color change applies immediately upon selecting a new value; no
  restart is required.
- On iOS the color fills the area behind the content screen and around
  the tab bar (the full `UITabBarController` view). The tab bar itself
  may partially obscure the color unless the tab bar has a transparent
  or semi-transparent background.
- On Android the color fills the `FrameLayout` container, which is
  visible in the gutters around the focused screen content and behind
  the `BottomNavigationView`.

## Steps

### Baseline

1. Launch the app and navigate to **Native Container Style**.

- [ ] The **Config** tab is active. The `backgroundColor`
  picker shows `unset`. The container background is the system default
  (no custom color visible).

---

### Setting backgroundColor to blue and yellow

2. On the **Config** tab, set the `backgroundColor` picker to `blue`.

- [ ] The picker displays `blue`. The native container's background immediately changes to blue.
- [ ] **iOS18:** The blue color is visible behind both the tab content area and the tab bar area, as tabBarBackgroundColor is transparent.
- [ ] **iOS26:** The blue color is visible behind the tab content area and through the liquid glass tab bar.
- [ ] **Android:** The blue color is visible in the area surrounding the focused content screen. The tab bar retains the system default background color.

3. Tap the **Tab** tab in the tab bar.

- [ ] The **Tab** screen content is displayed (featuring the "Tab" label and
  hint text).
- [ ] The container background remains blue.
- [ ] **iOS:** The appearance of the tab bar area is identical to the previous step.
- [ ] **Android:** The tab bar is transparent, making the blue background visible behind the tabs.

4. Tap the **Config** tab to switch back.

- [ ] The **Config** tab is shown again.
- [ ] The `backgroundColor` picker still shows `blue`.
- [ ] The blue container background persists.

5. Set the `backgroundColor` picker to `yellow`.

- [ ] The container background changes immediately to yellow.
- [ ] The blue color is no longer visible.

6. Tap the **Tab** tab, observe the background, then return to **Config**.

- [ ] The yellow background is visible on the **Tab** screen and remains after switching back to **Config**.
- [ ] The picker still shows `yellow`.

---

### Restoring to unset

7. Set the `backgroundColor` picker back to `unset`.

- [ ] The container background returns to the system default.
- [ ] No custom color is visible.
- [ ] The picker shows `unset`.

8. Tap the **Tab** tab and observe the background.

- [ ] The **Tab** screen appears with the system-default container background.
- [ ] No color remnant from the previous `yellow` value is visible.

---

### Rapid color cycling (edge case)

9. From the **Config** tab, cycle the `backgroundColor` picker rapidly
    through `blue` → `yellow` → `unset` → `blue`.

- [ ] The container background updates with each selection.
- [ ] No crash, no layout freeze, and no color bleed between selections.
- [ ] The final displayed color is blue.
