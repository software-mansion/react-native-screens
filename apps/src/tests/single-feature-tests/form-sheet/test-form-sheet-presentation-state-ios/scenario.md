# Test Scenario: Presentation State

## Details

**Description:** Verify the presentation state machine. This test ensures that when the React Native state rapidly toggles between `false` and `true` the native layer correctly queues the presentation changes and prevents state desynchronization.

**OS test creation version:** iOS: 18.6 and 26.4

## E2E test

Other: Planned, but will be implemented separately.

## Prerequisites

- iOS device or simulator: iPhone

## Steps - iPhone

### Baseline

1. Launch the app and navigate to the **Presentation state** screen.

- [ ] Expected: Content with the button "Open FormSheet" is shown.

---

### Initialization

2. Tap the "Open FormSheet" button.

- [ ] Expected: The FormSheet opens smoothly and displays its content.

---

### Rapid State Toggling (Stress Test)

3. Tap the "Quickly dismiss & present" button.

- [ ] Expected: The FormSheet should begin the dismissal animation. As soon as the dismissal animation finishes, the FormSheet should immediately automatically re-present itself. The final state should be opened FormSheet.

---

### Final Dismissal Verification

4. Grab the top edge of the FormSheet and swipe down completely to natively dismiss it.

- [ ] Expected: The FormSheet dismisses and returns the user to the underlying main screen. The native state is synchronized, and tapping "Open FormSheet" again works correctly.
