# Test Scenario: Lifecycle Events

## Details

**Description:** Verify the lifecycle events of a contained modal:
`onWillAppear` and `onDidAppear` must fire (in that order) when the modal is
presented, and `onWillDisappear` and `onDidDisappear` must fire when it is
dismissed programmatically. Also verify the suspension semantics of a stack
screen pushed over the open modal, and that opening a modal while another one
occupies the shared provider is rejected (`onPresentationRejected`) at once,
for both the over-content and the replacing-content variant.

**OS test creation version:** iOS: 26.5.

## E2E test

TBD: an e2e spec is planned once the contained modal API is stable.

## Prerequisites

- iPhone: device or simulator.

## Note

- The modal presents and dismisses with a cross-dissolve; wait for the animation
  to finish before reading the log.
- **Known issue:** when the modal is suspended (another screen is pushed on top
  of the screen hosting the modal), `onDidDisappear` is not called.

## Steps

### Baseline

1. Launch the app and navigate to the **Lifecycle Events** screen
   (ContainedModal group).

   - [ ] The provider box shows "Provider area", the variant button reads
         "Variant: over content", the log is empty.

---

### Presentation and suspension

1. Tap "Open modal" and wait for the modal to present over the provider box.

   - [ ] The log shows exactly two new entries, in order: `onWillAppear`,
         `onDidAppear`.

2. Tap "Push screen over". On the pushed screen verify "Modal isOpen: true",
   then tap "Pop".

   - [ ] After popping, the modal is still presented over the provider box.

   - [ ] The log shows `onWillDisappear` for the push and no `onDidDisappear`
         (see Note), then `onWillAppear` and `onDidAppear` for the restore.

---

### Rejection while over content

1. With the modal still open, tap "Open second modal".

   - [ ] The dark-red second modal does NOT appear; the first modal stays
         presented.

   - [ ] The log shows exactly one new entry:
         `onPresentationRejected (second modal)`, and no appearance events for
         the second modal.

2. Tap "Dismiss from JS" inside the modal and wait for it to dismiss.

   - [ ] The modal dismisses; the provider content is visible again.

   - [ ] The log shows exactly two new entries, in order: `onWillDisappear`,
         `onDidDisappear`.

3. Tap "Open second modal".

   - [ ] The dark-red modal presents; the log shows
         `onWillAppear (second modal)` and `onDidAppear (second modal)`, no
         rejection entry.

4. With the second modal still open, tap "Open modal".

   - [ ] The first modal does NOT appear; the dark-red second modal stays
         presented.

   - [ ] The log shows exactly one new entry: `onPresentationRejected` (for the
         first modal).

5. Tap "Dismiss second modal".

   - [ ] The dark-red modal dismisses; the log shows
         `onWillDisappear (second modal)` and `onDidDisappear (second modal)`.

---

### Rejection while replacing content

1. Tap "Clear Logs", tap "Variant: over content", then tap "Open modal".

   - [ ] The variant button reads "Variant: replacing content".

   - [ ] The modal fills the provider box and "Provider area" is not visible
         through it.

   - [ ] The log shows exactly two entries, in order: `onWillAppear`,
         `onDidAppear`.

2. With the modal still open, tap "Open second modal".

   - [ ] The dark-red second modal does NOT appear; the first modal stays
         presented.

   - [ ] `onPresentationRejected (second modal)` appears in the log right
         after the tap, while the first modal is still presented.

3. Tap "Push screen over", tap "Pop", then tap "Open second modal".

   - [ ] After popping, the modal is still presented over the provider box.

   - [ ] A new `onPresentationRejected (second modal)` entry appears right
         after the tap; the dark-red modal does NOT appear.

4. Tap "Dismiss from JS" inside the modal and wait for it to dismiss.

   - [ ] The modal dismisses; "Provider area" is visible again.

   - [ ] The log ends with `onWillDisappear`, `onDidDisappear`, and no
         `onPresentationRejected (second modal)` entry follows them.

5. Tap "Open second modal".

   - [ ] The dark-red modal presents; the log shows
         `onWillAppear (second modal)` and `onDidAppear (second modal)`, no
         rejection entry.

6. With the second modal still open, tap "Open modal".

   - [ ] The replacing modal does NOT appear; the dark-red second modal stays
         presented.

   - [ ] The log shows exactly one new entry: `onPresentationRejected`.

7. Tap "Dismiss second modal", then tap "Variant: replacing content".

   - [ ] The dark-red modal dismisses; the log shows
         `onWillDisappear (second modal)` and `onDidDisappear (second modal)`.

   - [ ] The variant button reads "Variant: over content".
