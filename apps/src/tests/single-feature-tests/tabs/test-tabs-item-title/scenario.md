# Test Scenario: Tab Bar Item Title

## Details

Validates the tab bar item title configuration across both platforms, verifying
the core options.title rendering alongside long-string truncation. It checks
`tabBarItemTitleFontColor` behavior across multiple states, including its override
of the host-level `tabBarTintColor` on iOS, the standard selected and normal states
on both platforms, and the keyboard-focused state specific to Android. Typography
and layout adjustments are verified according to platform-specific structures:
on iOS, it tests `tabBarItemTitleFontFamily`, `tabBarItemTitleFontSize`, `tabBarItemTitleFontStyle`,
`tabBarItemTitleFontWeight`, and vertical offsets via `tabBarItemTitlePositionAdjustment`
nested under `standardAppearance.stacked`; on Android, it verifies the shared font
family, weight, and style props alongside Android-specific dynamic sizing via
`tabBarItemTitleSmallLabelFontSize` and `tabBarItemTitleLargeLabelFontSize` configured
directly under the `standardAppearance` object

**OS test creation version:** iOS 18.6 and iOS 26.5, Android: API Level 36.

## E2E test

Incomplete: Not automated. All observable outcomes are purely visual (color, typography, pixel
position of a label). Detox does not expose color or font attributes of
native tab bar items, so automated assertion is not feasible.

## Prerequisites

- iOS device or simulator running iOS 18 or later.
- The iPhone in portrait orientation is the primary verification surface (stacked layout).
- Android emulator.

## Note

iOS Known Issues:
- **Normal (unselected) state ([iOS26 KI](https://github.com/software-mansion/react-native-screens-labs/discussions/395)):**
  On iOS 18 and lower, the normal tab title color is applied to unselected tab
  titles. On iOS 26, the normal-state title color is not applied.
- **Long-title truncation ([iOS 18 KI](https://github.com/software-mansion/react-native-screens-labs/issues/1485)):** On iOS 18 and lower, a
  native bug prevents truncation; the long title may overflow into
  adjacent items instead of showing an ellipsis.

## Steps

### `title` prop and long-string truncation

1. Launch the app and navigate to the **Tab Bar Item Title** screen.

- [ ] Three tabs are visible in the tab bar.
- [ ] The first tab is selected by default. Its title is truncated with an
  ellipsis (e.g. "A Very Long Tab Title T...") and does not overflow
  into adjacent items or wrap to a second line. **On iOS 18 and lower**,
  due to the known native bug noted above, the long title may overflow
  into adjacent items instead of showing an ellipsis.
- [ ] The second tab is titled **Color** and the third **Font**. All labels use
  the system default font, weight, and position.
- [ ] On iOS the active tab title color is the host default tint (green).

---

### `tabBarItemTitleFontColor` in different states

2. Tap the **Color** tab.

- [ ] The **Color** tab is selected. The tab's `tabBarItemTitleFontColor` is red,
  so the title text "Color" renders in red.
- [ ] For **Android and iOS 18** and lower, the title color for unselected tabs is blue.
- [ ] On iOS: The host `tabBarTintColor` is green, so the selected icon tints green.

3. Android only: While **Color** tab is selected, use the Tab key on keyboard to
switch focus to the long title tab.

- [ ] Focused tab title is yellow while selected tab title
remains red, and unselected tabs remain blue.

4. Tap the long title tab, then tap **Color** again.

- [ ] On re-selection the same split appearance (red title for selected tab,
blue title for unselected tabs, on iOS: green icon)
is reproduced immediately with no visual glitch.

---

### Font and Position

5. Tap the **Font** tab.

- [ ] When the tab is selected, the "Font" title label is
rendered in a bold, italic font at approximately 18 pt.
- [ ] On Android: monospace font family applied. Unselected tabs display in small
italic font at approximately 8 pt.
- [ ] On iOS: Georgia font tinted green. Unselected tabs display in system default
(San Francisco, non-italic, 10 pt). The title label is shifted noticeably upward
(by ~6 points) compared to the baseline position seen on the **Color** tab, while
the icon position remains unchanged.

6. Tap any other tab, then tap **Font** again.

- [ ] The custom typography and position reappear when the tab is
re-selected.
- [ ] On iOS: The vertical offset is consistent across selections.

---

### Stability check

7. Cycle through all three tabs in order, then in reverse.

- [ ] Each tab's title styling applies correctly on selection, and
  no crash, layout freeze, or visual artifact occurs during rapid cycling.
