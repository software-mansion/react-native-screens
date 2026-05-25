# Test Scenario: Tab Bar Item Title (iOS)

## Details

**Description:** Validates iOS tab bar item title prop: the
`options.title` (plain label and long-string truncation), `tabBarItemTitleFontColor` (including its override
of the host-level `tabBarTintColor`), `tabBarItemTitleFontFamily`,
`tabBarItemTitleFontSize`, `tabBarItemTitleFontStyle`,
`tabBarItemTitleFontWeight`, and `tabBarItemTitlePositionAdjustment`.
Appearance props are set under `standardAppearance.stacked.selected`
and `standardAppearance.stacked.normal`.

**OS test creation version:** iOS 18.6 and iOS 26

## E2E test

No: All observable outcomes are purely visual (color, typography, pixel
position of a label). Detox does not expose color or font attributes of
native tab bar items, so automated assertion is not feasible.

## Prerequisites

- iOS device or simulator running iOS 18 or later.
- The iPhone in portrait orientation is the primary verification surface (stacked layout).

## Note

- **Normal (unselected) state ([iOS26 KI](https://github.com/software-mansion/react-native-screens-labs/discussions/395)):**
  On iOS 18 and lower, the normal tab title color is applied to unselected tab
  titles. On iOS 26, the normal-state title color is not applied.
- **Long-title truncation ([iOS 18 KI](https://github.com/software-mansion/react-native-screens-labs/issues/1485)):** On iOS 18 and lower, a
  native bug prevents truncation; the long title may overflow into
  adjacent items instead of showing an ellipsis.

## Steps

### `title` prop and long-string truncation

1. Launch the app and navigate to the **Tab Bar Item Title** screen.

- [ ] Expected: Three tabs are visible in the tab bar. The first tab
  is selected by default. On iOS 26, its title is truncated with an
  ellipsis (e.g. "A Very Long Tab Title T...") and does not overflow
  into adjacent items or wrap to a second line. On iOS 18 and lower,
  due to the known native bug noted above, the long title may overflow
  into adjacent items instead of showing an ellipsis. The second tab is
  titled **Color** and the third **Font and Position**. All labels use
  the system default font, weight, and position. The active tab title
  color is the system default tint - green.

---

### `tabBarItemTitleFontColor` overrides `tabBarTintColor`

2. Tap the **Color** tab.

- [ ] Expected: The **Color** tab is selected. The host `tabBarTintColor`
  is green, so the selected icon tints green. The tab's
  `tabBarItemTitleFontColor` is red, so the title text
  "Color" renders in red - not green.

3. Tap the long title tab, then tap **Color** again.

- [ ] Expected: On re-selection the same split appearance (red title, green icon)
is reproduced immediately with no visual glitch.

---

### Font and Position

4. Tap the **Font and Position** tab.

- [ ] Expected: When the tab is selected, the "Font and Position" title label is
rendered in a bold, italic Georgia font at approximately 12 pt tinted green.
The contrast with the system default (San Francisco, non-italic, 10 pt) is clearly
visible. The title label is shifted noticeably upward (by ~6 points) compared to
the baseline position seen on the **Color** tab, while the icon position remains
unchanged. For **iOS 18** and lower, the title color for unselected tabs is blue.

5. Tap any other tab, then tap **Font and Position** again.

- [ ] Expected: The custom typography and position reappear when the tab is
re-selected. The vertical offset is consistent across selections.
On iOS 26, the unselected state reverts to the system default appearance
(item title color is not blue).
 On iOS 18 and lower, unselected tab titles appear in blue.

---

### Stability check

6. Cycle through all three tabs in order, then in reverse.

- [ ] Expected: Each tab's title styling applies correctly on selection, and
  no crash, layout freeze, or visual artifact occurs during rapid cycling.
