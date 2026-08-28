# Test Scenario: Lifecycle Events

## Details

**Description:** Verify that a standalone `FormSheet` emits its lifecycle events (`onWillAppear`, `onDidAppear`, `onWillDisappear`, `onDidDisappear`) in the order matching the native presentation transitions, for both programmatic and native dismissal. The host screen keeps a timestamped event log; the sheet has a single detent (`[0.4]`).

**OS test creation version:** iOS: 18.6 and 26.5, iPadOS: 26.5, Android: API Level 36.

## E2E test

TBD: Planned, but will be implemented separately.

## Prerequisites

- iPhone: device or simulator.
- iPad: device or simulator, app in full-screen mode (regular width and regular height size classes).
- Android: phone device or emulator.

## Note

- `*WillAppear` / `*WillDisappear` are expected as soon as the transition starts, `*DidAppear` / `*DidDisappear` when it ends – wait for the animation to finish before reading the log.
- **iPad:** the sheet is presented as a centered floating panel with a fixed width, not as a full-width bottom sheet. The event flow is identical.

## Steps - iPhone

### Baseline

1. Launch the app and navigate to the **Lifecycle Events** screen.

- [ ] The host screen shows the "Open FormSheet" button and a "Clear Logs" button and an empty "Event Logs" panel ("No events recorded yet.").

---

### Presentation

2. Tap "Open FormSheet" and wait for the presentation animation to finish.

- [ ] The sheet presents at the 0.4 detent.
- [ ] The log shows exactly two new entries, in this order: `onWillAppear`, `onDidAppear`.

---

### Native dismissal

3. Swipe the sheet down to dismiss it and wait for the animation to finish.

- [ ] The log shows exactly two new entries, in this order: `onWillDisappear`, `onDidDisappear`.

---

### Programmatic dismissal

4. Tap "Clear Logs".

- [ ] The log is empty again.

5. Tap "Open FormSheet", wait for the sheet to present, then tap "Dismiss from JS" inside the sheet and wait for the animation to finish.

- [ ] The sheet dismisses.
- [ ] The log contains exactly four entries, in this order: `onWillAppear`, `onDidAppear`, `onWillDisappear`, `onDidDisappear`.

## Steps - iPad

### Baseline

1. Launch the app and navigate to the **Lifecycle Events** screen.

- [ ] The host screen shows the "Open FormSheet" button and a "Clear Logs" button and an empty "Event Logs" panel ("No events recorded yet.").

---

### Presentation

2. Tap "Open FormSheet" and wait for the presentation animation to finish.

- [ ] The sheet presents as a centered floating panel at the 0.4 detent.
- [ ] The log shows exactly two new entries, in this order: `onWillAppear`, `onDidAppear`.

---

### Native dismissal

3. Swipe the panel down to dismiss it and wait for the animation to finish.

- [ ] The log shows exactly two new entries, in this order: `onWillDisappear`, `onDidDisappear`.

---

### Programmatic dismissal

4. Tap "Clear Logs".

- [ ] The log is empty again.

5. Tap "Open FormSheet", wait for the panel to present, then tap "Dismiss from JS" inside the panel and wait for the animation to finish.

- [ ] The panel dismisses.
- [ ] The log contains exactly four entries, in this order: `onWillAppear`, `onDidAppear`, `onWillDisappear`, `onDidDisappear`.

## Steps - Android

### Baseline

1. Launch the app and navigate to the **Lifecycle Events** screen.

- [ ] The host screen shows the "Open FormSheet" button and a "Clear Logs" button and an empty "Event Logs" panel ("No events recorded yet.").

---

### Presentation

2. Tap "Open FormSheet" and wait for the presentation animation to finish.

- [ ] The sheet presents at the 0.4 detent.
- [ ] The log shows exactly two new entries, in this order: `onWillAppear`, `onDidAppear`.

---

### Native dismissal

3. Swipe the sheet down to dismiss it and wait for the animation to finish.

- [ ] The log shows exactly two new entries, in this order: `onWillDisappear`, `onDidDisappear`.

4. Tap "Open FormSheet", wait for the sheet to present, then use the system back gesture (or the back button) and wait for the animation to finish.

- [ ] The sheet dismisses and the log again shows `onWillDisappear`, `onDidDisappear` as the last two entries.

---

### Programmatic dismissal

5. Tap "Clear Logs".

- [ ] The log is empty again.

6. Tap "Open FormSheet", wait for the sheet to present, then tap "Dismiss from JS" inside the sheet and wait for the animation to finish.

- [ ] The sheet dismisses.
- [ ] The log contains exactly four entries, in this order: `onWillAppear`, `onDidAppear`, `onWillDisappear`, `onDidDisappear`.
