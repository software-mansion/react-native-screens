# Test Scenario: overrideScrollViewContentInsetAdjustmentBehavior

## Details

**Description:** Validates the
`overrideScrollViewContentInsetAdjustmentBehavior` prop on `TabsScreen`
(iOS only). By default, React Native sets ScrollView's
`contentInsetAdjustmentBehavior` to `never`, which prevents the scroll
view from respecting navigation bar and tab bar insets. When this prop
is `true` (the default), the behavior is overridden back to UIKit's
`automatic`, so content is inset from the bars. When set to `false`,
the content scrolls behind the bars without insets.
The test verifies that the three tabs — **False**, **True**, and
**Default** — each exhibit the expected inset behavior and that the
**Default** tab (prop omitted) matches the **True** tab.

**OS test creation version:** iOS: 18.6 and 26.2

## E2E test

No: Ongoing research.

## Prerequisites

- iOS device or simulator (iPhone)

## Note

- This prop is iOS-only and Fabric-only; skip on Android.
- "Content scrolls behind bars" means list items are visible underneath
  the navigation bar and/or tab bar when scrolled to the top or bottom
  of the list.
- "Content inset from bars" means the first and last list items are
  fully visible and never hidden behind a bar, even when the scroll
  view is at its extreme positions.
- The navigation bar at the top and the tab bar at the bottom are both
  relevant reference points for inset verification.

## Steps

### Baseline

1. Launch the app and navigate to the
   **Override Scroll View Content Inset** screen.

- [ ] Expected: Three tabs are displayed in the tab bar: **False**,
  **True**, and **Default**. The **False** tab is selected and shows
  a scrollable list of 30 items.

---

### `false` — content scrolls behind bars

2. Confirm the **False** tab is active and scroll the list to the bottom.

- [ ] Expected: The last item in the list is partially or fully
  obscured behind the tab bar, confirming that no bottom inset is
  applied.

3. Scroll the list to the top.

- [ ] Expected: The text label
  `overrideScrollViewContentInsetAdjustmentBehavior: false` at
  the top of the scroll content is partially or fully obscured
  behind the navigation bar, because
  `overrideScrollViewContentInsetAdjustmentBehavior` is `false`
  and the scroll view uses
  `contentInsetAdjustmentBehavior: never`.

---

### `true` — content inset from bars

4. Tap the **True** tab.

- [ ] Expected: The **True** tab becomes active and shows a
  scrollable list of 30 items.

5. Scroll the list to the bottom.

- [ ] Expected: The last item is fully visible and is not obscured by
  the tab bar. The scroll view respects the bottom inset.

6. Scroll the list to the top.

- [ ] Expected: The text label
  `overrideScrollViewContentInsetAdjustmentBehavior: true`
  at the top of the scroll content is fully visible below the
  navigation bar and not obscured behind it. The scroll view
  respects the top inset
  (`contentInsetAdjustmentBehavior: automatic`).

---

### Default (prop omitted) — same as `true`

7. Tap the **Default** tab.

- [ ] Expected: The **Default** tab becomes active and shows a
  scrollable list of 30 items.

8. Scroll the list to the bottom.

- [ ] Expected: The last item is fully visible and not obscured by
  the tab bar — identical behavior to the **True** tab.

9. Scroll the list to the top.

- [ ] Expected: The text label
  `overrideScrollViewContentInsetAdjustmentBehavior:
  (not set, defaults to true)` at the top of the scroll content
  is fully visible below the navigation bar and not obscured
  behind it — identical behavior to the **True** tab.

---

### Cross-tab comparison

10. Switch between the **True** tab and the **Default** tab several
    times while keeping each list scrolled to the top.

- [ ] Expected: Both tabs show the first item fully visible below
  the navigation bar with identical inset. No layout jump or
  visual difference between the two tabs.

11. Switch to the **False** tab and scroll to the top, then
    immediately switch to the **True** tab.

- [ ] Expected: The **True** tab correctly shows the first item
  inset from the navigation bar. No crash or blank screen occurs
  during the switch.
