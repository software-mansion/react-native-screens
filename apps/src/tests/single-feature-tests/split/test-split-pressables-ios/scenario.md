# Test Scenario: Split command show column

## Details

**Description:** Verify the rendering and interaction of `Split.Column` components inside a `Split.Host`. This test ensures that when a previously hidden column (e.g., the Primary column) transitions into window, the React Native hit-testing is correctly updated and `Pressable` components inside it remain fully interactive.

**OS test creation version:** iOS: 18.6 and 26.4

## E2E test

TBD: Planned, but will be implemented separately.

## Prerequisites

- iOS device or simulator (iPad is recommended to fully utilize `oneBesideSecondary` display mode).

## Steps

### Baseline

1. Launch the **TestSplitPressables** SFT from the top-level of the application.

- [ ] The `Split.Host` is rendered. Depending on the device orientation and size, the "Supplementary column" and/or "Secondary column" are visible.
- [ ] The "Primary column" is initially hidden or collapsed (based on the `oneBesideSecondary` preferred display mode).

---

### Initial Interaction Validation

2. Tap the text inside the currently visible columns (e.g., "Supplementary column" or "Secondary column").

- [ ] The `PressableWithFeedback` correctly registers the touch and provides visual feedback.

---

### Column Transition & Hit-Testing Validation

3. Reveal the "Primary column" (tap the toggle button in the navigation bar).

- [ ] The Primary column smoothly slides into view.

4. Once the animation is fully completed, tap the "Primary column" text inside the newly revealed column.

- [ ] The `PressableWithFeedback` correctly registers the touch and provides visual feedback. The press must NOT be ignored or cancelled.
