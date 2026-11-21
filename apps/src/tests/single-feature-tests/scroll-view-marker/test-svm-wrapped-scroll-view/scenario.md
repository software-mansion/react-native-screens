# Test Scenario: ScrollViewMarker - wrapped ScrollView

## Details

**Description:** Verifies that `ScrollViewMarker` finds a `ScrollView`
that is not its direct child but is wrapped by views with a single
subview each. Two variants are covered:

- `gesture-handler`: `ScrollView` from `react-native-gesture-handler`,
  which renders its detector view around the native scroll view. The
  marker cannot be placed between the two.
- `view-wrapper`: a plain `View` with a single `ScrollView` child.

The `Text` label before the marker breaks the "first descendant chain"
heuristic, so the stack screen can find its content scroll view only
through the marker. The marker sets a `hard` top edge effect, which is
how the steps observe that the marker found the scroll view.

**OS test creation version:** iOS 27.0.

## E2E test

Incomplete: not automated. The checks are visual (the dividing line of
the `hard` edge effect) and Detox cannot verify them.

## Prerequisites

- iOS simulator or device with iOS 26+ (`scrollEdgeEffects` is a
  no-op on older iOS versions).
- A debug build: before this fix, the marker fails a debug assertion
  (`[RNScreens] Failed to find ScrollView`) for both variants.

## Steps

1. Launch the app and navigate to **ScrollViewMarker scenarios →
   Wrapped ScrollView**.

    - [ ] No `Failed to find ScrollView` error is shown.
    - [ ] Visible: the label, a list of coloured rectangles, and the
          selector pill with `gesture-handler` highlighted.

2. Scroll the list up and stop mid-list.

    - [ ] The top edge shows the `hard` effect: a sharp cutoff with a
          thin dividing line.

3. Tap `view-wrapper` (the marker remounts with a new child), then
   scroll the list up and stop mid-list.

    - [ ] No `Failed to find ScrollView` error is shown.
    - [ ] The top edge shows the `hard` effect again.
