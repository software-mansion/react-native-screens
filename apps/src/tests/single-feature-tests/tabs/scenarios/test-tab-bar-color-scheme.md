
# colorScheme — Manual Test Scenarios

# Prerequisites
- iOS 18+ device or simulator
- Android emulator -> The easiest way to change system color shceme is to use CLI: 
  - adb shell "cmd uimode night yes"
  - adb shell "cmd uimode night no"

---

**File:** `test-tab-color-scheme`  
**Platform:** iOS + Android

## Steps

### Baseline

1. Launch the app and navigate to the scenario screen  
   Expected: Config tab is shown. All pickers default to  `unspecified` /  `inherit`.

### System color scheme

2. System settings set to `light`
3. Ensure RN `colorScheme`: `unspecified` and TabsHost `colorScheme`: `inherit` 
   Expected: Tabs displayed in light colorScheme
4. Switch system to `dark` mode
   Expected: Tab bar follows system — appears dark
5. Switch system to `light` mode
         Expected: Tab bar follows system — appears light

### React Native color scheme (overrides system)

6. Keep TabsHost colorScheme = `inherit`
7. Set RN colorScheme = `dark`, system = `light`
   Expected: Tab bar appears dark, ignoring system light mode
8. Set RN colorScheme = `light`, system = `dark`
   Expected: Tab bar appears light, ignoring system dark mode
9. Set RN colorScheme =  `unspecified`
   Expected: Tab bar falls back to system setting - dark mode

### TabsHost colorScheme (highest precedence)

10. Set system = `light`, RN colorScheme = `dark`
11. Set TabsHost colorScheme = `light`
   Expected: Tab bar appears light, overriding both system and RN dark setting
12. Set system = `dark`, RN colorScheme = `light`
13. Set TabsHost colorScheme = `dark`
   Expected: Tab bar appears dark, overriding both system and RN light setting
14. Set TabsHost colorScheme =  `inherit`
   Expected: Tab bar falls back to RN colorScheme setting - light mode

### Precedence chain verification

15. Set system = `light`, RN = `dark`, TabsHost = `light`
   Expected: Tab bar is light (TabsHost wins)
16. Set TabsHost = `inherit`, RN = `dark`, system = `light`
   Expected: Tab bar is dark (RN wins over system)
17. Set TabsHost = `inherit`, RN =  `unspecified`, system = `dark`
   Expected: Tab bar is dark (system is the only source)


### Keyboard tab

18. Switch to the Keyboard tab, open the keyboard via the TextInput (or using Cmd+K on iOS)
   Expected: Keyboard appearance matches the currently active color scheme across all combinations above