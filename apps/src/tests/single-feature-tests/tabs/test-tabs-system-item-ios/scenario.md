# Test Scenario: Tab Bar Item System Item (iOS)

## Details

**Description:** Validates the iOS `systemItem` property across two
tabs. Verifies that a static `systemItem: 'bookmarks'` tab renders
the correct UIKit-provided icon and localized title with no override.
Exercises the Runtime Config tab, which combines three independent
toggle groups (systemItem, title, icon) applied atomically via
`setRouteOptions`, and verifies that all combinations produce the
correct tab bar item appearance — including that switching the icon
back to `system` immediately removes any stale custom SF Symbol image.
Verifies that the `search` item renders as a magnifying glass with
iOS-version-specific layout differences. Includes an orientation
smoke test.

**OS test creation version:** iOS 18.6 and iOS 26.5

## E2E test

TBD: Planned, but will be implemented separately.

## Prerequisites

- iOS device or simulator running iOS 18 or later.
- The iPhone in portrait orientation is the primary verification
  surface.
- Compact inline orientation refers to the landscape device orientation for standard
iPhone Pro models (for iOS 18 excluding Max).

## Note

- Test is iOS-only; `systemItem` has no effect on Android.
- On iOS 26 (Liquid Glass), the tab bar layout and icon rendering
  differ visually from iOS 18, but `systemItem` semantics are the
  same across versions.
- "System icon" means the icon UIKit provides for a given system item
  type. A custom `icon` / `selectedIcon` prop overrides that icon;
  removing those props (passing `undefined`) must restore the system
  icon immediately with no stale image remaining.
- `title: undefined` falls back to the UIKit-localized system title
  for the item type. `title: ''` (empty string) hides the label.
- Active toggle buttons in the Runtime Config tab are highlighted
  dark blue.
- iOS 26: The `systemItem 'search'` tab bar item is detached from the other items
  and has no label.
- iOS 18 KI: SystemItem icon is not overridden for the compactInline
  (landscape orientation on iPhone Pro) tab bar appearance.

## Steps

### Static System Item tab

1. Launch the app and navigate to the **Tab Bar System Item** screen.

- [ ] Two tabs are visible in the tab bar.
- [ ] The first tab is selected by default.
- [ ] Its tab bar item shows the UIKit open-book icon and the
  iOS-localized title `Bookmarks`.
- [ ] No custom title or icon override is present.

2. Tap the second tab, then tap the first tab (**Bookmarks**)
   again.

- [ ] The Bookmarks tab is re-selected.
- [ ] The localized open-book icon and `Bookmarks` title are
  unchanged after re-selection.

---

### Runtime Config tab — initial state

3. Tap the second tab in the tab bar (**Favorites**).

- [ ] The Favorites tab becomes selected.
- [ ] The Runtime Config title is displayed on the screen.
- [ ] The on-screen status reads: `systemItem: 'favorites'`,
  `title: undefined (system)`, `icon: system (from systemItem)`.
- [ ] The tab bar item shows the UIKit favorites (star) icon with
  the iOS-localized title `Favorites`.

---

### Runtime Config tab — systemItem cycling

4. Tap **history** in the systemItem group.

- [ ] The tab bar item changes to the UIKit history (clock) icon and
  the `History` title.
- [ ] The on-screen status updates to `systemItem: 'history'`.

5. Tap **search** in the systemItem group.

- [ ] The tab bar item changes to the UIKit magnifying glass icon.
- [ ] iOS 18: The title label `Search` is visible beneath the icon.
- [ ] iOS 26: No visible title label; the Search tab bar item is
  detached from the other items.

6. Tap **favorites** to restore the initial systemItem.

- [ ] The tab bar item reverts to the UIKit favorites icon and
  `Favorites` title.
- [ ] iOS 26: The tab bar item correctly realigns and is no longer detached.

---

### Runtime Config tab — title override cycling

7. Tap **Custom** in the title group.

- [ ] The tab bar item label changes to `Custom` immediately.
- [ ] The favorites icon remains visible and is unchanged.

8. Tap **hidden** in the title group.

