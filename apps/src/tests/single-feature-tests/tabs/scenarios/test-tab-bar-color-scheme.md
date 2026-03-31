## colorScheme — Manual Test Scenarios

**File:** `test-tabs-color-scheme`
**Platform:** iOS + Android

### Prerequisites
- iOS device/simulator (use Cmd+Shift+A to toggle appearance on simulator)
- Android emulator (use CLI):
  - `adb shell "cmd uimode night yes"`
  - `adb shell "cmd uimode night no"`

Assumption: system and RN color scheme settings are working correctly. Here only the `colorScheme` prop on TabsHost is tested, verified against different system/RN combinations.

---

### Steps

**1. Baseline**

1. Launch the app and navigate to the scenario
   Expected: Config tab is shown. Pickers default to `unspecified` / `inherit`

---

**2. TabsHost `inherit` — follows RN/system**

2. Set system/RN to **light**, TabsHost colorScheme = `inherit`
   Expected: Tab bar appears **light**
3. Set system/RN to **dark**, keep TabsHost colorScheme = `inherit`
   Expected: Tab bar appears **dark** — TabsHost defers to RN/system

---

**3. TabsHost `light` — overrides RN/system**

4. Set system/RN to **dark**, set TabsHost colorScheme = `light`
   Expected: Tab bar appears **light** — TabsHost overrides dark from RN/system
5. Set system/RN to **light**, keep TabsHost colorScheme = `light`
   Expected: Tab bar stays **light**
6. Cycle through `inherit` → `dark` → `light` → `dark` → `inherit`
   Expected: Tab bar color scheme updates immediately with each change, no crash or layout freeze

---

**4. TabsHost `dark` — overrides RN/system**

7. Set system/RN to **light**, set TabsHost colorScheme = `dark`
   Expected: Tab bar appears **dark** — TabsHost overrides light from RN/system
8. Set system/RN to **dark**, keep TabsHost colorScheme = `dark`
   Expected: Tab bar stays **dark**
9. Cycle through `inherit` → `light` → `dark` → `light` → `inherit`

---

**5. Keyboard tab — smoke**

10. Switch to the **Keyboard** tab, open the keyboard via TextInput (or Cmd+K on iOS simulator)
   Expected: Keyboard appearance matches the currently active color scheme — verify for both light and dark values.