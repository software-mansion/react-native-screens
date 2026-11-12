# Test Scenario: Full Screen Modal Orientation

## Details

**Description:** Verify the `orientation` prop of
`FullScreenModalReplacingContent` and `FullScreenModalOverContent`: a modal
limited to one orientation rotates the screen when it opens or when the value
changes while it is open, `inherit` follows the orientations the app supports,
and after the modal closes the presenter follows the device again.

**OS test creation version:** iOS 26.5.

## E2E test

Incomplete: all steps are not automated. For manual testing perform all steps.

The interface orientation is not assertable with Detox.

## Prerequisites

- iPhone: device or simulator, held in portrait at the start.

## Note

- Wait for every animation and rotation to finish before the next action.
- On a simulator, rotate the device with Device > Rotate Left and Device >
  Rotate Right.
- To pick a value, tap the picker and then the value.

## Steps

### Baseline

1. Launch the app and navigate to the **Full Screen Modal Orientation**
   screen.

   - [ ] "Presenter screen" is shown in portrait with "Modal orientation:
         inherit".

---

### Inherit

1. Tap "Open replacing", then rotate the device to landscape.

   - [ ] "Replacing modal" rotates to landscape.

2. Rotate the device back to portrait, then tap "Close".

   - [ ] "Presenter screen" is shown in portrait.

---

### Landscape-only modal

1. Set "Modal orientation" to `landscape`, then tap "Open replacing".

   - [ ] The screen rotates to landscape while "Replacing modal" opens, with
         the device still in portrait.

2. Rotate the device to landscape, then back to portrait.

   - [ ] "Replacing modal" stays in landscape.

3. Tap "Close".

   - [ ] "Presenter screen" is shown in portrait right after the modal closes.

4. Tap "Open over".

   - [ ] The screen rotates to landscape while "Over modal" opens.
   - [ ] "Presenter screen" behind the modal is also laid out in landscape.

5. Tap "Close".

   - [ ] "Presenter screen" is shown in portrait right after the modal closes.

---

### Change while open

1. Set "Modal orientation" to `portrait`, then tap "Open replacing".

   - [ ] "Replacing modal" opens in portrait.

2. Inside "Replacing modal", set "Modal orientation" to `landscape`.

   - [ ] The screen rotates to landscape.

3. Set "Modal orientation" to `portrait`.

   - [ ] The screen rotates back to portrait.

4. Set "Modal orientation" to `inherit`, then tap "Close".

   - [ ] "Presenter screen" is shown in portrait with "Modal orientation:
         inherit".
