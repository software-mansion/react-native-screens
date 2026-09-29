# Test Scenario: Stack Header Bar Safe Area Adjustment (iOS)

## Details

**Description:** Tests the `safeAreaAdjustment` header config prop, which
controls whether the safe area adjusts while the navigation bar minimizes.
A single stack screen with a transparent header hosts a long scroll view with
a picker at its top. The safe area is consumed by `SafeAreaView`, which wraps
the scroll view.

**OS test creation version:** 27.2

## E2E test

TBD.

## Prerequisites

- iOS simulator with iOS 27 or higher

## Note

On iOS < 27 the prop is ignored and a warning is logged for any value other
than `automatic`.

`SafeAreaView` applies the top inset as a margin, so the area above the yellow
background is the inset it currently applies.

`minimizationBehavior` is fixed to `onScrollDown`, so scrolling down always
minimizes the header.

## Steps

1. Navigate to **Stack v5 → Stack Header Bar Safe Area Adjustment (iOS)**.

    - [ ] The `safeAreaAdjustment` picker is set to `automatic`.
    - [ ] The yellow background starts right below the header.

2. Scroll down to around row 20.

    - [ ] The header minimizes.
    - [ ] The content moves up and starts right below the status bar.

3. Scroll to the top, set `safeAreaAdjustment` to `disabled` and scroll down
   to around row 20.

    - [ ] The header minimizes.
    - [ ] The content does NOT move up; an empty gap remains where the header
          was.

4. Scroll to the top, set `safeAreaAdjustment` to `enabled` and scroll down
   to around row 20.

    - [ ] The header minimizes.
    - [ ] The content moves up and starts right below the status bar.
