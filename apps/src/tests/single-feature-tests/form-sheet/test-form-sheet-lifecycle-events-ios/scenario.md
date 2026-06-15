# Test Scenario: Lifecycle Events

## Details

**Description:** Verify that the `FormSheet` component correctly emits lifecycle events (`onWillAppear`, `onDidAppear`, `onWillDisappear`, `onDidDisappear`) in the exact order corresponding to the underlying native modal presentation transitions.

**OS test creation version:** iOS: 18.6 and 26.4

## E2E test

TBD: Planned, but will be implemented separately.

## Prerequisites

- iOS device or simulator: iPhone

## Steps

### Baseline

1. Launch the app and navigate to the **Lifecycle Events** screen.

- [ ] A UI with "Open FormSheet" and "Clear Logs" buttons is shown, along with an empty event logs area.

---

### Presentation (Opening)

2. Tap the "Open FormSheet" button.
3. Wait for the sheet presentation animation to finish.

- [ ] The FormSheet opens smoothly.
- [ ] The logs list updates to show exactly two new events in the following order: `onWillAppear`, `onDidAppear`

---

### Native Dismissal (Swiping down)

4. Dismiss the FormSheet by swiping it down.

- [ ] The logs list updates to show exactly two new events: `onWillDisappear`, `onDidDisappear`

---

### Programmatic Dismissal (JS)

5. Tap "Clear Logs" to reset the list.
6. Tap "Open FormSheet" and wait for it to open.
7. Tap the "Dismiss from JS" button inside the FormSheet.

- [ ] The FormSheet closes smoothly.
- [ ] The final logs list contains exactly four events in total, recorded in the following chronological order: `onWillAppear`, `onDidAppear`, `onWillDisappear`, `onDidDisappear`.
