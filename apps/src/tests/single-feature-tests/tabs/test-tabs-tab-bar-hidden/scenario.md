# Test Scenario: tabBarHidden

## Details

**Description:** This test scenario focuses on the visibility management of the tab bar. It validates the tabBarHidden property, ensuring that the UI responds dynamically to state changes without layout shifts or persistence errors. It also covers the strip the tab bar frees up when hidden, which must accept touches on Android (#4132).

**OS test creation version:** iOS: 18.6 and 26.2, Android: API Level 36.

## E2E test

Full: Covers all manual scenario steps.

Step 3 is Android-only: on iOS the tab bar is not hidden by collapsing a native view, so the defect it guards against does not apply there.

## Prerequisites

- iOS device or simulator
- Android emulator

## Steps

1. Launch the app and navigate to the screen Tab Bar Hidden.

- [ ] Screen with one Tab in tab bar should be displayed.
- [ ] A green "Bottom Pressable" should be anchored to the bottom of the screen, behind the tab bar.

2. Toggle `tabBarHidden` to `true`.

- [ ] Tab bar should disappear immediately.

3. Tap the green "Bottom Pressable", just above the system navigation bar.

- [ ] `Bottom presses` should increment. (Android: before #4132 was fixed, the hidden tab bar kept its last bounds and swallowed this touch.)

4. Toggle back to `false`.

- [ ] Tab bar should reappear.
