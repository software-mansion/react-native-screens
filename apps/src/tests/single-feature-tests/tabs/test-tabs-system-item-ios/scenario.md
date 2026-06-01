# Test Scenario: Tab Bar Item System Item (iOS)

## Details

**Description:** Validates the iOS `systemItem` property by verifying that
built-in icons and localized titles render correctly,
checking how they interact with custom title or icon overrides,
and ensuring the tab bar layout handles specific icons like search and adapts
seamlessly during device rotation.

**OS test creation version:** iOS 18.6 and iOS 26.5

## E2E test

TBD: Planned, but will be implemented separately.

## Prerequisites

- iOS device or simulator running iOS 18 or later.

## Note

- Test is iOS-only; `systemItem` has no effect on Android.
- On iOS 26 (Liquid Glass), the tab bar layout and icon rendering
  differ visually from iOS 18, but the `systemItem` semantics are the
  same across versions.
- "System icon" refers to the icon defined by UIKit for each system
  item type. Custom `icon`/`selectedIcon` props override the system
  icon
- System-defined title text can be override via custom `title`.
- iOS18 KI([Issue#1074](https://github.com/software-mansion/react-native-screens-labs/issues/1074)): SystemItem Icon is not override for compactInline appearance.

## Steps

### Baseline — tab without `systemItem`

1. Launch the app and navigate to the **Tab Bar System Item**
   screen.

- [ ] Four tabs are visible in the tab bar.
- [ ] The first tab (**NormalTab**) is selected by default. Its tab bar item shows the
  custom title `NormalTab` and the default system icon (from
  `DEFAULT_TAB_ROUTE_OPTIONS`).

---

### `systemItem: 'bookmarks'` — system icon and title, no override

2. Tap the second tab in the tab bar (the one with the bookmarks
   icon).

- [ ] The second tab becomes selected.
- [ ] Its tab bar item shows the UIKit bookmarks icon and the iOS-localized title for
  "bookmarks" (`Bookmarks`).

3. Tap the **NormalTab** tab, then tap the **bookmarks** tab again.

- [ ] The bookmarks tab item re-selects correctly. The icon
  and localized title are unchanged on re-selection.

---

### `systemItem: 'contacts'` with custom icon override

4. Tap the third tab in the tab bar (**Custom**).

- [ ] The third tab becomes selected.
- [ ] Its tab bar item icon is the SF Symbol `house.fill` (selected state).
- [ ] The title displayed in the tab bar is `Custom`.

5. Tap the **NormalTab** tab (so **Custom** becomes unselected), then
   observe the **Custom** tab item in its unselected state.

- [ ] The unselected icon is the SF Symbol `house` (normal
  state icon). The custom title is still shown.

---

### `systemItem: 'search'` — magnifying glass, no title

6. Tap the fourth tab in the tab bar (iOS18: **Search**).

- [ ] The fourth tab becomes selected.
- [ ] Its tab bar item shows a magnifying glass icon.
- [ ] iOS18: Title label is visible (`Search`).
- [ ] iOS26: No visible title label, tab bar item is detached from other tab bar items.

---

### Stability — cycle through all tabs

7. Starting from the **Search** tab, tap each tab in order
   (Search → Custom → bookmarks → NormalTab → Search).

- [ ] Each tab switches correctly on every tap. Icon and
  title for each tab item remain accurate after rapid cycling.

---

### Orientation smoke test — portrait to landscape

8. With the device in portrait orientation and **NormalTab** selected,
   rotate the device to landscape orientation.

- [ ] The layout adapts to landscape.
- [ ] The tab bar icon switch from above title to beside title layout.
- [ ] All four tab items remain visible and their titles are the same as in portrait orientation correct.
- [ ] iOS18: Override icon for `Custom` tab is set to systemItem icon (see KI in Notes section).
- [ ] iOS26: Icons are the same as in portrait orientation.

9. While in landscape orientation, tap each of the four tabs in
   sequence.

- [ ] Tab switching works correctly in landscape.
- [ ] Each tab item's icon and title match the expected appearance as described in previous step.

10.  Rotate the device back to portrait orientation.

- [ ] The tab bar reverts to its portrait layout. All tab
  item icons and titles are correct.
- [ ] The previously selected tab remains selected.
