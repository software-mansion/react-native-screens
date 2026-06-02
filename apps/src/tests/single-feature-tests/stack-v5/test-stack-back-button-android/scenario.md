# Test Scenario: Stack Back Button

## Details

**Description:** This test focuses on back button in the header on Android.
Back button should be visible on screens that are not a root screen of the
stack, unless it's explicitly disabled. Back button allows customization via
custom icon and tint color (normal, pressed, and focused states). Focus on
changing props in runtime and ensure consistent behavior.

**OS test creation version:** API 36

## E2E test

TBD: Automation is planned in limited scope but not yet implemented.

## Prerequisites

- Android emulator
- To test `backButtonTintColorFocused`: enable **Hardware Input** in the
  emulator settings, then use arrow keys to enable keyboard focus and press
  **Ctrl+Tab** to move keyboard focus into the header toolbar.

## Note (Optional)

Interaction with prevent native dismiss mechanism is tested in separate tests
(`prevent-native-dismiss-single-stack` and
`prevent-native-dismiss-nested-stack`).

Applying tint color to non-transparent image results in the entire image being
covered in tint color.

**Native platform limitation:** if `backButtonTintColorNormal` is left at its
default (undefined) but `backButtonTintColorPressed` or
`backButtonTintColorFocused` is explicitly set, the icon becomes invisible in
the normal state. This is Android platform behavior, not a library bug. Always
set `backButtonTintColorNormal` alongside other state tints if you want the
icon visible in the normal state.

When support for color scheme is added, we should check if default back arrow
adapts to color scheme change.

## Steps

### Baseline

1. Launch the app and navigate to the **Stack Back Button** screen.

- [ ] Root screen is shown. No back button is visible in the header
      (root screen has no predecessor).

2. Tap **Push screen**.

- [ ] Pushed screen is shown. A default back button (default arrow
      icon, default tint) is visible in the header.

---

### Icon: `default`

3. Set tintColorNormal = `purple`.

- [ ] Back arrow changes to purple immediately.

4. Set tintColorNormal = `default`.

- [ ] Back arrow returns to default tint.

5. Set tintColorPressed = `red`.

- [ ] Back arrow appears transparent (native limitation) but turns red when
      held down.

6. Set tintColorNormal = `purple`.

- [ ] Back arrow changes to purple immediately. When pressed, it turns red.

7. Set tintColorFocused = `green`.

- [ ] Enable keyboard navigation using arrow keys. Use Ctrl+Tab to move keyboard
      focus to the toolbar and focus the back button — it turns green while
      focused.

8. Set tintColorPressed = `default`, set tintColorFocused = `default`.

- [ ] Pressed and focused states return to the normal purple tint.

9. Toggle backButtonHidden = `true`.

- [ ] Back button disappears from the header.

10. Toggle backButtonHidden = `false`.

- [ ] Back button reappears with default icon and purple tint.

---

### Icon: `imageSource` and changes when hidden

11. Set tintColorNormal = `default` and icon = `imageSource`.

- [ ] Back button changes to the custom image — white background
      with a black arrow, no tint applied.
- [ ] The custom image is scaled to approximately 24 dp height,
      visually similar in size to the default back arrow.

12. Set tintColorNormal = `red`.

- [ ] The entire image is covered in red (non-transparent image is
      fully tinted).

13. Set tintColorNormal = `default`.

- [ ] Custom image returns to its original appearance (white
      background, black arrow).

14. Toggle backButtonHidden = `true`.

- [ ] Back button disappears.

15. Set tintColorNormal = `green`.

- [ ] No visible change (back button is hidden).

16. Toggle backButtonHidden = `false`.

- [ ] Back button reappears with `imageSource` icon and green tint
      already applied.

---

### Icon: `drawableResource`

17. Set tintColorNormal = `default`, set icon = `drawableResource`.

- [ ] Back button changes to `sym_call_missed` drawable — white
      and red (its native colors).
- [ ] The drawable icon is scaled to approximately 24 dp height.

18. Set tintColorNormal = `purple`.

- [ ] Drawable icon changes to purple.

19. Set tintColorNormal = `default`.

- [ ] Drawable icon returns to its native white and red appearance.

20. Toggle backButtonHidden = `true`.

- [ ] Back button disappears.

21. Toggle backButtonHidden = `false`.

- [ ] Back button reappears with `drawableResource` icon and
      default tint.

---

### Config applied before push

22. Go back to the root screen. Set icon = `imageSource`,
    tintColorNormal = `purple`.

- [ ] Root screen is shown. No back button visible (root screen).

23. Tap **Push screen**.

- [ ] Pushed screen appears with the `imageSource` icon and purple
      tint already applied.
