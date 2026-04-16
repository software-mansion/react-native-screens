# Test Scenario: tabBarHidden

**E2E test:** Yes, covers all manual scenario steps. For iOS test are covered only for iPhone, e2e is not suitable for iPad execution due to use 'UITabBar' type (on iPad new tab bar at the top is not an instance of UITabBar).

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
