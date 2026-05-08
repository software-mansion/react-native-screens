# Test Scenario: Tab Bar Item Title (iOS)

## Details

**Description:** Validates every iOS tab bar item title prop: the
`options.title` label, `tabBarItemTitleFontColor` (including its override
of the host-level `tabBarTintColor`), `tabBarItemTitleFontFamily`,
`tabBarItemTitleFontSize`, `tabBarItemTitleFontStyle`,
`tabBarItemTitleFontWeight`, and `tabBarItemTitlePositionAdjustment`.
All appearance props are set under
`standardAppearance.{stacked|inline|compactInline}.selected` so they
apply in every orientation.

**OS test creation version:** iOS 18.6 and iOS 26

## E2E test

No: All observable outcomes are purely visual (color, typography, pixel
position of a label). Detox does not expose color or font attributes of
native tab bar items, so automated assertion is not feasible.

## Prerequisites

- iOS device or simulator running iOS 18 or later.
- iPhone portrait orientation is the primary verification surface (stacked
  layout). Landscape on a wide-screen iPhone (e.g. 16 Pro Max) exercises
  the inline layout; compact-inline applies to narrower landscape iPhones.

## Steps

### Baseline — `title` prop

1. Launch the app and navigate to the **Tab Bar Item Title** screen.

- [ ] Expected: Five tabs are visible in the tab bar: **Default**, **Color**,
  **Font**, **Position**, and a truncated long-label tab. The **Default**
  tab is selected. The tab bar item label reads "Default" in the system
  default font, weight, color, and position.

---

### `tabBarItemTitleFontColor` overrides `tabBarTintColor`

2. Tap the **Color** tab.

- [ ] Expected: The **Color** tab becomes selected. The host `tabBarTintColor`
  is GreenDark100 (`#3fc684`), so the selected icon tints green. The tab's
  `tabBarItemTitleFontColor` is RedLight100 (`#ff6259`), so the title text
  "Color" renders in red — not green. This confirms that
  `tabBarItemTitleFontColor` overrides `tabBarTintColor` for the label
  while the icon still uses the tint color.

3. Tap the **Default** tab, then tap **Color** again.

- [ ] Expected: On re-selection the same split appearance (red title, green
  icon) is reproduced immediately with no visual glitch.

---

### `tabBarItemTitleFontFamily`, `tabBarItemTitleFontSize`,
### `tabBarItemTitleFontStyle`, `tabBarItemTitleFontWeight`

4. Tap the **Font** tab.

- [ ] Expected: The title label "Font" in the tab bar is rendered in bold
  italic Georgia at approximately 16 pt when the tab is selected. The
  difference from the system default (San Francisco, non-italic, 10 pt) is
  clearly visible.

5. Tap any other tab, then tap **Font** again.

- [ ] Expected: The custom typography reappears on selection; the unselected
  state reverts to the system default appearance (no font override is
  applied to `normal` state).

---

### `tabBarItemTitlePositionAdjustment`

6. Tap the **Position** tab.

- [ ] Expected: The title label "Position" is rendered noticeably higher
  (shifted upward by ~6 points) compared to the baseline position on the
  **Default** tab. The icon position is unchanged.

7. Switch between the **Default** tab and the **Position** tab several times.

- [ ] Expected: The vertical offset on the **Position** tab is consistent on
  each selection; no layout jitter or clipping occurs.

---

### `title` — long string truncation

8. Tap the rightmost tab (the one with the long title).

- [ ] Expected: The tab bar item label is truncated with an ellipsis — the
  full string "A Very Long Tab Title That Should Truncate" is not fully
  displayed. The label does not overflow into adjacent items or wrap to a
  second line.

---

### Orientation — inline and compact-inline layouts

9. While the **Font** tab is selected, rotate the device to landscape
   orientation (or use a wide-screen iPhone/iPad).

- [ ] Expected: The layout switches to inline (icon beside title). The custom
  Georgia bold italic 16 pt font is still applied to the selected title,
  confirming that `inline.selected` is wired correctly.

10. If using a compact-width landscape device (e.g. iPhone 16 Pro in
    landscape), observe the compact-inline layout.

- [ ] Expected: Same custom font appears in the compact-inline layout.

---

### Stability check

11. Cycle through all five tabs in order, then in reverse.

- [ ] Expected: Each tab's title styling applies correctly on selection, and
  no crash, layout freeze, or visual artifact occurs during rapid cycling.
