# Test Scenario: tabBarHidden

## Details

**Description:** This test scenario focuses on the visibility management of the tab bar. It validates the tabBarHidden property, ensuring that the UI responds dynamically to state changes without layout shifts or persistence errors.

**OS test creation version:** iOS: 18.6 and 26.2, Android: API Level 36.

## E2E test

Full: Covers all manual scenario steps.

## Prerequisites

- iOS device or simulator
- Android emulator

## Steps

1. Launch the app and navigate to the screen Tab Bar Hidden.

- [ ] Expected: Screen with one Tab in tab bar should be displayed.

2. Toggle `tabBarHidden` to `true`.

- [ ] Expected: Tab bar should disappear immediately.

3. Toggle back to `false`.

- [ ] Expected: Tab bar should reappear.
