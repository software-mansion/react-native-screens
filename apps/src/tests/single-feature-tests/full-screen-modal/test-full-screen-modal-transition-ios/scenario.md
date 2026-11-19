# Test Scenario: Full Screen Modal Transition

## Details

**Description:** Verify the `transition` prop of
`FullScreenModalReplacingContent` and `FullScreenModalOverContent`: each value
animates both the opening and the closing, and a value changed while the modal
is open applies from the next opening.

**OS test creation version:** iOS 26.5.

## E2E test

Incomplete: all steps are not automated. For manual testing perform all steps.

Animations are not assertable with Detox.

## Prerequisites

- iPhone: device or simulator.

## Note

- Wait for every animation to finish before the next tap.
- Slide up: the modal moves in from the bottom edge and moves out the same way.
- To pick a value, tap the picker and then the value.

## Steps

### Baseline

1. Launch the app and navigate to the **Full Screen Modal Transition** screen.

   - [ ] "Presenter screen" is shown with "Replacing transition: automatic" and
         "Over transition: automatic".

---

### Replacing modal

1. Tap "Open replacing", then tap "Close".

   - [ ] "Replacing modal" slides up on open and slides down on close.

2. Set "Replacing transition" to `fade`, tap "Open replacing", then tap
   "Close".

   - [ ] The modal cross-fades in and out, without moving; the presenter shows
         through while the modal fades in.

3. Set "Replacing transition" to `flip`, tap "Open replacing", then tap
   "Close".

   - [ ] The screen flips horizontally around its vertical axis to show the
         modal, and flips back on close; the background behind the flip is
         black.

4. Set "Replacing transition" to `none`, tap "Open replacing", then tap
   "Close".

   - [ ] The modal appears and disappears at once, without an animation.

---

### Over modal

1. Tap "Open over", then tap "Close".

   - [ ] "Over modal" slides up on open and slides down on close; "Presenter
         screen" stays visible behind it.

2. Set "Over transition" to `fade`, tap "Open over", then tap "Close".

   - [ ] The modal cross-fades in and out, without moving.

3. Set "Over transition" to `none`, tap "Open over", then tap "Close".

   - [ ] The modal appears and disappears at once, without an animation.

4. Tap "Over transition".

   - [ ] The values are `automatic`, `fade` and `none`; `flip` is not offered.

---

### Change while open

1. Set "Replacing transition" to `automatic`, then tap "Open replacing".
   Inside "Replacing modal", set "Replacing transition" to `fade`, then tap
   "Close".

   - [ ] The modal slides down; it does not fade.

2. Tap "Open replacing", then tap "Close".

   - [ ] The modal cross-fades in and out.
