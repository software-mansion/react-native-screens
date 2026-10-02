# Test Scenario: Recursive emission on tab tap

## Details

**Description:** Reproduces a crash on Android where tapping a tab while a React
commit is pending threw `[RNScreens] Recursive emission on TabsNavigationStateObserverRegistry`.
The host is re-rendered every frame (changing badge values) and each tab runs a
Reanimated animation, so Reanimated flushes pending operations synchronously when the
tab selected event is dispatched.

**OS test creation version:** Android: API Level 36.

## E2E test

Not automated.

## Prerequisites

- Android emulator or device.
- `react-native-reanimated` installed in the example app.

---

## Steps (Android)

1. Launch the app and navigate to the **Recursive emission on tab tap** screen.

- [ ] Three tabs are visible, each with a badge that keeps changing.
- [ ] The red box on the visible tab keeps animating.

2. Tap between **First**, **Second** and **Third** repeatedly, at varying speed, for about 30 seconds.

- [ ] The app does not crash.
- [ ] The selected tab always follows the last tap.
