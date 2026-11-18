# Test Scenario: Full Screen Modal Stack Lifecycle

## Details

**Description:** Verify the lifecycle events that the stack screens underneath
receive when a `FullScreenModalReplacingContent` or a
`FullScreenModalOverContent` opens and closes over them, when the stack is
pushed and popped while a modal is open, and when the screen rendering the
modal is popped: the replacing modal makes the visible screens of every stack
level disappear and appear again and hides a push until it closes, the
over-content modal leaves the screens untouched and shows the push underneath,
and popping the modal's screen closes the modal without events.

**OS test creation version:** iOS 26.5.

## E2E test

TBD: the event log is readable with Detox; automation is planned together with
the other full-screen modal scenarios.

## Prerequisites

- iPhone: device or simulator.

## Note

- Wait for every animation to finish before the next tap.
- The event log is shown both on every stack screen and inside each modal; both
  show the same entries.
- Entries are listed in the order they appear in the log, top to bottom.
- "Push B in 2s" and "Pop A in 2s" act 2 seconds after the tap, so a modal
  opened right after the tap is open when the stack changes.
- A modal is rendered by the screen whose "Open replacing" / "Open over" button
  was tapped; popping that screen removes the modal.

## Steps

### Baseline

1. Launch the app and navigate to the **Full Screen Modal Stack Lifecycle**
   screen.

   - [ ] "Screen Home" is shown under the "Home" header and the log shows
         exactly `Home: onWillAppear`, `Home: onDidAppear`.

---

### Replacing modal over a stack

1. Tap "Push A", tap "Clear log", then tap "Open replacing".

   - [ ] The modal slides up and covers the whole screen; nothing of "Screen A"
         or the "A" header is visible.
   - [ ] The log shows exactly `A: onWillDisappear`, `Replacing: onWillAppear`,
         `Replacing: onDidAppear`, `A: onDidDisappear`. No `Home` entry.

2. Tap "Clear log", then tap "Close".

   - [ ] The modal slides down and "Screen A" is shown under the "A" header.
   - [ ] The log shows exactly `Replacing: onWillDisappear`, `A: onWillAppear`,
         `A: onDidAppear`, `Replacing: onDidDisappear`, `Replacing: onDismiss`.
         No `Home` entry.

---

### Over modal over a stack

1. Tap "Clear log", then tap "Open over".

   - [ ] The modal slides up; above the "Over modal" card, "Screen A" and the
         "A" header stay visible.
   - [ ] The log shows exactly `Over: onWillAppear`, `Over: onDidAppear`. No
         `A` entry.

2. Tap "Clear log", then tap "Close".

   - [ ] The modal slides down.
   - [ ] The log shows exactly `Over: onWillDisappear`, `Over: onDidDisappear`,
         `Over: onDismiss`. No `A` entry.

---

### Replacing modal over a nested stack

1. Tap "Push Nested", tap "Clear log", then tap "Open replacing".

   - [ ] The modal slides up and covers the whole screen.
   - [ ] The log shows exactly `Nested: onWillDisappear`,
         `NestedHome: onWillDisappear`, `Replacing: onWillAppear`,
         `Replacing: onDidAppear`, `Nested: onDidDisappear`,
         `NestedHome: onDidDisappear`.

2. Tap "Clear log", then tap "Close".

   - [ ] The modal slides down and "Screen NestedHome" is shown under the
         "Nested" and "NestedHome" headers.
   - [ ] The log shows exactly `Replacing: onWillDisappear`,
         `Nested: onWillAppear`, `NestedHome: onWillAppear`,
         `Nested: onDidAppear`, `NestedHome: onDidAppear`,
         `Replacing: onDidDisappear`, `Replacing: onDismiss`.

3. Tap "Clear log", then tap "Open over".

   - [ ] Above the "Over modal" card, "Screen NestedHome" and both headers stay
         visible.
   - [ ] The log shows exactly `Over: onWillAppear`, `Over: onDidAppear`.

4. Tap "Close", tap the back button twice, then tap "Clear log".

   - [ ] "Screen Home" is shown under the "Home" header and the log is empty.

---

### Push under a replacing modal

1. Tap "Push A", tap "Clear log", tap "Open replacing", tap "Clear log" inside
   the modal, then tap "Push B" inside the modal.

   - [ ] The modal stays on screen and the log stays empty.

