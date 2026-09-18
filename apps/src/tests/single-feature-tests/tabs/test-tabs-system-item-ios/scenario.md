# Test Scenario: Tab Bar Item System Item (iOS)

## Details

**Description:** Validates the iOS `systemItem` property across three
tabs. Verifies that a static `systemItem: 'bookmarks'` tab renders
the correct UIKit-provided icon and localized title with no override.
Verifies that a static `systemItem: 'search'` tab renders the
magnifying glass item, visually separated from the other items on
iOS 26 (on iOS 27 a plain search tab renders inline again - see the
notes). Exercises the Runtime Config tab, which combines three
independent toggle groups (systemItem, title, icon) applied atomically
via `setRouteOptions`, and verifies that all combinations produce the
correct tab bar item appearance - including that switching the icon
back to `system` immediately removes any stale custom SF Symbol image.
Includes an orientation smoke test.

**OS test creation version:** iOS 18.6 and iOS 26.5 (static search tab additionally verified on iOS 26.5 and iOS 27.0)

## E2E test

Incomplete: Automation covers steps 1–21, but not in full scope - see the
list below. A single suite runs on both iOS versions, with version-specific
conditions where behavior diverges: the tab bar button class name resolves
dynamically (UITabBarButton on iOS 18 and lower vs. _UITabButton on iOS 26).

Not automated:

- Validating the differences between icon and selectedIcon.
- Checking visual icon and label changes.
- The "hidden title" option is validated, but indirectly; it should be verified manually.
- Steps 22-25 (orientation changes).

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
- The `search` item is covered only by the static third tab - the runtime
  toggles offer non-search items exclusively.
- iOS 26: The `systemItem 'search'` tab bar item is separated from the
  other items and has no label.
- iOS 27: A plain search tab renders inline with the other items again -
  the separated (prominent) treatment is tied to search activation
  (`automaticallyActivatesSearch` / `prominentTabIdentifier`).
- iOS 18 KI: SystemItem icon is not overridden for the compactInline
  (landscape orientation on iPhone Pro) tab bar appearance.
- iOS 27 KI (UIKit): with a search tab present in the tab bar, runtime
  changes to the other tab bar items (title / icon / systemItem) may not
  repaint until the tab selection changes. The underlying `UITab` model is
  updated correctly; verified working on iOS 26.5. When verifying runtime
  steps on iOS 27, switch tabs to force a repaint.

## Steps

### Static System Item tab

1. Launch the app and navigate to the **Tab Bar System Item** screen.

- [ ] Three tabs are visible in the tab bar: Bookmarks, Favorites and
  the search item.
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

### Static Search tab

3. Observe the third (search) tab bar item without selecting it.

- [ ] The item shows the UIKit magnifying glass icon.
- [ ] iOS 18 and iOS 27: The item renders inline with the other items,
  with uniform spacing, and shows the localized `Search` title beneath
  the icon.
- [ ] iOS 26: The item is visually separated from the other tab bar
  items - it sits in its own container at the trailing edge, with a
  clearly larger gap to the Favorites item than the gap between
  Bookmarks and Favorites - and shows no title label.

4. Tap the search tab bar item.

- [ ] The Static Search screen content is displayed.
- [ ] The search item is highlighted as selected.

5. Tap the first tab (**Bookmarks**).

- [ ] The Bookmarks screen is displayed again.
- [ ] The search item keeps its position and appearance.

---

### Runtime Config tab - initial state

6. Tap the second tab in the tab bar (**Favorites**).

- [ ] The Favorites tab becomes selected.
- [ ] The Runtime Config title is displayed on the screen.
- [ ] The on-screen status reads: `systemItem: 'favorites'`,
  `title: undefined (system)`, `icon: system (from systemItem)`.
- [ ] The tab bar item shows the UIKit favorites (star) icon with
  the iOS-localized title `Favorites`.

---

### Runtime Config tab - systemItem cycling

7. Tap **history** in the systemItem group.

- [ ] The tab bar item changes to the UIKit history (clock) icon and
  the `History` title.
- [ ] The on-screen status updates to `systemItem: 'history'`.

