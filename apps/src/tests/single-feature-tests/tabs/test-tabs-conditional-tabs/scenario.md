# Test Scenario: conditional tabs

## Details

**Description:** Tabs are rendered conditionally: Tab2-Tab4 are removed from (and added back to) `Tabs.Host` at runtime, while `tabBarHidden` hides the tab bar when only Tab1 is left. Validates that removed `TabsScreen`s are also removed natively.

**OS test creation version:** Android: API Level 36.

## E2E test

TBD.

## Prerequisites

- iOS device or simulator
- Android emulator

## Steps

1. Launch the app and navigate to the screen Conditional Tabs.

- [ ] Tab bar with Tab1-Tab4 should be displayed.

2. Press `Hide extra tabs`.

- [ ] Tab bar should disappear.

3. Press `Show extra tabs`.

- [ ] Tab bar should reappear with exactly Tab1-Tab4 and the app should not crash.

4. Repeat steps 2-3 a few times.

- [ ] Tab bar should always show exactly Tab1-Tab4.
