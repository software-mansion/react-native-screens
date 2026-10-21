# Test Scenario: additionalSafeAreaInsets

## Details

**Description:** Verifies that `additionalSafeAreaInsets` on a v4 `Screen`
extends the safe area of the screen's content. The scenario renders two
tab-like `Screen`s in a `ScreenContainer`, the way JS tab navigators do,
under a custom bar floating over their bottom edge. With the insets on, the
list and the `SafeAreaView` inside the screens keep clear of the bar, like
they do for a native `UITabBar` on iOS. With the insets off, content ends
behind the bar.

**OS test creation version:** iOS 27.0, Android API 30.

## E2E test

TBD: the checks are visual (content position relative to the floating bar).
They could be automated by comparing element frames.

## Prerequisites

- iOS simulator or device, Android emulator or device.

## Note

- The floating bar is a plain React Native view rendered above the
  `ScreenContainer`. It is not part of the screens and does not change their
  layout; only the `additionalSafeAreaInsets` prop does.
- The scenario starts with the insets on.
- On iOS the list relies on `contentInsetAdjustmentBehavior="automatic"`.
  Android has no automatic scroll view insets, so the list content is
  wrapped in a `SafeAreaView` there.
- The `useSafeAreaInsets` line comes from a `react-native-safe-area-context`
  provider inside the screen. On Android it only reflects the extra bottom
  inset with a version of that library that reads the insets dispatched to
  the provider; older versions keep showing the navigation bar inset.

## Steps

### List tab

1. Open the scenario and scroll the list to the bottom.

    - [ ] The green "Last row" rests fully visible above the floating bar.

2. Tap `Insets: on` in the floating bar.

    - [ ] The label changes to `Insets: off`.
    - [ ] The list can no longer scroll the "Last row" above the bar; it
          ends behind the bar.

3. Tap `Insets: off`.

    - [ ] The label changes to `Insets: on` and the "Last row" can again be
          scrolled fully above the bar.

---

### SafeAreaView tab

1. Tap `SafeAreaView` in the floating bar.

    - [ ] The bottom edge of the red border sits above the floating bar.
    - [ ] The `useSafeAreaInsets` bottom value includes the extra 80 points
          (see Note for Android).

2. Tap `Insets: on`.

    - [ ] The bottom edge of the red border moves down behind the bar, to
          the top of the home indicator or navigation bar area.
    - [ ] The `useSafeAreaInsets` bottom value drops by 80.
