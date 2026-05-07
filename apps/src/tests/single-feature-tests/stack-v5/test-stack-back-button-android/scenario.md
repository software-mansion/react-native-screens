# Test Scenario: Stack Back Button

## Details

**Description:** This test focuses on back button in the header on Android. Back button should be visible on screens that are not a root screen of the stack, unless it's explicitly disabled. Back button allows customization via custom icon and tint color. Focus on changing props in runtime and ensure consistent behavior.

**OS test creation version:** API 36

## E2E test

Other - the automation is planned (in limited scope) but not implemented yet.

## Prerequisites

- Android emulator

## Note (Optional)

Interaction with prevent native dismiss mechanism is tested in separate tests (`prevent-native-dismiss-single-stack` and `prevent-native-dismiss-nested-stack`).

Applying tint color to non-transparent image results in the entire image being covered in tint color.

When support for color scheme is added, we should check if default back arrow adapts to color scheme change.

## Steps

### Baseline

1. Launch the app and navigate to the **Stack Back Button** screen.

- [ ] Expected: Root screen is shown. No back button is visible in the header (root screen has no predecessor).

2. Tap **Push screen**.

- [ ] Expected: Pushed screen is shown. A default back button (default arrow icon, default tint) is visible in the header.

---

### Icon: `default`

3. Set tintColor = `purple`.

- [ ] Expected: Back arrow changes to purple immediately.

4. Set tintColor = `default`.

- [ ] Expected: Back arrow returns to default tint.

5. Toggle backButtonHidden = `true`.

- [ ] Expected: Back button disappears from the header.

6. Toggle backButtonHidden = `false`.

- [ ] Expected: Back button reappears with default icon and default tint.

---

### Icon: `imageSource` and changes when hidden

7. Set icon = `imageSource`.

- [ ] Expected: Back button changes to the custom image — white background with a black arrow, no tint applied.

8. Set tintColor = `red`.

- [ ] Expected: The entire image is covered in red (non-transparent image is fully tinted).

9. Set tintColor = `default`.

- [ ] Expected: Custom image returns to its original appearance (white background, black arrow).

10. Toggle backButtonHidden = `true`.

- [ ] Expected: Back button disappears.

11. Set tintColor = `green`.

- [ ] Expected: No visible change (back button is hidden).

12. Toggle backButtonHidden = `false`.

- [ ] Expected: Back button reappears with `imageSource` icon and green tint already applied.

---

### Icon: `drawableResource`

13. Set tintColor = `default`, set icon = `drawableResource`.

- [ ] Expected: Back button changes to `sym_call_missed` drawable — white and red (its native colors).

14. Set tintColor = `purple`.

- [ ] Expected: Drawable icon changes to purple.

15. Set tintColor = `default`.

- [ ] Expected: Drawable icon returns to its native white and red appearance.

16. Toggle backButtonHidden = `true`.

- [ ] Expected: Back button disappears.

17. Toggle backButtonHidden = `false`.

- [ ] Expected: Back button reappears with `drawableResource` icon and default tint.

---

### Config applied before push

18. Go back to the root screen. Set icon = `imageSource`, tintColor = `purple`.

- [ ] Expected: Root screen is shown. No back button visible (root screen).

19. Tap **Push screen**.

- [ ] Expected: Pushed screen appears with the `imageSource` icon and purple tint already applied.
