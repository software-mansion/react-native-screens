# Test Scenario: Sheet initial detent index

## Details

**Description:** Verify the `initialDetentIndex` property of the `FormSheet` component. This test ensures that the FormSheet correctly respects the initial index when mounting and does not forcibly snap back to the initial index if the component re-renders while already presented.

**OS test creation version:** iOS: 18.6 and 26.4

## E2E test

Other: Planned, but will be implemented separately.

## Prerequisites

- iOS device or simulator (iPhone).

## Steps

### Baseline & Default (Index 0)

1. Launch the app and navigate to the **Sheet initial detent index** screen.
2. Ensure "Selected Initial Detent: 0" is displayed.
3. Tap the "Open FormSheet" button.

- [ ] Expected: The FormSheet opens and snaps immediately to the lowest detent (0.3 detent).

### Re-render Validation

4. While the sheet is open at the 0.3 detent, drag it up to the middle detent (0.6).
5. Tap the "Force Re-render" button inside the sheet.

- [ ] Expected: The button's counter updates (confirming a React render cycle occurred).
- [ ] Expected: The sheet remains at the 0.6 detent.

6. Dismiss the sheet by swiping down or tapping "Dismiss from JS".

---

### Middle Detent (Index 1)

7. On the main screen, tap "Set Initial to 1 (0.6)".
8. Tap the "Open FormSheet" button.

- [ ] Expected: The FormSheet opens directly at the middle detent (0.6 detent).

9. Dismiss the sheet.

---

### 'last' Detent (Index N-1)

10. On the main screen, tap "Set Initial to 'last' (1.0)".
11. Tap the "Open FormSheet" button.

- [ ] Expected: The FormSheet opens and snaps directly to the maximum height (1.0 detent).

12. Dismiss the sheet.
