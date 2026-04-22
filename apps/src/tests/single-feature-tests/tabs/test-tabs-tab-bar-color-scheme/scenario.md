# Test Scenario: colorScheme

## Details

**Description:** Verifies the colorScheme prop behavior on TabsHost, ensuring the tab bar correctly inherits or overrides the system and React Native appearance settings. The test validates real-time UI updates across light, dark, and inherited modes on both iOS and Android to ensure visual consistency and stability.

**OS test creation version:** iOS: 18.6 and 26.2, Android: 16.0

## E2E test

No: Detox does not have access to color attributes, so it is impossible to verify if the color has changed in response to a style update.

## Prerequisites

- iOS device/simulator (use Cmd+Shift+A to toggle appearance on simulator)
- Android emulator (use CLI):
  - `adb shell "cmd uimode night yes"`
  - `adb shell "cmd uimode night no"`

## Note

- Each of the below steps must be executed twice: once with a system color scheme setting, and once with the color scheme forced via the React Native API.
- For React Native settings, use the toggle displayed on the test screen.
  
Assumption:

- System and RN color scheme settings are working correctly.
- Here only the `colorScheme` prop on TabsHost is tested, verified against different system/RN combinations.

## Steps

### Baseline

1. Launch the app and navigate to the **Tab Bar Color Scheme** screen.
   
- [ ] Expected: Config tab is shown. Pickers default to `unspecified` / `inherit`

---

### TabsHost `inherit` — follows RN/system

2. Set system/RN to **light**, TabsHost colorScheme = `inherit`
   
- [ ] Expected: Tab bar appears **light**

3. Set system/RN to **dark**, keep TabsHost colorScheme = `inherit`
   
- [ ] Expected: Tab bar appears **dark** — TabsHost defers to RN/system

---

### TabsHost `light` — overrides RN/system

4. Set system/RN to **dark**, set TabsHost colorScheme = `light`
   
- [ ] Expected: Tab bar appears **light** — TabsHost overrides dark from RN/system

5. Set system/RN to **light**, keep TabsHost colorScheme = `light`
   
- [ ] Expected: Tab bar stays **light**

6. Cycle through `inherit` → `dark` → `light` → `dark` → `inherit`
   
- [ ] Expected: Tab bar color scheme updates immediately with each change, no crash or layout freeze

---

### TabsHost `dark` — overrides RN/system

7. Set system/RN to **light**, set TabsHost colorScheme = `dark`
   
- [ ] Expected: Tab bar appears **dark** — TabsHost overrides light from RN/system

8. Set system/RN to **dark**, keep TabsHost colorScheme = `dark`
   
- [ ] Expected: Tab bar stays **dark**

9. Cycle through `inherit` → `light` → `dark` → `light` → `inherit`

---

### Keyboard tab — simple check

10. Switch to the **Keyboard** tab, open the keyboard via TextInput (or Cmd+K on iOS simulator)
   
- [ ] Expected: Keyboard appearance matches the currently active color scheme — verify for both light and dark values.
