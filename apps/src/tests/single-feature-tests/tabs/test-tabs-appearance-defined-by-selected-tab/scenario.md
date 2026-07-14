# Test Scenario: Tab-Specific Appearance

## Details

**Description:** Verifies that each tab can independently define its own
tab bar visual appearance via per-tab options,
and that the tab bar updates to reflect the currently selected tab's
configured appearance whenever the active tab changes.

Four tabs are configured with distinct appearances. Tabs 1-3 define their
colors with the library's static `Colors` palette; **Tab4** instead defines
every appearance color via `PlatformColor`, verifying that
per-tab appearance accepts platform-resolved colors.

Tab switching is possible both via the native tab bar items and via
the in-screen "Select tab N" buttons (which call `navigation.selectTab`).

**OS test creation version:** iOS 18.6, iOS 26.5, Android API Level 36.

## E2E test

Incomplete: Not automated. All observable outcomes are purely visual -
native tab bar background color, item icon and title colors, active
indicator color, badge color, and blur effect. Detox does not expose
color or typography attributes of native tab bar views on either
platform, making automated assertion infeasible.

## Prerequisites

- iOS simulator or device (iOS 18 and/or iOS 26).
- The iPhone in portrait orientation is the primary verification surface (stacked layout).
- Android emulator or physical device.

## Note

- To change appearance/color scheme:
  - iOS simulator: use Cmd+Shift+A.
  - Android emulator (use CLI):
    - `adb shell "cmd uimode night yes"`
    - `adb shell "cmd uimode night no"`

- "Select tab N" buttons use `navigation.selectTab(routeKey)` and
  must produce the same visual result as tapping the native tab
  bar item directly.
- **Tab4** uses `PlatformColor`, so its colors are resolved by the OS and
  depend on the current appearance (light/dark) and platform version. The
  color names below describe the expected system color; the exact rendered
  shade is whatever the OS resolves for that token.
- On **iOS 26** (Liquid Glass), `tabBarBackgroundColor` and
  `tabBarBlurEffect` are inert. The purple / navy background color
  difference between Tab1 and Tab2 is therefore **not** observable on
  iOS 26. All other appearance props (icon color, title color) remain
  relevant.
- On **iOS 26**, the `normal` (unselected) state appearance is not
  applied to unselected tabs by UIKit; only the selected state colors are observable.
- The `tabBarItemRippleColor` (Android) is a **transient** touch
  animation color visible only while pressing a tab item; it is
  distinct from the persistent `tabBarItemActiveIndicatorColor` pill.
- Whenever the test steps mention a single color for an unselected or selected state,
the icon consistently uses a darker shade than the title. For instance,
"blue" maps to BlueLight100 for the icon and BlueLight40 for the title,
a pattern that applies across all green, blue, yellow, and red tab elements.

## Steps - iOS

### Baseline

1. Launch the app and navigate to the
   **Tab-Specific Appearance** screen.

- [ ] **Tab1** is selected; the screen shows the label "Tab1" and
  four "Select tab N" buttons.
- [ ] Four tabs are visible in the tab bar: Tab1, Tab2, Tab3, Tab4.
- [ ] The selected Tab1 icon and title are rendered in green.
- [ ] All tab titles follow system default styling.
- [ ] The Tab3 badge has value "123" and green background.
- [ ] The Tab4 badge has value "Platform" and green background.
- [ ] **iOS 18:** The tab bar background is dark navy.
  Unselected tab icons and titles are blue.
- [ ] **iOS 26:** The tab bar uses Liquid Glass; background color
  differences are not observable.

---

### Tab2 appearance

2. Tap **Tab2** in the native tab bar.

- [ ] The screen label changes to "Tab2".
- [ ] The selected Tab2 icon and title change to red.
- [ ] The selected tab title is rendered in 16pt Courier bold italic.
Unselected titles are rendered in the default system style.
- [ ] The badge values for Tab3 and Tab4 are still "123" and "Platform" with a green background.
- [ ] **iOS 18:** The tab bar background changes to purple. Unselected tab icons
and titles are yellow.

3. Tap the **"Select tab 1"** button on the Tab2 screen.

- [ ] Tab1 becomes selected (label changes to "Tab1").
- [ ] The selected Tab1 icon and title colors revert to green selected.
- [ ] The badge values for Tab3 and Tab4 are still "123" and "Platform" with a green background.
- [ ] **iOS 18:** The tab bar background reverts to dark navy. Unselected tab
icons and titles are blue.
- [ ] The result is identical to tapping Tab1 in the native tab bar.

---

### Tab3 appearance

4. Tap **Tab3** in the native tab bar.

- [ ] The screen label changes to "Tab3".
- [ ] The tab badge backgrounds change to red; the values remain "123" for Tab3 and "Platform" for Tab4.
- [ ] The selected Tab3 icon and title are rendered in green.
- [ ] **iOS 18:** The tab bar background returns to dark navy
  (same as Tab1). Unselected tab icons and titles are blue.

---

### Tab4 appearance — PlatformColor

5. Tap **Tab4** in the native tab bar.

- [ ] The screen label changes to "Tab4".
- [ ] The selected Tab4 icon is rendered in green and the
  selected title in orange.
