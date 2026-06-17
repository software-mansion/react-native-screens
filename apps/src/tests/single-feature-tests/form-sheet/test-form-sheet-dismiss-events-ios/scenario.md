# Test Scenario: Dismiss Events

## Details

**Description:** Verify that the `FormSheet` component correctly emits dismiss events. The `onDismiss` event should be fired every time the sheet is dismissed programmatically. The `onNativeDismiss` event should be fired when the user dismisses the sheet via a native gesture (e.g., swiping down or tapping the backdrop).

**OS test creation version:** iOS: 18.6 and 26.4

## E2E test

TBD: Planned, but will be implemented separately.

## Prerequisites

- iOS device or simulator: iPhone

## Steps

### Baseline

1. Launch the app and navigate to the **Dismiss Events** screen.

- [ ] An example with "Open FormSheet" and "Clear Logs" buttons is shown, along with an empty event logs area.

---

### Native Dismissal (Swiping down)

2. Tap the "Open FormSheet" button.
3. Wait for the sheet presentation animation to finish.
4. Dismiss the FormSheet by swiping it down to the bottom of the screen.

- [ ] The FormSheet dismisses smoothly and returns the user to the underlying main screen.
- [ ] The logs list updates to show new `onNativeDismiss` event added.

---

### Programmatic Dismissal (JS)

5. Tap "Clear Logs" to reset the list.
6. Tap the "Open FormSheet" button.
7. Wait for the sheet presentation animation to finish.
8. Tap the "Dismiss from JS" button inside the FormSheet.

- [ ] The FormSheet dismisses smoothly and returns the user to the underlying main screen.
- [ ] The logs list updates to show new `onDismiss` event added.
