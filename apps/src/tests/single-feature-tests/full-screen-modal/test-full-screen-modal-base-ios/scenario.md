# Test Scenario: Full Screen Modal Base

## Details

**Description:** Verify that `FullScreenModalReplacingContent` and
`FullScreenModalOverContent` open and close through `isOpen`, emit their
lifecycle events and `onDismiss` once per open and close, reopen when requested
during their own dismissal or a sheet's dismissal, apply a custom background
color, and keep their content's state while closed.

**OS test creation version:** iOS 26.5.

## E2E test

TBD.

## Prerequisites

- iPhone: device or simulator.

## Note

- Wait for every animation to finish before the next tap.
- The event log is shown both on the presenter screen and inside each modal;
  both show the same entries.

## Steps

### Baseline

1. Launch the app and navigate to the **Full Screen Modal Base** screen.

   - [ ] "Presenter screen" is shown with "Custom background: off" and the
         event log reading "No events recorded yet.".

---

### Replacing modal

1. Tap "Open replacing".

   - [ ] The modal slides up and covers the whole screen, including the status
         bar area; around the "Replacing modal" card the background is opaque
         and nothing of "Presenter screen" is visible.
   - [ ] "Counter: 0" is shown.
   - [ ] The log shows exactly `Replacing: onWillAppear`,
         `Replacing: onDidAppear`.

2. Tap "Increment" 2 times, tap "Clear log", then tap "Close".

   - [ ] The modal slides down and "Presenter screen" is shown.
   - [ ] The log shows exactly `Replacing: onWillDisappear`,
         `Replacing: onDidDisappear`, `Replacing: onDismiss`.

3. Tap "Clear log", then tap "Open replacing".

   - [ ] The modal opens with "Counter: 2".
   - [ ] The log shows exactly `Replacing: onWillAppear`,
         `Replacing: onDidAppear`.

---

### Over modal

1. Tap "Close", tap "Clear log", then tap "Open over".

   - [ ] The modal slides up; above the "Over modal" card, "Presenter screen"
         stays visible, including "Open replacing".
   - [ ] "Counter: 0" is shown.
   - [ ] The log shows exactly `Over: onWillAppear`, `Over: onDidAppear`.

2. Tap "Open replacing" above the card.

   - [ ] Nothing happens; the "Over modal" stays on screen and the log has no
         new entries.

3. Tap "Increment" 3 times, tap "Clear log", then tap "Close".

   - [ ] The modal slides down and "Presenter screen" is shown.
   - [ ] The log shows exactly `Over: onWillDisappear`, `Over: onDidDisappear`,
         `Over: onDismiss`.

4. Tap "Clear log", then tap "Open over".

   - [ ] The modal opens with "Counter: 3".
   - [ ] The log shows exactly `Over: onWillAppear`, `Over: onDidAppear`.

---

### Close, then reopen

1. Tap "Clear log", then tap "Close, then reopen".

   - [ ] The modal slides down, then up again; one "Over modal" is shown with
         "Counter: 3".
   - [ ] The log shows exactly `Over: onWillDisappear`, `Over: onDidDisappear`,
         `Over: onDismiss`, `Over: onWillAppear`, `Over: onDidAppear`.

2. Tap "Close", tap "Open replacing", tap "Clear log", then tap "Close, then
   reopen".

   - [ ] The modal slides down, then up again; one "Replacing modal" is shown
         with "Counter: 2".
   - [ ] The log shows exactly `Replacing: onWillDisappear`,
         `Replacing: onDidDisappear`, `Replacing: onDismiss`,
         `Replacing: onWillAppear`, `Replacing: onDidAppear`.

---

### Custom background

1. Tap "Close", tap "Toggle custom background", then tap "Open replacing".

   - [ ] Around the "Replacing modal" card the background is gold.

2. Tap "Close", then tap "Open over".

   - [ ] Around the "Over modal" card the background is gold; nothing of
         "Presenter screen" is visible.

---

### Open after a sheet closes

1. Tap "Close", tap "Toggle custom background", tap "Clear log", tap "Open
   sheet", then tap "Close sheet, open replacing".

   - [ ] The sheet slides down first, then the "Replacing modal" slides up with
         an opaque background that is not gold.
   - [ ] The log shows exactly `Replacing: onWillAppear`,
         `Replacing: onDidAppear`.

2. Tap "Close".

   - [ ] The modal slides down and "Presenter screen" shows "Custom background:
         off".
   - [ ] The log shows exactly `Replacing: onWillAppear`,
         `Replacing: onDidAppear`, `Replacing: onWillDisappear`,
         `Replacing: onDidDisappear`, `Replacing: onDismiss`.
