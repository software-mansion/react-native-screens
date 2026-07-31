# Test Scenario: Stack Overflow Icon

## Details

**Description:** This test focuses on the overflow menu button (the three-dots
button that opens the toolbar menu's overflow popup) in the header on Android.
The overflow button is visible whenever the toolbar menu has items that fall into
the overflow popup. It allows customization via a custom icon and tint color
(normal, pressed, and focused states).

**OS test creation version:** API 36

## E2E test

TBD: Automation is planned in limited scope but not yet implemented.

## Prerequisites

- Android emulator
- To test `overflowIconTintColorFocused`: enable **Hardware Input** in the
  emulator settings, then use arrow keys to enable keyboard focus and press
  **Ctrl+Tab** to move keyboard focus into the header toolbar.

## Note

All menu items use `showAsAction: 'never'`, so they always land in the overflow
popup and the overflow (three-dots) button stays visible while `showMenuItems`
is on.

Applying tint color to a non-transparent image results in the entire image being
covered in the tint color.

**Native platform limitation:** if `overflowIconTintColorNormal` is left at its
default (undefined) but `overflowIconTintColorPressed` or
`overflowIconTintColorFocused` is explicitly set, the icon becomes invisible in
the normal state. This is Android platform behavior, not a library bug. Always
set `overflowIconTintColorNormal` alongside other state tints if you want the
icon visible in the normal state.

## Steps

### Baseline

1. Launch the app and navigate to the **Stack Overflow Icon** screen.

- [ ] The header shows the default Material 3 overflow (three-dots) button on
      the trailing side.

2. Tap the overflow button.

- [ ] A popup opens listing `First`, `Second`, `Third`.

---

### Icon: `default`

3. Set tintColorNormal = `purple`.

- [ ] The three-dots icon changes to purple immediately.

4. Set tintColorNormal = `default`.

- [ ] The three-dots icon returns to its default tint.

5. Set tintColorPressed = `red`.

- [ ] The icon appears transparent (native limitation) but turns red when held
      down.

6. Set tintColorNormal = `purple`.

- [ ] The icon changes to purple immediately. When pressed, it turns red.

7. Set tintColorFocused = `green`.

- [ ] Enable keyboard navigation using arrow keys. Use Ctrl+Tab to move keyboard
      focus to the toolbar and focus the overflow button — it turns green while
      focused.

8. Set tintColorPressed = `default`, set tintColorFocused = `default`.

- [ ] Pressed and focused states return to the normal purple tint.

---

### Icon: `imageSource`

9. Set tintColorNormal = `default` and icon = `imageSource`.

- [ ] The overflow button changes to the custom image (a black search glyph),
      no tint applied.
- [ ] The custom image is scaled to approximately 24 dp height, visually similar
      in size to the default overflow icon.

10. Set tintColorNormal = `red`.

- [ ] The entire image is covered in red (non-transparent image is fully
      tinted).

11. Set tintColorNormal = `default`.

- [ ] The custom image returns to its original appearance.

---

### Icon: `drawableResource`

12. Set icon = `drawableResource`.

- [ ] The overflow button changes to the `sym_call_missed` drawable (its native
      colors).
- [ ] The drawable icon is scaled to approximately 24 dp height.

13. Set tintColorNormal = `purple`.

- [ ] The drawable icon changes to purple.

14. Set tintColorNormal = `default`.

- [ ] The drawable icon returns to its native appearance.

---

### Restore to default

15. Set icon = `default`.

- [ ] The overflow button returns to the Material 3 default three-dots icon
      (NOT a blank/empty button).

---

### Custom icon survives menu changes

16. Set icon = `imageSource`, tintColorNormal = `purple`.

- [ ] The overflow button shows the custom image with purple tint.

17. Toggle showMenuItems = `false`.

- [ ] The overflow button disappears (no menu items to overflow).

18. Toggle showMenuItems = `true`.

- [ ] The overflow button reappears still showing the custom `imageSource` icon
      with tint (the custom icon and its tint are not lost when the overflow
      button is removed and re-added).
