# Test Scenario: Stack Back Button

## Details

**Description:** This test focuses on back button in the header on Android.
Back button should be visible on screens that are not a root screen of the
stack, unless it's explicitly disabled. Back button allows customization via
custom icon and tint color (normal, pressed, and focused states). Focus on
changing props in runtime and ensure consistent behavior.

**OS test creation version:** API 36

## E2E test

TB: Automation is planned in limited scope but not yet implemented.

## Prerequisites

- Android emulator

## Note (Optional)

Interaction with prevent native dismiss mechanism is tested in separate tests
(`prevent-native-dismiss-single-stack` and
`prevent-native-dismiss-nested-stack`).

Applying tint color to non-transparent image results in the entire image being
covered in tint color.

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

7. Set tintColorPressed = `default`.

- [ ] When pressed, back arrow turns purple.

8. Toggle backButtonHidden = `true`.

- [ ] Back button disappears from the header.

9. Toggle backButtonHidden = `false`.

- [ ] Back button reappears with default icon and purple tint.

---

### Icon: `imageSource` and changes when hidden

10. Set tintColorNormal = `default` and icon = `imageSource`.

- [ ] Back button changes to the custom image — white background
      with a black arrow, no tint applied.
- [ ] The custom image is scaled to approximately 24 dp height,
      visually similar in size to the default back arrow.

11. Set tintColorNormal = `red`.

- [ ] The entire image is covered in red (non-transparent image is
      fully tinted).

12. Set tintColorNormal = `default`.

- [ ] Custom image returns to its original appearance (white
      background, black arrow).

13. Toggle backButtonHidden = `true`.

- [ ] Back button disappears.

14. Set tintColorNormal = `green`.

- [ ] No visible change (back button is hidden).

15. Toggle backButtonHidden = `false`.

- [ ] Back button reappears with `imageSource` icon and green tint
      already applied.

---

### Icon: `drawableResource`

16. Set tintColorNormal = `default`, set icon = `drawableResource`.

- [ ] Back button changes to `sym_call_missed` drawable — white
      and red (its native colors).
- [ ] The drawable icon is scaled to approximately 24 dp height.

17. Set tintColorNormal = `purple`.

- [ ] Drawable icon changes to purple.

18. Set tintColorNormal = `default`.

- [ ] Drawable icon returns to its native white and red appearance.

19. Toggle backButtonHidden = `true`.

- [ ] Back button disappears.

20. Toggle backButtonHidden = `false`.

- [ ] Back button reappears with `drawableResource` icon and
      default tint.

---

### Config applied before push

21. Go back to the root screen. Set icon = `imageSource`,
  tintColorNormal = `purple`.

- [ ] Root screen is shown. No back button visible (root screen).

22. Tap **Push screen**.

- [ ] Pushed screen appears with the `imageSource` icon and purple
      tint already applied.
