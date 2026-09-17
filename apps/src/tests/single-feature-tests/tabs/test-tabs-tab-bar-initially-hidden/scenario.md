# Test Scenario: tabBar initially hidden

## Details

**Description**: This test scenario focuses on lack of animation directly after first render when the 
`ios.tabBarHiddenAnimationEnabled` is enabled and the tab bar is initially hidden.

**OS test creation version:** iOS: 18.6 and 26.2.

## E2E test

Incomplete: not covered at all.

## Prerequisites

- iOS device or simulator - make sure to run on both iOS 18 and >= 26

## Steps

1. Launch the app and navigate to the screen Tab Bar Hidden.

- [ ] The tab bar should be not visible even for a frame. There should be no animation visible.

2. Toggle `tabBarHidden` to `false`.

- [ ] Tab bar should appear with animation.
