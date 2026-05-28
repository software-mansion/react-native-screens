# Test Scenario: Tab Bar Item Icon

## Details

**Description:** Validates tab bar item icon properties (icon, selectedIcon) and
tinting behaviors for iOS and Android. Covers cross-platform icon types including
templateSource, sfSymbol, xcasset, drawableResource, and imageSource.
Verifies that per-tab appearance color configurations (selected, normal,
Android only: focused) correctly override host-level color tints.

**OS test creation version:** iOS 18.6 and iOS 26.5, Android: API Level 36.

## E2E test

Incomplete: Not automated. All observable outcomes are purely visual (icon color,
selected vs. unselected glyph). Detox does not expose tint color or rendered image
attributes of native tab bar items, so automated assertion is not feasible.

## Prerequisites

- Android device or emulator.
- iOS device or simulator running iOS 18 or later.
- The device/simulator/emulator portrait orientation is the primary verification surface (stacked layout).

## Note

- Scenario steps are divided by platform, as test screens vary between iOS and Android.

iOS specific notes:
- **Normal (unselected) state ([iOS26 KI](https://github.com/software-mansion/react-native-screens-labs/discussions/395)):**
  On iOS 18 and lower, any per-tab
  `normal.tabBarItemIconColor` apply to unselected tab icons. On iOS 26,
  only the selected tab is tinted by `tabBarItemIconColor`;
  unselected tabs adopt the system theme appearance.
-  `tabBarTintColor` is applied only to selected tab bar item icon and title.
- **`imageSource` icons are non-tintable:** they render in their original
  colors regardless of `tabBarTintColor` or `tabBarItemIconColor`.
  `templateSource`, `xcasset` and `sfSymbol` icons are tintable.

## Steps - iOS

### Host `tabBarTintColor` applies to a tintable selected icon

1. Launch the app and navigate to the **Tab Bar Item Icon** screen.

- [ ] Expected: Four tabs are visible in the tab bar: **Tint**,
  **Override**, **Xcasset**, and **Image**. The **Tint** tab is
  selected by default. Its icon is the filled template image
  tinted **green** by the host
  `tabBarTintColor`. The unselected **Override** and **Xcasset**
  tabs render their icons and titles in the system theme color. The
  unselected **Image** tab title renders in the system theme color,
  but its icon keeps its original source colors.

---

### `icon` vs `selectedIcon` swap

2. Tap the **Override** tab.

- [ ] Expected: The **Override** tab's icon swaps from the outline
  star to the filled star. The
  previously selected **Tint** tab swaps from the filled template
  image back to the outline template image.

---

### `tabBarItemIconColor` overrides `tabBarTintColor`

3. With **Override** still selected, observe the selected icon color.

- [ ] Expected: The filled star is **red**, NOT green.
  On iOS 18 the selected title is
  green (host tint); on iOS 26 the selected title is red (override - it's native
  bug KI linked in Notes section).

4. Tap the **Tint** tab, then tap **Override** again.

- [ ] Expected: On re-selection the red filled star reappears
  immediately with no visual glitch. The **Tint** tab shows the system-theme
  outline template
  image.

---

### `xcasset` icon uses host tint, no `selectedIcon`

5. Tap the **Xcasset** tab.

- [ ] Expected: The **Xcasset** tab's icon shows the `custom-icon-fill`
  xcasset image tinted **green**. Because no `selectedIcon` is configured for this
  tab, the same icon asset is used in both selected and unselected
  states. The previously selected **Override** tab reverts to the
  outline star in system theme color.

---

### `imageSource` icons are non-tintable

6. Tap the **Image** tab.

- [ ] Expected: The icon swaps from the outline image to
  the filled image. Both renders use the original PNG
  colors - the host `tabBarTintColor` (green) have NO effect on the
  selected icon. On iOS 18, the unselected icon renders in
  **blue**; on iOS 26+ it renders in the system theme
  color.

---

### Stability check

7. Cycle through all four tabs in order
   (Tint -> Override -> Xcasset -> Image), then in reverse.

- [ ] Expected: Each tab swaps between its `icon` and `selectedIcon`
  (where configured) consistently on selection. The correct tint
  behavior is applied each time: green host tint for **Tint** and
  **Xcasset**, red override for **Override**'s selected state, and
  no tint effect for **Image**. No crash, layout freeze, or visual
  artifact occurs during rapid cycling.

## Steps - Android

### Default color settings

1. Launch the app and navigate to the **Tab Bar Item Icon** screen.

- [ ] Expected: Two tabs are visible in the tab bar: **DrawableResource**
  and **Image**. The **DrawableResource** tab is
  selected by default. Its icon is the sym_call_incoming icon. Both
  tabs render their icons and titles in the system theme color.

---

### Color settings for different states

2. Tap the **Image** tab.

- [ ] Expected: The icon swaps from the outline image to
  the filled image. Unselected tab icon change to sym_call_missed.
  Selected tab icon is **red** and unselected icon renders in **green**.

3.  While **Image** tab is selected, use the Tab key on keyboard to
switch focus to the **DrawableResource** tab.

- [ ] Expected: Focused tab title is dark blue while selected tab title
remains red.

---

### Stability check

4. Switch between two tabs few times.

- [ ] Expected: Each tab swaps between its `icon` and `selectedIcon`
  (where configured) consistently on selection. The correct tint
  behavior is applied each time: green host tint for **Tint** and
  **Xcasset**, red override for **Override**'s selected state, and
  no tint effect for **Image**. No crash, layout freeze, or visual
  artifact occurs during rapid cycling.
