# Test Scenario: colorScheme

## Details

**Description:** Verifies the `colorScheme` prop behavior on `StackHost` and `headerConfig`, ensuring the stack correctly inherits or overrides the system and React Native appearance settings. The test validates real-time UI updates across light, dark, and inherited modes on both iOS and Android, including the Android-specific header override capability.

**OS test creation version:** Android: API Level 37.

<!-- TODO: add iOS versions-->

## E2E test

Incomplete: Not automated. Detox does not have access to color attributes natively, making it impossible to reliably verify if the native header color has changed in response to a style update.

## Prerequisites

<!--- iOS device/simulator (use Cmd+Shift+A to toggle appearance on simulator)-->

- Android emulator (use CLI):
  - `adb shell "cmd uimode night yes"`
  - `adb shell "cmd uimode night no"`

## Note

- Color Scheme isn't currently supported on iOS.
- Each of the below steps must be executed twice: once with a system color scheme setting, and once with the color scheme forced via the React Native API.
- For React Native settings, use the toggle displayed on the test screen.

Assumption:

- System and RN color scheme settings are working correctly.
- Here only the `colorScheme` props on `StackHost` and `headerConfig` are tested, verified against different system/RN combinations.

## Steps

### Baseline

1. Launch the app and navigate to the **Stack Color Scheme** screen.

- [ ] Config screen is shown. Pickers default to `auto` / `inherit`.

---

### StackHost `inherit` — follows RN/system

2. Set system/RN to **light**, StackHost colorScheme = `inherit`

- [ ] Header background appears in **light** mode styling.

3. Set system/RN to **dark**, keep StackHost colorScheme = `inherit`

- [ ] Header appears in **dark** mode styling — StackHost defers to RN/system.

---

### StackHost `light` / `dark` — overrides RN/system

4. Set system/RN to **dark**, set StackHost colorScheme = `light`

- [ ] Header appears **light** — StackHost overrides dark from RN/system.

5. Set system/RN to **light**, set StackHost colorScheme = `dark`

- [ ] Header appears **dark** — StackHost overrides light from RN/system.

6. Cycle StackHost through `inherit` → `dark` → `light` → `inherit`

- [ ] Stack header color scheme updates immediately with each change, with no crashes or layout freezing.

---

### HeaderConfig override (Android only)

7. Set system/RN to **light** and StackHost to **light**.
8. Set the Header config override to **dark**.

- [ ] The stack header appears **dark**, overriding the StackHost and RN/system settings.

9. Set StackHost to **dark**, and Header config override to **light**.

- [ ] The stack header appears **light**.

10. Set the Header config override back to **inherit**.

- [ ] The stack header reverts to matching the StackHost setting (**dark**).

---

### Keyboard screen — simple check

11. Tap **Push Keyboard Screen**, open the keyboard via the TextInput (or Cmd+K on iOS simulator)

- [ ] iOS: Keyboard appearance matches the currently active color scheme (verify for both light and dark RN/System values).
- [ ] Android: Keyboard appearance matches the system color scheme.
