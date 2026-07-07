# Test Scenario: Split Color Scheme - iOS

## Details

**Description:** Verifies the `colorScheme` prop behavior on `Split.Host`, ensuring the split view layout correctly inherits or overrides the system and React Native appearance settings. The test validates real-time UI updates across light, dark, and inherited modes on iOS to ensure visual consistency of native subviews.

**OS test creation version:** iOS 18.6 and 26.3

## E2E test

No: Detox does not have access to native color attributes of experimental components, making it impossible to verify if the native split view color has changed in response to a style update.

## Prerequisites

- iOS simulator (use `Cmd+Shift+A` to toggle appearance on simulator)

## Note

- The `Split` component is currently supported only on iOS.
- Each of the below steps must be executed twice: once with a system color scheme setting (`Cmd+Shift+A`), and once with the color scheme forced via the React Native API.
- For React Native settings, use the `React Native's color scheme` picker displayed in the left column.

### Known Issues / Observations

- `SettingsPicker` does not update its appearance on `SplitHost` `colorScheme` updates because `ThemeProvider` is not used in this test. This is intentional due to `ThemeProvider` not handling `theme='undefined'` properly, which is necessary for the `inherit` case. Rely on the `TextInput` and overall background to verify the applied color scheme.

Assumption:

- System and RN color scheme settings are working correctly.
- Here only the `colorScheme` prop on `SplitHost` is tested, verified against different system/RN combinations.

## Steps

### Baseline

1. Launch the app with the **Split Color Scheme** scenario injected as the root.

- [ ] Pickers default to `unspecified` for RN and `inherit` for SplitHost.

---

### SplitHost `inherit` — follows RN/system

2. Set system/RN to **light**, SplitHost colorScheme = `inherit`

- [ ] The split view and its background appear **light**

3. Set system/RN to **dark**, keep SplitHost colorScheme = `inherit`

- [ ] The split view appears **dark** — SplitHost defers to RN/system

---

### SplitHost `light` — overrides RN/system

4. Set system/RN to **dark**, set SplitHost colorScheme = `light`

- [ ] The split view appears **light** — SplitHost overrides dark from RN/system

5. Set system/RN to **light**, keep SplitHost colorScheme = `light`

- [ ] The split view stays **light**

6. Cycle through `inherit` → `dark` → `light` → `dark` → `inherit`

- [ ] Split view color scheme updates immediately with each change, no crash or layout freeze

---

### SplitHost `dark` — overrides RN/system

7. Set system/RN to **light**, set SplitHost colorScheme = `dark`

- [ ] The split view appears **dark** — SplitHost overrides light from RN/system

8. Set system/RN to **dark**, keep SplitHost colorScheme = `dark`

- [ ] The split view stays **dark**

9. Cycle through `inherit` → `light` → `dark` → `light` → `inherit`

- [ ] Split view color scheme updates immediately with each change, no crash or layout freeze

---

### Keyboard — native subview check

10. Switch focus to the `TextInput` in the right column, open the keyboard (or `Cmd+K` on iOS simulator)

- [ ] Keyboard appearance matches the currently active, resolved color scheme of the `SplitHost` (e.g., if SplitHost forces `dark` while the system is `light`, the keyboard must be dark). Verify for both light and dark values.