- [ ] The Tab4 badge still has value "Platform".
- [ ] The badge background is red.
- [ ] **iOS 18:** The tab bar background is the system background color - white
  in light appearance, near-black in dark appearance. Unselected tab icons are
  blue and unselected titles are teal.
- [ ] **iOS 26:** Only the selected-state colors (green icon, orange title)
  are observable; the `systemBackground` color and the normal-state
  blue/teal colors are not applied under Liquid Glass.

6. Toggle the simulator between light and dark appearance while Tab4 is
   selected.

- [ ] **iOS 18:** The `systemBackground` tab bar background resolves to its
  light/dark variant automatically, confirming the colors are platform-resolved rather than static.
- [ ] **iOS 26:** Tab bar uses Liquid Glass (not systemBackground), adapting to
  light/dark modes via dynamic translucency instead of solid colors.

---

### Stability — rapid tab switching

7. Rapidly tap through Tab1 → Tab2 → Tab3 → Tab4 → Tab1 several times,
   alternating between native tab bar taps and the in-screen
   "Select tab N" buttons.

- [ ] The tab bar appearance updates immediately with each tab
  change — no delayed or stale appearance from a previous tab.
- [ ] No crash, visual freeze, or incorrect appearance is observed.
- [ ] The route-key label in the screen center always matches the
  currently selected tab.

## Steps - Android

### Baseline

1. Launch the app and navigate to the
   **Tab-Specific Appearance** screen.

- [ ] **Tab1** is selected; the screen shows the label "Tab1" and
  four "Select tab N" buttons.
- [ ] Four tabs are visible in the tab bar: Tab1, Tab2, Tab3, Tab4.
- [ ] The tab bar background is dark navy.
- [ ] The selected Tab1 icon and title are green.
- [ ] Unselected tab icons and titles are blue.
- [ ] A persistent green pill-shaped active indicator is visible
  behind the Tab1 icon.
- [ ] The Tab3 badge displays the value "123" in white text on a green background.
- [ ] The Tab4 badge displays the value "Platform" in white text on a green
  background.

2. Move the focus to Tab3 using the `Tab` key.

- [ ] Tab3 title and icon turn yellow when focused.

---

### Tab2 appearance

3. Tap **Tab2** in the native tab bar.

- [ ] The screen label changes to "Tab2".
- [ ] The tab bar background changes to purple.
- [ ] The selected Tab2 icon and title change to red.
- [ ] Unselected tab icons and titles are yellow.
- [ ] The active indicator pill changes to dark purple.
- [ ] Tab bar labels use the monospace italic font at the configured
  small (10pt) and large (16pt) label sizes.
- [ ] The badge values for Tab3 and Tab4 are still "123" and "Platform" with white
text on a green background.

4. Press and hold a non-selected tab item in the tab bar to
   observe the ripple color while Tab2 is active.

- [ ] A transient green ripple is visible during the press; it
  fades on release.
- [ ] After releasing the long press, the tab should not switch; Tab2 remains selected.
- [ ] (Compare to Tab1's white translucent ripple when selected.)

5. Tap the **"Select tab 1"** button on the Tab2 screen.

- [ ] Tab1 becomes selected (label changes to "Tab1").
- [ ] The tab bar background reverts to dark navy, item colors
  revert to the Tab1 configuration, and the active indicator
  reverts to green.
- [ ] The result is identical to tapping Tab1 in the native tab bar.

---

### Tab3 appearance

6. Tap **Tab3** in the native tab bar.

- [ ] The screen label changes to "Tab3".
- [ ] The tab bar background is dark navy (same as Tab1).
- [ ] The active indicator pill is green.
- [ ] Icon and title colors for normal, selected, and focused states
  match Tab1's configuration (blue normal, green selected,
  yellow focused).
- [ ] The badge backgrounds for Tab3 and Tab4 change to red, while their values
  remain "123" and "Platform" with green text.

---

### Tab4 appearance — PlatformColor

7. Tap **Tab4** in the native tab bar.

- [ ] The screen label changes to "Tab4".
- [ ] The selected Tab4 icon is dark green and the selected title is light green.
- [ ] Unselected tab icons and titles are blue.
- [ ] The active indicator pill uses the system accent color.
- [ ] The badge backgrounds for Tab3 and Tab4 change to orange, while their values
  remain "123" and "Platform" with white text.

8. With Tab4 selected, toggle the emulator between light and dark apperance and back.

- [ ] The tab bar background adapts to
  the system theme — light/near-white in light mode, near-black in dark
  mode — confirming the background is a platform-resolved.
- [ ] The item colors do not change - configured colors are not
  appearance-adaptive tokens, so they resolve to the
  same color in both light and dark mode.

---

### Stability — rapid tab switching

9. Rapidly tap through Tab1 → Tab2 → Tab3 → Tab4 → Tab1 several times,
   alternating between native tab bar taps and the in-screen
   "Select tab N" buttons.

- [ ] The tab bar appearance (background color, item colors,
  active indicator color) updates immediately with each tab
  change — no stale appearance from a previous tab.
- [ ] No crash, visual freeze, or incorrect appearance is observed.
- [ ] The route-key label always matches the currently selected tab.
