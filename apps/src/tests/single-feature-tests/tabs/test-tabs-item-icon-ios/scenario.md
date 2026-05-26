# Test Scenario: Tab Bar Item Icon (iOS)

## Details

**Description:** Validates iOS tab bar item icon props: `icon` and
`selectedIcon` (different images for selected vs. unselected states), the
host-level `tabBarTintColor`, and the per-tab
`standardAppearance.stacked.selected.tabBarItemIconColor` override that
takes precedence over the host tint. Covers three `PlatformIconIOS` types:
`templateSource` (tintable), `sfSymbol` (tintable), and `imageSource`
(non-tintable).

**OS test creation version:** iOS 18.6 and iOS 26

## E2E test

No: All observable outcomes are purely visual (icon color, selected vs.
unselected glyph). Detox does not expose tint color or rendered image
attributes of native tab bar items, so automated assertion is not feasible.

## Prerequisites

- iOS device or simulator running iOS 18 or later.
- The iPhone in portrait orientation is the primary verification surface (stacked layout).

## Note

- **Normal (unselected) state ([iOS26 KI](https://github.com/software-mansion/react-native-screens-labs/discussions/395)):**
  On iOS 18 and lower, the host `tabBarTintColor` and any per-tab
  `normal.tabBarItemIconColor` apply to unselected tab icons. On iOS 26,
  only the selected tab is tinted by `tabBarItemIconColor` /
  `tabBarTintColor`; unselected tabs adopt the system theme appearance.
- **`imageSource` icons are non-tintable:** they render in their original
  colors regardless of `tabBarTintColor` or `tabBarItemIconColor`. Only
  `templateSource` and `sfSymbol` icons are tintable.

## Steps

### Host `tabBarTintColor` applies to a tintable selected icon

1. Launch the app and navigate to the **Tab Bar Item Icon** screen.

- [ ] Expected: Three tabs are visible in the tab bar: **Template**,
  **Override**, **Tint**. The **Template** tab is selected by default.
  Its icon is the filled template image (icon_fill.png) tinted
  **green** by the host `tabBarTintColor` (GreenDark100). The
  **Override** tab shows the outline star SF Symbol (`star`); on iOS 18
  and lower it is **green** (host tint applies to unselected items too,
  no per-tab `normal` override is set), on iOS 26+ it uses the system
  theme color. The **Tint** tab shows the outline image (icon.png) in
  its original colors - it is NOT tinted because `imageSource` icons
  are non-tintable.

---

### `icon` vs `selectedIcon` swap

2. Tap the **Override** tab.

- [ ] Expected: The **Override** tab's icon swaps from the outline star
  (`star`) to the filled star (`star.fill`) - this confirms
  `selectedIcon` is rendered only in the selected state. The previously
  selected **Template** tab swaps from the filled template image
  (icon_fill.png) back to the outline template image (icon.png).

---

### `tabBarItemIconColor` overrides `tabBarTintColor`

3. With **Override** still selected, observe the selected icon color.

- [ ] Expected: The filled star is **red** (RedLight100), NOT green.
  This confirms that
  `standardAppearance.stacked.selected.tabBarItemIconColor` overrides
  the host-level `tabBarTintColor`.

4. Tap the **Template** tab, then tap **Override** again.

- [ ] Expected: On re-selection the red filled star reappears
  immediately with no visual glitch. The **Template** tab once again
  shows the green outline template image (iOS 18-) / system-theme
  outline template image (iOS 26+).

---

### `imageSource` icons are non-tintable

5. Tap the **Tint** tab.

- [ ] Expected: The icon swaps from the outline image (icon.png) to
  the filled image (icon_fill.png). Both renders use the original PNG
  colors - the host `tabBarTintColor` (green) and the per-tab
  `normal.tabBarItemIconColor` (blue) have NO effect on either state.
  This confirms `imageSource` icons are not tintable. The same PNG
  files used as `templateSource` on the **Template** tab DO get tinted,
  proving the difference is the icon type, not the asset.

---

### Stability check

6. Cycle through all three tabs in order (Template -> Override -> Tint),
   then in reverse.

- [ ] Expected: Each tab swaps between its `icon` and `selectedIcon`
  consistently on selection, the correct tint behavior is applied each
  time (green host tint for Template, red override for Override's
  selected state, no tint for Tint), and no crash, layout freeze, or
  visual artifact occurs during rapid cycling.