- [ ] The tab bar item label disappears entirely (empty string).
- [ ] The favorites icon is still visible in the tab bar item.

9. Tap **system** in the title group.

- [ ] The tab bar item label returns to the UIKit-localized title
  `Favorites` immediately.

---

### Runtime Config tab — icon override cycling

10. Tap **house** in the icon group.

- [ ] The tab bar item icon changes to the `house.fill` SF Symbol.
- [ ] The system favorites icon is no longer visible.

11.  Tap the first tab (**Bookmarks**) and observe icons, then
    tap **Favorites** again.

- [ ] While Bookmarks is selected, the Favorites tab bar item
  shows the unselected `house` SF Symbol.
- [ ] On re-selection, the Favorites tab bar item shows
  `house.fill`.

12. Tap **heart** in the icon group.

- [ ] The tab bar item icon changes to `heart.fill` immediately.
- [ ] No `house` or `house.fill` image lingers.

13.  Tap **system** in the icon group.

- [ ] The custom icon is removed. The tab bar item falls back to
  the UIKit system icon for the current systemItem (`favorites`
  star) immediately.
- [ ] No stale `heart` or `heart.fill` image remains in the tab bar
  item.

---

### Runtime Config tab — combined overrides

14. Set systemItem to **search**, title to **custom**, icon to
    **heart** (all three groups in a non-default state).

- [ ] The tab bar item shows the `heart` SF Symbol icon (custom
  icon overrides the system search icon)
- [ ] iOS 18: The label reads  `Custom`.
- [ ] iOS 26: No visible title label; the tab bar item is
  detached from the Bookmarks item.

15.  Tap the first tab (**Bookmarks**).

- [ ] While Bookmarks is selected, the second tab bar item shows the unselected `heart` SF Symbol.
- [ ] iOS 26: The second tab bar item remains detached.
  
16. Tap second tab again. Change systemItem to **history** while keeping title as
    **custom** and icon as **heart**.

- [ ] The icon remains `heart.fill`.
- [ ] The label reads `Custom`.

17.  Change icon to **system** while keeping systemItem as
    **history** and title as **custom**.

- [ ] The icon falls back to the UIKit system history (clock) icon
  immediately.
- [ ] No stale `heart` image remains.
- [ ] The label remains `Custom`.

18. Change title to **hidden ('')** while keeping systemItem as
    **history** and icon as **system**.

- [ ] The tab bar label disappears.
- [ ] The UIKit history icon remains visible.

19. Change title to **system** while keeping systemItem as
    **history** and icon as **system**.

- [ ] The tab bar label reads `History`.
- [ ] The UIKit history icon remains visible.

---

### Orientation smoke test

20.  Select **Bookmarks** tab and rotate device to landscape orientation.

- [ ] The layout adapts to landscape.
- [ ] The tab bar switches to a compact inline layout
  (icons and titles side by side).
- [ ] All two tab items remain visible with system icons and titles.

21. While in landscape orientation, tap the second tab,
    then tap **house** in the icon group, and **custom** in title group.

- [ ] The tab bar label reads `Custom`.
- [ ] iOS 18 KI: Custom SF Symbol overrides may revert to the system icon in compactInline appearance.
- [ ] iOS 26: The icon changes to `house.fill`.

22. Change systemItem to **search** and icon to **heart**. Keep title set to **custom**. 

- [ ] The tab bar label remains `Custom`.
- [ ] iOS 18 KI: Custom SF Symbol overrides may revert to the system icon in compactInline appearance.
- [ ] iOS 26: The icon changes to `heart.fill`. No visible title label; the Search tab bar item is
  detached from the other items.

23.  Rotate the device back to portrait orientation.

- [ ] The tab bar reverts to its portrait layout.
- [ ] The second tab bar item shows the `heart.fill` icon
  (selected).
- [ ] The Bookmarks item is unchanged.
- [ ] The previously selected tab remains selected.
- [ ] iOS 18: The title label `Custom` is visible beneath the icon.
- [ ] iOS 26: No visible title label; the Search tab bar item is
  detached from the other items.
