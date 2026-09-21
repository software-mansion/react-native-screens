# Test Scenario: Dismiss Events

## Details

**Description:** Verify the dismiss events of the `FormSheet` component with detents `[0.6, 1.0]`. `onNativeDismiss` must fire when the user dismisses the sheet natively (swipe down, backdrop tap); `onDismiss` must fire when the sheet is dismissed programmatically (`isOpen` set to `false`). The host screen keeps a timestamped event log.

**OS test creation version:** iOS: 18.6 and 26.5, iPadOS: 26.5, Android: API Level 36.

## E2E test

TBD: Planned, but will be implemented separately.

## Prerequisites

- iPhone: device or simulator.
- iPad: device or simulator, app in full-screen mode (regular width and regular height size classes).
- Android: phone device or emulator.

## Note

- Wait for the dismissal animation to finish before reading the log.
- **iPad:** the sheet is presented as a centered floating panel with a fixed width; the backdrop is the dimmed area around the panel.

## Steps

### Baseline

1. Launch the app and navigate to the **Dismiss Events** screen.

- [ ] The host screen shows the "Open FormSheet" and "Clear Logs" buttons and an empty "Event Logs" panel ("No events recorded yet.").

---

### Native dismissal – swipe

2. Tap "Open FormSheet", wait for the sheet to present, then swipe it down past the lower detent.

- [ ] The sheet dismisses.
- [ ] The log shows exactly one new entry: `onNativeDismiss`.

---

### Native dismissal – backdrop

3. Tap "Open FormSheet", wait for the sheet to present, then tap the backdrop (the dimmed area outside the sheet).

- [ ] The sheet dismisses.
- [ ] The log shows exactly one new entry: `onNativeDismiss`.

---

### Programmatic dismissal

4. Tap "Clear Logs".

- [ ] The log is empty again.

5. Tap "Open FormSheet", wait for the sheet to present, then tap "Dismiss from JS" inside the sheet.

- [ ] The sheet dismisses.
- [ ] The log shows exactly one entry: `onDismiss` (and no `onNativeDismiss`).

---

### Android only - system back native dismissal

6. Tap "Open FormSheet", wait for the sheet to present, then use the system back gesture (or the back button).

- [ ] The sheet dismisses.
- [ ] The log shows exactly one new entry: `onNativeDismiss`.
