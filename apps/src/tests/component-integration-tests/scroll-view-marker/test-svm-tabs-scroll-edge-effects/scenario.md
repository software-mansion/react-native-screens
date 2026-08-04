# Test Scenario: Integration: SVM in Tabs - scroll edge effects

## Details

**Description:**
This test verifies interaction between `ScrollViewMarker` and `Tabs` in scope of scroll-edge-effects.
It allows to test both whether the scroll-edge-effect is correctly applied AND whether it is correctly
updated between different tabs.

**OS test creation version:**
iOS 26.5

## E2E test

TBD

## Prerequisites

iOS: simulator with iOS 26+ is enough

## Note

Seemingly the edge effect is applied correctly no matter the integration with the scrollview marker.
Likely UITabBarController uses some different logic to UIViewController.contentScrollView to detect scrollview,
because even when I have had returned nil from the method, the edge effect had still been applied.
Nevertheless, I decided to include this test case here, just to make sure it works.
Also this allows us to test that different ScrollViewMarkers from different tab update the edge effect correctly on tab change.

## Steps

1. Launch the app and navigate to the **SVM in Tabs - scroll edge effects** screen.

- [ ] There should be two tabs: `Home` and `Second`.
- [ ] `Home` tab should be selected.
- [ ] `Hard` scroll-edge-effect should be applied (opqaue background of tab bar).

2. Change tab to `Second`.

- [ ] The scroll-edge-effect should be now changed to `soft` after/during the transition.

3. Change tab back to the `Home`.

- [ ] The scroll-edge-effect should be back at `hard`.
