# Test Scenario: tabBarHidden

## Details

**Description:** This test scenario focuses on the visibility management of the tab bar. It validates the tabBarHidden property, ensuring that the UI responds dynamically to state changes without layout shifts or persistence errors. On iOS, it also validates the `ios.tabBarHiddenAnimationEnabled` property, which controls whether the transition is animated (iOS 18+).

**OS test creation version:** iOS: 18.6 and 26.2, Android: API Level 36.

## E2E test

Full: Covers all manual scenario steps.

## Prerequisites

- iOS device or simulator
- Android emulator

## Steps

1. Launch the app and navigate to the screen Tab Bar Hidden.

- [ ] Screen with one Tab in tab bar should be displayed.

2. Toggle `tabBarHidden` to `true`.

- [ ] Tab bar should disappear. On iOS 18+, the transition should be animated (`ios.tabBarHiddenAnimationEnabled` defaults to `true`); on Android and iOS < 18 the tab bar disappears immediately.

3. Toggle back to `false`.

- [ ] Tab bar should reappear, with the same animation behavior as in step 2.

4. (iOS only) Toggle `ios.tabBarHiddenAnimationEnabled` to `false`, then repeat steps 2-3.

- [ ] Tab bar should disappear and reappear immediately, without animation.

5. (iOS only) Toggle `ios.tabBarHiddenAnimationEnabled` back to `true`, then repeat steps 2-3.

- [ ] Tab bar should disappear and reappear with animation again.
