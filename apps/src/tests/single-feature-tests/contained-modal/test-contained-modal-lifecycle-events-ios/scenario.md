# Test Scenario: Lifecycle Events

## Details

**Description:** Verify the lifecycle events of `ContainedModalOverContent`:
`onWillAppear` and `onDidAppear` must fire (in that order) when the modal is
presented, and `onWillDisappear` and `onDidDisappear` must fire when it is
dismissed programmatically. Also verify the suspension semantics of a stack
screen pushed over the open modal, and that opening either modal while the other
occupies the shared provider is rejected (`onPresentationRejected`).

**OS test creation version:** iOS: 26.5.

## E2E test

TBD.

## Prerequisites

- iPhone: device or simulator.

## Note

- The modal presents and dismisses with a cross-dissolve; wait for the animation
  to finish before reading the log.
- Currently, when the modal is suspended (for instance, another screen is pushed
  on top of the screen hosting the modal), `onDidDisappear` is not called

## Steps

1. Launch the app and navigate to the **Lifecycle Events** screen
   (ContainedModal group).

2. Tap "Open modal" and wait for the modal to present over the provider box.

   - [ ] The log shows exactly two new entries, in order: `onWillAppear`,
         `onDidAppear`.
   
3. With the modal open, tap "Push screen over". On the pushed screen verify
   "Modal isOpen: true", then tap "Pop".

   - [ ] After popping, the modal is still presented over the provider box.
   
   - [ ] The log shows `onWillDisappear` for the push (and NO `onDidDisappear` —
         the stack detaches the views before the disappearance transition
         completes), then `onWillAppear` and `onDidAppear` for the restore.

4. With the modal still open, tap "Open second modal".

   - [ ] The dark-red second modal does NOT appear; the first modal stays
         presented.
   
   - [ ] The log shows exactly one new entry:
         `onPresentationRejected (second modal)` — and no appearance events for
         the second modal

5. Tap "Dismiss from JS" inside the modal and wait for it to dismiss.

   - [ ] The modal dismisses; the provider content is visible again.
   
   - [ ] The log shows exactly two new entries, in order: `onWillDisappear`,
         `onDidDisappear`.

6. With no modal open, tap "Open second modal".

   - [ ] The dark-red modal presents; the log shows
         `onWillAppear (second modal)` and `onDidAppear (second modal)`, no
         rejection entry.

7. With the second modal still open, tap "Open modal".

   - [ ] The first modal does NOT appear; the dark-red second modal stays
         presented.
   - [ ] The log shows exactly one new entry: `onPresentationRejected` (for the
         first modal) — the rejection handling is symmetric between the two
         modals.

8. Tap "Dismiss second modal".

   - [ ] The dark-red modal dismisses; the log shows
         `onWillDisappear (second modal)` and `onDidDisappear (second modal)`.
