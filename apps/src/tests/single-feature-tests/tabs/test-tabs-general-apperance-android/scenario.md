# Test Scenario: Tab Bar Appearance (Android)

## Details

**Description:** Verifies tab bar appearance props for Android. The test
covers two independent appearance axes:

1. **Label visibility** - `tabBarItemLabelVisibilityMode` controls whether
   tab labels are shown always (`labeled`), never (`unlabeled`), only for
   the selected tab (`selected`), or follow the system default (`auto`).
2. **Colors and active indicator** — `tabBarBackgroundColor`,
   `tabBarItemRippleColor`, `tabBarItemActiveIndicatorColor`, and
   `tabBarItemActiveIndicatorEnabled` together control the background
   tint, touch-ripple color, and the pill-shaped indicator drawn behind
   the active tab icon.

**OS test creation version:** Android: API Level 36.

## E2E test

Incomplete: Not automated. Detox does not have access to color or visibility attributes on
Android views, so it is not possible to programmatically assert whether
a label is hidden or a specific color value has been applied.

## Prerequisites

- Android emulator or physical device.

## Note

- This scenario is **Android-only**. The props under test are configured only for Android.
- The two tabs ("Label" and "Ripple") are independent; changes on one
  tab do not affect the other.
- The active indicator toggle on the Ripple tab starts in the **off**
  (disabled) state on every fresh launch.

## Steps

### Baseline

1. Launch the app and navigate to the **Tab Bar Appearance** screen.

- [ ] Two tabs are shown — "Label" (selected by default) and
  "Custom". The Label tab content is visible. The
  `tabBarItemLabelVisibilityMode` picker shows `auto`.

---

### Label tab — tabBarItemLabelVisibilityMode

2. Verify the initial state of the Label tab with
   `tabBarItemLabelVisibilityMode = auto`.

- [ ] Tab bar renders in the system default configuration.
  Both tab labels ("Label" and "Custom") are visible.

3. Select `selected` in the picker.

- [ ] Only the currently selected tab shows its label. The "Custom" label
  is hidden.

4. In the `tabBarItemLabelVisibilityMode` picker, select `labeled`.

- [ ] Labels for all tabs are always shown regardless of
  selection state.

5. Select `unlabeled` in the picker.

- [ ] Labels for all tabs are hidden; only icons are shown.

6. Select `auto` in the picker.

- [ ] Tab bar returns to the system default label rendering.

7. Cycle through all four values (`auto` → `selected` → `labeled` →
   `unlabeled`) in quick succession.

- [ ] The tab bar updates immediately after each change with
  no crash or layout freeze. At the end labels for all tabs are hidden.

---

### Custom tab — colors and active indicator

8. Tap the **Custom** tab.

- [ ] The Custom tab content is visible. The tab bar
  background changes to PurpleDark100. The
  `tabBarItemActiveIndicatorEnabled` switch is off.

9. Tap the "Label" tab and then tap the "Custom" tab again to
   observe the touch-ripple color.

- [ ] Tab titles are hidden when selecting the "Label" tab.
- [ ] A ripple effect in YellowDark100 is visible on the tapped tab item as an
unconstrained yellow circle that expands and smoothly fades outward.

10. Enable the `tabBarItemActiveIndicatorEnabled` switch.

- [ ] A pill-shaped active indicator in GreenLight100
appears behind the Custom tab's icon in the tab bar.

11.  Tap the **Label** tab, then tap the **Custom** tab again to
   observe the touch-ripple color.

- [ ] The tabs title are hidden when Label tab is selected.
- [ ] The ripple effect in YellowDark100 is visible on the tapped tab item,
contained inside the pill-shaped active indicator frame.
After the ripple animation ends, the indicator color remains GreenLight100.

12. Disable the `tabBarItemActiveIndicatorEnabled` switch.

- [ ] The active indicator is no longer visible.
  Tab bar background and ripple colors remain unchanged.

13. Toggle the `tabBarItemActiveIndicatorEnabled` switch on and off
    few times in quick succession.

- [ ] The indicator appears and disappears correctly with
  each toggle. No crash or visual artifact occurs.
