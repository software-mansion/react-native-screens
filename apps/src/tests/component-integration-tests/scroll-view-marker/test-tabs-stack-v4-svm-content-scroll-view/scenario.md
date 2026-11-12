# Test Scenario: ScrollViewMarker - Tabs & Stack v4 content scroll view

## Details

**Description:** Verifies that a `ScrollViewMarker` in a Stack v4
(`@react-navigation/native-stack`) screen nested in `Tabs` registers its
`ScrollView` as the content scroll view of the Stack v4 screen. The
marked `ScrollView` is rendered after an absolutely positioned
background `View`, so it is not in the first descendant chain of the
screen and UIKit cannot find it on its own. The registered scroll view
drives:

- the large title collapse,
- the tab bar minimize behavior (`tabBarMinimizeBehavior: 'onScrollDown'`),
  which `Tabs` resolves through the nested navigation controller,
- scroll-to-top on repeated tab selection,
- the `contentInsetAdjustmentBehavior` override of the tabs screen: the
  `ScrollView` does not set `contentInsetAdjustmentBehavior`, so it
  starts as React Native's default `never`.

**OS test creation version:** iOS 27.0.

## E2E test

Incomplete: not automated. The checks are visual (large title collapse,
tab bar minimization, content insets), which Detox cannot verify.

## Prerequisites

- iOS simulator or device with iOS 26+ for the tab bar minimize
  behavior. The other checks also work on older iOS versions.

## Note

- The white background `View` rendered before the marker is
  intentional. It occupies the first descendant chain of the screen.
- Both stack screens use `headerLargeTitleEnabled: true`.

## Steps

### Root screen

1. Launch the app and navigate to **ScrollViewMarker Integration Tests →
   SVM in Tabs & Stack v4 - content scroll view**.

    - [ ] The `Stack` tab is selected. Its `Home` screen shows a large
          title, a **Push screen** button and a list of coloured
          full-width rectangles.
    - [ ] The button and the first rectangle start below the large
          title, not under the navigation bar.

2. Scroll the list down.

    - [ ] The large title collapses into the navigation bar.
    - [ ] The tab bar minimizes.

3. Tap the minimized tab bar to expand it, then tap the `Stack` tab
   item again.

    - [ ] The list scrolls back to the top: the **Push screen** button
          is visible again below the navigation bar.

---

### Pushed screen

1. Tap **Push screen**.

    - [ ] The `Pushed` screen shows a large title above the list, which
          starts below the large title.

2. Scroll the list down.

    - [ ] The large title collapses into the navigation bar.
    - [ ] The tab bar minimizes.

3. Go back, switch to the `Other` tab, then back to the `Stack` tab and
   scroll the `Home` list down.

    - [ ] The large title collapses and the tab bar minimizes, as in
          the first section.
