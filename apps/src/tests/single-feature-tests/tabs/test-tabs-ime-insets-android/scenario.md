# Test Scenario: Tabs IME insets

## Details

**Description:** Verify the behavior of the tabBarRespectsIMEInsets property on
Android and its interaction with screen content safe areas. This scenario ensures
that toggling tabBarRespectsIMEInsets successfully shifts the tab bar above the
soft keyboard (IME) when focused, and validates how modifying the screen's bottom
safe area edge configuration (safeAreaViewBottomEdgeEnabled) dynamically adapts
the layout content relative to the tab bar to prevent keyboard overlapping.

**OS test creation version:** Android: API Level 36.

## E2E test

Full: All manual steps are covered by an E2E test based on changes to the tab bar
and text frame Y-positions,as well as their positions relative to the open keyboard.

## Prerequisites

- Android emulator

## Note

- Ensure the soft keyboard pops up fully when focusing text inputs to correctly evaluate window inset recalculations.

## Steps

### Baseline

1. Launch the app and navigate to the **IME insets** screen.

- [ ] The Config tab is active.
- [ ] The "safeAreaViewBottomEdgeEnabled" switch is enabled (true), and the "tabBarRespectsIMEInsets" switch is disabled (false).
- [ ] The text "TabsScreen bottom" is clearly visible at the very bottom of the screen layout, above the tab bar.

---

### tabBarRespectsIMEInsets: false and safeAreaViewBottomEdgeEnabled: true

2. Tap inside the TextInput box.

- [ ] The soft keyboard (IME) slides up.
- [ ] The tab bar stays anchored at the bottom of the window frame and is hidden behind the keyboard. 
- [ ] The layout text "TabsScreen bottom" at the end of the container is covered by the keyboard.

3. Dismiss the keyboard.

---

### tabBarRespectsIMEInsets: true and safeAreaViewBottomEdgeEnabled: true

4. Tap the tabBarRespectsIMEInsets switch to toggle it to true.

5. Tap inside the TextInput box again.

- [ ] As the keyboard slides up, the native tab bar dynamically shifts upwards
alongside the keyboard, remaining fully visible on top of it.
- [ ] The inner content view resizes seamlessly, pushing the "TabsScreen bottom" text
up so it remains visible right above the elevated tab bar without any visual glitches.

6. Dismiss the keyboard.

---

### tabBarRespectsIMEInsets: true and safeAreaViewBottomEdgeEnabled: false

7. Tap the safeAreaViewBottomEdgeEnabled switch to toggle it to false.

- [ ] The bottom edge safe area configuration updates dynamically.
- [ ] The inner view content pushes downwards under the tab bar, causing the "TabsScreen bottom" text
to hide behind the tab bar layout layer.

8. Tap inside the TextInput box again.

- [ ] The tab bar rises above the soft keyboard, but the inner content text "TabsScreen bottom"
remains tucked behind the tab bar layer.

9. Dismiss the keyboard.

---

### tabBarRespectsIMEInsets: false and safeAreaViewBottomEdgeEnabled: false

10. Tap the tabBarRespectsIMEInsets switch to toggle it to false.

11. Tap inside the TextInput box again.

- [ ] The soft keyboard (IME) slides up.
- [ ] The tab bar stays anchored at the bottom of the window frame and is hidden behind the keyboard. 
- [ ] The layout text "TabsScreen bottom" at the end of the container is covered by the keyboard.