8. Tap **favorites** to restore the initial systemItem.

- [ ] The tab bar item reverts to the UIKit favorites icon and
  `Favorites` title.

---

### Runtime Config tab - title override cycling

9. Tap **Custom** in the title group.

- [ ] The tab bar item label changes to `Custom` immediately.
- [ ] The favorites icon remains visible and is unchanged.

10. Tap **hidden** in the title group.

- [ ] The tab bar item label disappears entirely (empty string).
- [ ] The favorites icon is still visible in the tab bar item.

11. Tap **system** in the title group.

- [ ] The tab bar item label returns to the UIKit-localized title
  `Favorites` immediately.

---

### Runtime Config tab - icon override cycling

12. Tap **house** in the icon group.

- [ ] The tab bar item icon changes to the `house.fill` SF Symbol.
- [ ] The system favorites icon is no longer visible.

13. Tap the first tab (**Bookmarks**) and observe icons, then
    tap **Favorites** again.

- [ ] While Bookmarks is selected, the Favorites tab bar item
  shows the unselected `house` SF Symbol.
- [ ] On re-selection, the Favorites tab bar item shows
  `house.fill`.

14. Tap **heart** in the icon group.

- [ ] The tab bar item icon changes to `heart.fill` immediately.
- [ ] No `house` or `house.fill` image lingers.

15. Tap **system** in the icon group.

- [ ] The custom icon is removed. The tab bar item falls back to
  the UIKit system icon for the current systemItem (`favorites`
  star) immediately.
- [ ] No stale `heart` or `heart.fill` image remains in the tab bar
  item.

---

### Runtime Config tab - combined overrides

16. Set systemItem to **history**, title to **custom**, icon to
    **heart** (all three groups in a non-default state).

- [ ] The tab bar item shows the `heart` SF Symbol icon (custom
  icon overrides the system history icon).
- [ ] The label reads `Custom`.

17. Tap the first tab (**Bookmarks**).

- [ ] While Bookmarks is selected, the second tab bar item shows the unselected `heart` SF Symbol.

18. Tap second tab again. Change systemItem to **favorites** while keeping title as
    **custom** and icon as **heart**.

- [ ] The icon remains `heart.fill`.
- [ ] The label reads `Custom`.

19. Change icon to **system** while keeping systemItem as
    **favorites** and title as **custom**.

- [ ] The icon falls back to the UIKit system favorites (star) icon
  immediately.
- [ ] No stale `heart` image remains.
- [ ] The label remains `Custom`.

20. Change title to **hidden ('')** while keeping systemItem as
    **favorites** and icon as **system**.

- [ ] The tab bar label disappears.
- [ ] The UIKit favorites icon remains visible.

21. Change title to **system** while keeping systemItem as
    **favorites** and icon as **system**.

- [ ] The tab bar label reads `Favorites`.
- [ ] The UIKit favorites icon remains visible.

---

### Orientation smoke test

22. Select **Bookmarks** tab and rotate device to landscape orientation.

- [ ] The layout adapts to landscape.
- [ ] The tab bar switches to a compact inline layout
  (icons and titles side by side).
- [ ] All three tab items remain visible with system icons.

23. While in landscape orientation, tap the second tab,
    then tap **house** in the icon group, and **custom** in title group.

- [ ] The tab bar label reads `Custom`.
- [ ] iOS 18 KI: Custom SF Symbol overrides may revert to the system icon in compactInline appearance.
- [ ] iOS 26: The icon changes to `house.fill`.

24. Change systemItem to **history** and icon to **heart**. Keep title set to **custom**.

- [ ] The tab bar label remains `Custom`.
- [ ] iOS 18 KI: Custom SF Symbol overrides may revert to the system icon in compactInline appearance.
- [ ] iOS 26: The icon changes to `heart.fill`.

25. Rotate the device back to portrait orientation.

- [ ] The tab bar reverts to its portrait layout.
- [ ] The second tab bar item shows the `heart.fill` icon
  (selected).
- [ ] The Bookmarks item is unchanged.
- [ ] The previously selected tab remains selected.
- [ ] The title label `Custom` is visible beneath the icon.
