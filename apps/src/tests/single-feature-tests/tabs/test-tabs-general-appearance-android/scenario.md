# Test Scenario: Tab Bar General Appearance (Android)

## Details

**Description:** Verifies Android tab bar appearance behaviors,
specifically checking native system defaults, per-tab tab bar background color,
dynamic text label visibility rules, and the interaction between the touch-ripple
animation and the persistent active indicator shape.

**OS test creation version:** Android: API Level 36.

## E2E test

Incomplete: Covers only the tabBarItemLabelVisibilityMode verification (steps 2-7).
Step 8, which involves cycling between modes, was omitted from having a dedicated
test because the preceding test cases already cover tab switching and sufficiently
validate this behavior.

Other properties cannot be verified using Detox since it lacks access to color
or visibility attributes on Android views. Therefore, it is not possible to
programmatically assert whether a label is hidden or if a specific color value has been applied.


## Prerequisites

- Android emulator or physical device.

## Note

- This scenario is **Android-only**. All props under test are configured
  only for the Android platform.
- The four tabs (Default, Label, Ripple, Indicator) are independent;
  changes on one tab do not affect the others.
- The Label tab picker resets to `auto` on every fresh launch.
- The Ripple and Indicator tabs are static — they have no interactive
  controls. Verification is purely visual.
- The ripple (`tabBarItemRippleColor`) is a **transient** touch-feedback
  color seen only while pressing or holding a tab item. It is distinct
  from the active indicator (`tabBarItemActiveIndicatorColor`), which
  is a **persistent** pill visible behind the selected tab icon.
- The ripple effect may sometimes fail to trigger; this is a known issue reported
in [Issue#1530](https://github.com/software-mansion/react-native-screens-labs/issues/1530).

## Steps

### Default tab

1. Launch the app and navigate to the **Tab Bar General Appearance** screen.

- [ ] The **Default** tab is selected and its content ("Default configuration")
is visible.
- [ ] Four tabs are shown in the tab bar - selected tab has visible
title ("Default"), for other tabs only icons are shown in the tab bar.
- [ ] The tab bar renders in the system default colors with no appearance
overrides applied.

---

### Label tab — tabBarItemLabelVisibilityMode

2. Tap the second tab from the left side.

- [ ] The Label tab content ("Label Visibility Mode") is visible.
- [ ] The `tabBarItemLabelVisibilityMode` picker shows `auto`.
- [ ] Tab bar renders labels using the system default behavior - only selected
tab title is visible.

3. In the picker, select `labeled`.

- [ ] Labels for all four tabs are shown.

4. Tap a **Default** tab and observe the tab bar.

- [ ] "Default" becomes selected and its label is now
  shown. The labels for other tabs are no longer visible.

5. Tap the second tab again.

- [ ] "Label" tab is selected, label for all tabs reappears.

6. In the picker, select `selected`.

- [ ] Only the currently selected tab ("Label") shows
  its label. Labels for the other three tabs are hidden.

7. In the picker, select `unlabeled`.

- [ ] Labels for all four tabs are hidden; only icons
  are shown in the tab bar.

8. Cycle through all four values (`auto` → `selected` → `labeled`
    → `unlabeled`) in quick succession.

- [ ] The tab bar updates immediately after each change with no crash or layout freeze.
- [ ] At the end, labels for all tabs are hidden (unlabeled).

---

### Ripple tab — transient ripple color (indicator disabled)

9. Tap the **Ripple** tab (third from left).

- [ ] The Ripple tab content ("Ripple Effect") is visible.
- [ ] The tab bar background changes to dark navy.
- [ ] Labels are shown for all tabs.
- [ ] No persistent indicator pill is visible behind tab icon.

10. Press and hold the **Default** tab item in the tab bar for
    approximately one second, then release.

- [ ] While pressing, a transient ripple expands from
  the touch point in yellow.
- [ ] The ripple fades and disappears after release.

11. Tap the **Label** tab, then the **Ripple** tab.

- [ ] When Label tab is selected, labels for all tabs are hidden.
- [ ] While selecting Ripple tab, a ripple effect is visible as an
unconstrained yellow circle that expands and smoothly fades outward.

---

### Indicator tab — persistent active indicator + ripple

12. Tap the **Indicator** tab.

- [ ] The Indicator tab content ("Active Indicator Enabled") is visible.
- [ ] The tab bar background changes to purple.
- [ ] Labels are shown for all tabs.
- [ ] A persistent green pill-shaped indicator is visible behind the "Indicator"
tab icon in the tab bar.

13.  Tap the **Default** tab, then the **Indicator** tab.

- [ ] The yellow ripple effect is visible on the Indicator tab item,
contained within the pill-shaped active indicator frame.
- [ ] After the ripple animation ends, the indicator color remains green.

14.  Tap the **Indicator** tab. Then press and hold the **Default**
    tab item for approximately one second, then release.

- [ ] While pressing, a transient yellow ripple is visible.
- [ ] The ripple is contained within the pill-shaped indicator frame.

15.  Rapidly tap between **Default**, **Label**, and **Ripple** tabs
    several times.

- [ ] Per-tab tab bar custom appearance configurations are applied correctly while switching tabs.
