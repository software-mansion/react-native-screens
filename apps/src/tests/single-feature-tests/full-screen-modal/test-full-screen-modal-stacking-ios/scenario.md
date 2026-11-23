# Test Scenario: Full Screen Modal Stacking

## Details

**Description:** Verify a full-screen modal presented from inside another
full-screen modal, for every pairing of `FullScreenModalReplacingContent` and
`FullScreenModalOverContent`: the upper modal presents, closing it restores the
lower modal with its content intact, and closing the lower modal while the upper
one is open takes both down with `onNativeDismiss` on the upper one.

**OS test creation version:** iOS 27.3.

## E2E test

TBD: the event log is readable with Detox; automation is planned together with
the other full-screen modal scenarios.

## Prerequisites

- iPhone: device or simulator.

## Note

- Wait for every animation to finish before the next tap.
- The event log is shown on the presenter screen and inside both modals; all
  show the same entries.
- "Lower: Replacing" / "Lower: Over" and "Upper: Replacing" / "Upper: Over"
  toggle the variant of the respective modal; switching a variant closes an
  open modal of that level without events.

## Steps

### Baseline

1. Launch the app and navigate to the **Full Screen Modal Stacking** screen.

   - [ ] "Presenter screen" is shown with "Lower: Replacing", "Upper:
         Replacing" and an empty log.

---

### Replacing over Replacing

1. Tap "Open lower", tap "Increment" 2 times, tap "Clear log", then tap "Open
   upper".

   - [ ] The "Upper (Replacing)" card is shown; nothing of the lower modal is
         visible.
   - [ ] The log shows exactly `Lower: onWillDisappear`, `Upper: onWillAppear`,
         `Upper: onDidAppear`, `Lower: onDidDisappear`.

2. Tap "Clear log", then tap "Close upper".

   - [ ] The "Lower (Replacing)" card is shown with "Counter: 2".
   - [ ] The log shows exactly `Upper: onWillDisappear`, `Lower: onWillAppear`,
         `Lower: onDidAppear`, `Upper: onDidDisappear`, `Upper: onDismiss`.

3. Tap "Clear log", tap "Open upper", tap "Clear log", then tap "Close lower"
   inside the upper modal.

   - [ ] Both modals slide down and "Presenter screen" is shown.
   - [ ] The log shows exactly `Upper: onWillDisappear`, `Lower: onWillAppear`,
         `Lower: onWillDisappear`, `Lower: onDidDisappear`,
         `Upper: onDidDisappear`, `Upper: onNativeDismiss`, `Lower: onDismiss`.

---

### Over over Replacing

1. Tap "Upper: Replacing", tap "Clear log", tap "Open lower", tap "Increment" 2
   times, tap "Clear log", then tap "Open upper".

   - [ ] The "Upper (Over)" card is shown; above it the lower modal's background
         stays visible.
   - [ ] The log shows exactly `Upper: onWillAppear`, `Upper: onDidAppear`.

2. Tap "Clear log", then tap "Close upper".

   - [ ] The "Lower (Replacing)" card is shown with "Counter: 2".
   - [ ] The log shows exactly `Upper: onWillDisappear`,
         `Upper: onDidDisappear`, `Upper: onDismiss`.

3. Tap "Clear log", tap "Open upper", tap "Clear log", then tap "Close lower"
   inside the upper modal.

   - [ ] Both modals slide down and "Presenter screen" is shown.
   - [ ] The log shows exactly `Upper: onWillDisappear`,
         `Lower: onWillDisappear`, `Upper: onDidDisappear`,
         `Upper: onNativeDismiss`, `Lower: onDidDisappear`, `Lower: onDismiss`.

---

### Replacing over Over

1. Tap "Lower: Replacing", tap "Upper: Over", tap "Clear log", tap "Open
   lower", tap "Increment" 2 times, tap "Clear log", then tap "Open upper".

   - [ ] The "Upper (Replacing)" card is shown; nothing of the lower modal or
         "Presenter screen" is visible.
   - [ ] The log shows exactly `Lower: onWillDisappear`, `Upper: onWillAppear`,
         `Upper: onDidAppear`, `Lower: onDidDisappear`.

2. Tap "Clear log", then tap "Close upper".

   - [ ] The "Lower (Over)" card is shown with "Counter: 2" and "Presenter
         screen" visible above it.
   - [ ] The log shows exactly `Upper: onWillDisappear`, `Lower: onWillAppear`,
         `Lower: onDidAppear`, `Upper: onDidDisappear`, `Upper: onDismiss`.

3. Tap "Clear log", tap "Open upper", tap "Clear log", then tap "Close lower"
   inside the upper modal.

   - [ ] Both modals slide down and "Presenter screen" is shown.
   - [ ] The log shows exactly `Upper: onWillDisappear`, `Lower: onWillAppear`,
         `Lower: onWillDisappear`, `Lower: onDidDisappear`,
         `Upper: onDidDisappear`, `Upper: onNativeDismiss`, `Lower: onDismiss`.

---

### Over over Over

1. Tap "Upper: Replacing", tap "Clear log", tap "Open lower", tap "Increment" 2
   times, tap "Clear log", then tap "Open upper".

   - [ ] The "Upper (Over)" card is shown with "Presenter screen" visible above
         it.
   - [ ] The log shows exactly `Upper: onWillAppear`, `Upper: onDidAppear`.

2. Tap "Clear log", then tap "Close upper".

   - [ ] The "Lower (Over)" card is shown with "Counter: 2".
   - [ ] The log shows exactly `Upper: onWillDisappear`,
         `Upper: onDidDisappear`, `Upper: onDismiss`.

3. Tap "Clear log", tap "Open upper", tap "Clear log", then tap "Close lower"
   inside the upper modal.

   - [ ] Both modals slide down and "Presenter screen" is shown.
   - [ ] The log shows exactly `Upper: onWillDisappear`,
         `Lower: onWillDisappear`, `Upper: onDidDisappear`,
         `Upper: onNativeDismiss`, `Lower: onDidDisappear`, `Lower: onDismiss`.
