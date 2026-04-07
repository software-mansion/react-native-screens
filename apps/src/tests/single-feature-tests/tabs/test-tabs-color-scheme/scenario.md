## Test Scenario: colorScheme

**E2E test:** NO

### Prerequisites

- iOS device/simulator (use Cmd+Shift+A to toggle appearance on simulator)
- Android emulator (use CLI):
  - `adb shell "cmd uimode night yes"`
  - `adb shell "cmd uimode night no"`

Assumption: system and RN color scheme settings are working correctly. Here only the `colorScheme` prop on TabsHost is tested, verified against different system/RN combinations.

---

### Steps

**Baseline**

1. Launch the app and navigate to the scenario

- [ ] Expected: Config tab is shown. Pickers default to `unspecified` / `inherit`

---

**TabsHost `inherit` — follows RN/system**

1. Set system/RN to **light**, TabsHost colorScheme = `inherit`

- [ ] Expected: Tab bar appears **light**

1. Set system/RN to **dark**, keep TabsHost colorScheme = `inherit`

- [ ] Expected: Tab bar appears **dark** — TabsHost defers to RN/system

---

**TabsHost `light` — overrides RN/system**

1. Set system/RN to **dark**, set TabsHost colorScheme = `light`

- [ ] Expected: Tab bar appears **light** — TabsHost overrides dark from RN/system

1. Set system/RN to **light**, keep TabsHost colorScheme = `light`

- [ ] Expected: Tab bar stays **light**

1. Cycle through `inherit` → `dark` → `light` → `dark` → `inherit`

- [ ] Expected: Tab bar color scheme updates immediately with each change, no crash or layout freeze

---

**TabsHost `dark` — overrides RN/system**

1. Set system/RN to **light**, set TabsHost colorScheme = `dark`

- [ ] Expected: Tab bar appears **dark** — TabsHost overrides light from RN/system

1. Set system/RN to **dark**, keep TabsHost colorScheme = `dark`

- [ ] Expected: Tab bar stays **dark**

1. Cycle through `inherit` → `light` → `dark` → `light` → `inherit`

---

**Keyboard tab — smoke**

1. Switch to the **Keyboard** tab, open the keyboard via TextInput (or Cmd+K on iOS simulator)

- [ ] Expected: Keyboard appearance matches the currently active color scheme — verify for both light and dark values.