2. Tap "Close".

   - [ ] The modal slides down and "Screen B" is shown under the "B" header.
   - [ ] The log shows exactly `Replacing: onWillDisappear`, `B: onWillAppear`,
         `B: onDidAppear`, `Replacing: onDidDisappear`, `Replacing: onDismiss`.
         No `A` entry.

3. Tap "Clear log", then tap "Pop".

   - [ ] "Screen A" is shown and the log shows exactly `B: onWillDisappear`,
         `A: onWillAppear`, `B: onDidDisappear`, `A: onDidAppear`.

4. Tap "Clear log", tap "Push B in 2s", tap "Open replacing", then wait 3
   seconds.

   - [ ] The modal stays on screen; the log shows exactly
         `A: onWillDisappear`, `Replacing: onWillAppear`,
         `Replacing: onDidAppear`, `A: onDidDisappear`. No `B` entry.

5. Tap "Clear log" inside the modal, then tap "Close".

   - [ ] "Screen B" is shown and the log shows exactly
         `Replacing: onWillDisappear`, `B: onWillAppear`, `B: onDidAppear`,
         `Replacing: onDidDisappear`, `Replacing: onDismiss`.

6. Tap "Pop".

   - [ ] "Screen A" is shown.

---

### Push under an over modal

1. Tap "Clear log", tap "Open over", tap "Clear log" inside the modal, then tap
   "Push B" inside the modal.

   - [ ] Above the card, "Screen A" slides out and "Screen B" slides in under
         the "B" header; the modal stays on screen.
   - [ ] The log shows exactly `A: onWillDisappear`, `B: onWillAppear`,
         `A: onDidDisappear`, `B: onDidAppear`.

2. Tap "Clear log" inside the modal, then tap "Close".

   - [ ] "Screen B" is shown and the log shows exactly `Over: onWillDisappear`,
         `Over: onDidDisappear`, `Over: onDismiss`.

3. Tap "Pop", tap "Clear log", tap "Push B in 2s", tap "Open over", then wait 3
   seconds.

   - [ ] Above the card, "Screen B" is shown under the "B" header.
   - [ ] The log shows exactly `Over: onWillAppear`, `Over: onDidAppear`,
         `A: onWillDisappear`, `B: onWillAppear`, `A: onDidDisappear`,
         `B: onDidAppear`.

4. Tap "Close", then tap "Pop".

   - [ ] "Screen A" is shown.

---

### Modal screen popped

1. Tap "Clear log", tap "Open replacing", then tap "Pop host" inside the modal.

   - [ ] The modal disappears at once and "Screen Home" slides in under the
         "Home" header.
   - [ ] The log shows exactly `A: onWillDisappear`, `Replacing: onWillAppear`,
         `Replacing: onDidAppear`, `A: onDidDisappear`, `Home: onWillAppear`,
         `Home: onDidAppear`. No `Replacing` disappear or dismiss entry.

2. Tap "Clear log", then tap "Push A".

   - [ ] The "Replacing modal" card is shown again.
   - [ ] The log shows exactly `Home: onWillDisappear`, `A: onWillAppear`,
         `Replacing: onWillAppear`, `Home: onDidDisappear`,
         `Replacing: onDidAppear`, `A: onDidDisappear`.

3. Tap "Close", tap "Clear log", tap "Open over", then tap "Pop host" inside
   the modal.

   - [ ] The modal disappears at once and "Screen Home" slides in.
   - [ ] The log shows exactly `Over: onWillAppear`, `Over: onDidAppear`,
         `A: onWillDisappear`, `Home: onWillAppear`, `A: onDidDisappear`,
         `Home: onDidAppear`. No `Over` disappear or dismiss entry.

4. Tap "Clear log", then tap "Push A".

   - [ ] The "Over modal" card is shown again above "Screen A".
   - [ ] The log shows exactly `Home: onWillDisappear`, `A: onWillAppear`,
         `Over: onWillAppear`, `Home: onDidDisappear`, `A: onDidAppear`,
         `Over: onDidAppear`.

5. Tap "Close", tap "Pop", then tap "Clear log".

   - [ ] "Screen Home" is shown under the "Home" header and the log is empty.
