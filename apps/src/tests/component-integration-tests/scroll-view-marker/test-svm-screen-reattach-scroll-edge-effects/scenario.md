# Test Scenario: Scroll edge effects after screen re-attach

## Details

**Description:** Verifies that scroll edge effects set by a
`ScrollViewMarker` or by a nested stack screen survive an enclosing screen
being attached to its container, which re-applies its own `automatic`
effects. The scenario renders JS bottom tabs (`ScreenContainer`). Each tab
holds a Stack v4 with a transparent header over a long `ScrollView`:

- **Marker**: the `ScrollView` is wrapped in a `ScrollViewMarker` with
  `scrollEdgeEffects={{ top: 'soft' }}`; the stack screen leaves its
  effects at `automatic`.
- **ScreenProp**: the stack screen sets `scrollEdgeEffects: { top: 'soft' }`;
  the tab screen leaves its effects at `automatic`.
- **Recycle**: pushes a screen with `scrollEdgeEffects: { top: 'hidden' }`,
  then, after going back, one left at `automatic`. Fabric may reuse the
  first `ScrollView` for the second screen, which must not keep the
  hidden effect.

`automatic` renders as `hard` on iOS 27, so a reset is visible as a hard
edge under the header.

**OS test creation version:** iOS 27.0.

## E2E test

Incomplete: not automated. The checks are visual, which Detox cannot
verify.

## Prerequisites

- iOS simulator or device with iOS 26+.

## Steps

1. Launch the app and navigate to **ScrollViewMarker Integration Tests →
   Scroll edge effects after screen re-attach**. Scroll the list a little.

    - [ ] The **Marker** tab shows rows fading out softly under the header,
          with no hard edge.

2. Switch to **ScreenProp** and scroll a little.

    - [ ] The rows fade out softly under the header.

3. Switch back to **Marker**, then to **ScreenProp** again.

    - [ ] Both tabs still show the soft effect.

4. Switch to **Recycle**, tap **Push hidden**, scroll, go back, tap
   **Push automatic** and scroll.

    - [ ] **Hidden** shows no edge effect under the header.
    - [ ] **Automatic** shows the default (hard on iOS 27) edge effect.
