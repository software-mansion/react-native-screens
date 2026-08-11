# Test Scenario: tabBarHidden

## Details

**Description:** This test scenario focuses on the visibility management of the tab bar. It validates the tabBarHidden property, ensuring that the UI responds dynamically to state changes without layout shifts or persistence errors. 
It also ensures that a hidden native view (tab bar) does not interfere with React Native's Pressables.
On iOS, it also validates the `ios.tabBarHiddenAnimationEnabled` property, which controls whether the transition is animated (iOS 18+).

**OS test creation version:** iOS: 18.6 and 26.2, Android: API Level 36.

## E2E test

Incomplete: Steps 4-6 are not covered.

## Prerequisites

- iOS device or simulator
- Android emulator

## Steps

### Basic functionality

1. Launch the app and navigate to the screen Tab Bar Hidden.

- [ ] Screen with one Tab in tab bar should be displayed.
- [ ] A green "Bottom Pressable" should be anchored to the bottom of the screen, behind the tab bar.

2. Toggle `tabBarHidden` to `true`.

- [ ] Tab bar should disappear. On iOS 18+, the transition should be animated (`ios.tabBarHiddenAnimationEnabled` defaults to `true`); on Android and iOS < 18 the tab bar disappears immediately.

---

### (iOS only) Hiding animation can be enabled and disabled dynamically

3. Toggle `tabBarHidden` back to `false`.

- [ ] Tab bar should reappear, with the same animation behavior as in step 2.

4. (iOS only) Toggle `ios.tabBarHiddenAnimationEnabled` to `false`, then repeat steps 2-3.

- [ ] Tab bar should disappear and reappear immediately, without animation.

5. (iOS only) Toggle `ios.tabBarHiddenAnimationEnabled` back to `true`, then repeat steps 2-3.

- [ ] Tab bar should disappear and reappear with animation again.

---

### (Android only) Hidden native view does not block pressables

6. (Android only) Tap the green "Bottom Pressable", just above the system navigation bar.

- [ ] `Bottom presses` should increment. Hidden native view should not block Pressable interaction.
