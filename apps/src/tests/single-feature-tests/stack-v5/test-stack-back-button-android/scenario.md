# Test Scenario: Stack Back Button (Android)

## Details

**Description:** This test focuses on back button in the header on Android.
Back button should be visible on screens that are not a root screen of the
stack, unless it's explicitly disabled. Back button allows customization via
custom icon and tint color (normal, pressed, and focused states). Focus on
changing props in runtime and ensure consistent behavior.

**OS test creation version:** API 36

## E2E test

Incomplete.

- All steps of **Baseline**, steps 7-8 of **Icon: `default`** and all steps of
  **Config applied before push**, asserting only that the back button is absent
  or present.
- Step 1 of **Config applied before push** is reached by reloading the screen
  rather than navigating back.

**Manual only (not automated):**

- Steps 1-6 of **Icon: `default`**, steps 1-3 of **Icon: `imageSource` and
  changes when hidden** and steps 1-3 of **Icon: `drawableResource`**: tint
  colors and icon identity.
- Steps 4-6 of **Icon: `imageSource` and changes when hidden** and steps 4-5 of
  **Icon: `drawableResource`**: the `backButtonHidden` toggle already covered
  by steps 7-8 of **Icon: `default`** for default button settings.

## Prerequisites

- Android emulator
- To test `backButtonTintColorFocused`: enable **Hardware Input** in the
  emulator settings, then use arrow keys to enable keyboard focus and press
  **Ctrl+Tab** to move keyboard focus into the header toolbar.
- To use the back button (step 1 of **Config applied before push**), run the
  screen **directly** by editing
  [apps/App.tsx](../../../../../App.tsx): import and render
  `TestStackBackButtonAndroid` as the root component instead of `Example`, e.g.:

  ```tsx
  import { TestStackBackButtonAndroid as Example } from './src/tests/single-feature-tests';
  ```

  With the v5 `StackContainer` at the root, the header back button pops the
  stack. Opened through the in-app menu it does not, because the surrounding
  react-navigation stack consumes the back press (issue [#1459](https://github.com/software-mansion/react-native-screens-labs/issues/1459)).

## Note

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

1. Set tintColorNormal = `purple`.

    - [ ] Back arrow changes to purple immediately.

2. Set tintColorNormal = `default`.

    - [ ] Back arrow returns to default tint.

3. Set tintColorPressed = `red`.

    - [ ] Back arrow appears transparent (native limitation) but turns red when
          held down.

4. Set tintColorNormal = `purple`.

    - [ ] Back arrow changes to purple immediately. When pressed, it turns red.

5. Set tintColorFocused = `green`.

    - [ ] Enable keyboard navigation using arrow keys. Use Ctrl+Tab to move keyboard
          focus to the toolbar and focus the back button — it turns green while
          focused.

6. Set tintColorPressed = `default`, set tintColorFocused = `default`.

    - [ ] Pressed and focused states return to the normal purple tint.

7. Toggle backButtonHidden = `true`.

    - [ ] Back button disappears from the header.

8. Toggle backButtonHidden = `false`.

    - [ ] Back button reappears with default icon and purple tint.

---

### Icon: `imageSource` and changes when hidden

1. Set tintColorNormal = `default` and icon = `imageSource`.

    - [ ] Back button changes to the custom image — white background
          with a black arrow, no tint applied.
    - [ ] The custom image is scaled to approximately 24 dp height,
          visually similar in size to the default back arrow.

2. Set tintColorNormal = `red`.

    - [ ] The entire image is covered in red (non-transparent image is
          fully tinted).

3. Set tintColorNormal = `default`.

    - [ ] Custom image returns to its original appearance (white
          background, black arrow).

4. Toggle backButtonHidden = `true`.

    - [ ] Back button disappears.

5. Set tintColorNormal = `green`.

    - [ ] No visible change (back button is hidden).

6. Toggle backButtonHidden = `false`.

    - [ ] Back button reappears with `imageSource` icon and green tint
          already applied.

---

### Icon: `drawableResource`

1. Set tintColorNormal = `default`, set icon = `drawableResource`.

    - [ ] Back button changes to `sym_call_missed` drawable — white
          and red (its native colors).
    - [ ] The drawable icon is scaled to approximately 24 dp height.

2. Set tintColorNormal = `purple`.

    - [ ] Drawable icon changes to purple.

3. Set tintColorNormal = `default`.

    - [ ] Drawable icon returns to its native white and red appearance.

4. Toggle backButtonHidden = `true`.

    - [ ] Back button disappears.

5. Toggle backButtonHidden = `false`.

    - [ ] Back button reappears with `drawableResource` icon and
          default tint.

---

### Config applied before push

1. Go back to the root screen. Set icon = `imageSource`,
    tintColorNormal = `purple`.

    - [ ] Root screen is shown. No back button visible (root screen).

2. Tap **Push screen**.

    - [ ] Pushed screen appears with the `imageSource` icon and purple
          tint already applied.
