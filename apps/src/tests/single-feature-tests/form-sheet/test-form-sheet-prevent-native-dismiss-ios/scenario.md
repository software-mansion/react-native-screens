# Test Scenario: PreventNativeDismiss

## Details

**Description:** Verify the `preventNativeDismiss` property and the `onNativeDismissPrevented` event of the `FormSheet` component. This test ensures that when the property is set to `true`, the user cannot dismiss the sheet natively by swiping it down or tapping the backdrop behind the sheet. Instead, the sheet fires an event that displays an Alert. However, the user can still swipe between detents, and programmatic dismissals triggered by React state changes will still work. When set to `false`, the sheet can be dismissed natively without triggering the prevented event.

**OS test creation version:** iOS: 18.6 and 26.4

## E2E test

Other: Planned, but will be implemented separately.

## Prerequisites

- iOS device or simulator (iPhone)

## Steps

### Baseline

1. Launch the app and navigate to the **PreventNativeDismiss** screen.

- [ ] Expected: A status text indicating the current prop value (e.g., "Prevent Native Dismiss: ON"), a switch component, and an "Open FormSheet" button are shown.

### Native Dismissal Prevented & Event Fired

2. Ensure the switch is set to ON. Tap the "Open FormSheet" button.

- [ ] Expected: The FormSheet opens at the initial lower detent (0.5).

3. Swipe up to expand the sheet to the maximum detent (1.0).

- [ ] Expected: The sheet expands successfully. 

4. Swipe down on the sheet to collapse it back to the lower detent (0.5).

- [ ] Expected: The sheet collapses successfully.

5. Swipe down on the sheet to attempt to dismiss it completely.

- [ ] Expected: The FormSheet **does not** dismiss. It resists the gesture and bounces back to the 0.5 detent. An alert with the title "Dismissal Prevented" appears.

6. Tap "OK" on the alert.

- [ ] Expected: The alert closes and the FormSheet remains open.

7. Tap the backdrop (the dimmed area behind/above the sheet).

- [ ] Expected: The FormSheet **does not** dismiss. An alert with the title "Dismissal Prevented" appears again.

8. Tap "OK" on the alert.

- [ ] Expected: The alert closes and the FormSheet remains open.

9. Tap the "Dismiss from JS" button.

- [ ] Expected: The FormSheet dismisses successfully.

### Native Dismissal Allowed

10. Tap the switch component so the status reads "Prevent Native Dismiss: OFF".

11. Tap the "Open FormSheet" button.

- [ ] Expected: The FormSheet opens at the initial lower detent (0.5).

12. Swipe down on the sheet to attempt to dismiss it completely.

- [ ] Expected: The FormSheet dismisses smoothly and returns the user to the underlying main screen. The "Dismissal Prevented" alert **is not** shown.

13. Tap the "Open FormSheet" button again.

- [ ] Expected: The FormSheet opens at the initial lower detent (0.5).

14. Tap the backdrop.

- [ ] Expected: The FormSheet dismisses smoothly and returns the user to the underlying main screen. The "Dismissal Prevented" alert **is not** shown.
