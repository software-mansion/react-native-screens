# Test Scenario: Stack Change During Swipe

## Details

**Description:** Verify a push or pop that the app makes while a back swipe
is held. Pass: nothing changes under the finger, the swipe ends the way the
finger releases it, then the change plays, and later back swipes show every
screen in order.

**OS test creation version:** iOS 18.6 and 27.2.

## E2E test

Incomplete: no step is automated. For manual testing perform all steps.

A held swipe is not available in Detox.

## Prerequisites

- iPhone: simulator or device.
- "Settings → Accessibility → Motion → Reduce Motion" is off.

## Note

- "Timer" counts down from 3 after a timer button is tapped and reads `done`
  when the app makes the change.
- Wait for every transition to finish before the next action.

## Steps

### Baseline

1. Launch the app and navigate to the **Stack Change During Swipe** screen.

   - [ ] "Home" is shown.

---

### Push, swipe released to go back

1. Tap "Push Blue", tap "Push Red in 3 s", then swipe from the left screen
   edge to three quarters of the screen width and hold the finger still until
   "Timer" reads `done`.

   - [ ] "Blue" follows the finger, with "Home" visible to its left.
   - [ ] "Red" does not appear while the finger is down.

2. Release the finger.

   - [ ] "Blue" slides out to the right, then "Red" slides in from the right.

3. Swipe from the left screen edge to the right screen edge and release.

   - [ ] "Home" is shown.

---

### Push, swipe released to stay

1. Tap "Push Blue", tap "Push Red in 3 s", then swipe from the left screen
   edge to a quarter of the screen width and hold the finger still until
   "Timer" reads `done`.

   - [ ] "Blue" follows the finger and "Red" does not appear.

2. Release the finger.

   - [ ] "Blue" slides back to the left edge, then "Red" slides in from the
         right.

3. Swipe from the left screen edge to the right screen edge and release.

   - [ ] "Blue" is shown.

---

### Pop, swipe released to stay

1. Tap "Pop in 3 s", then swipe from the left screen edge to a quarter of the
   screen width and hold the finger still until "Timer" reads `done`.

   - [ ] "Blue" follows the finger and stays on screen.

2. Release the finger.

   - [ ] "Blue" slides back to the left edge, then slides out to the right.
   - [ ] "Home" is shown.

---

### Two pushes, swipe released to stay

1. Tap "Push Blue", tap "Push Red and Green in 3 s", then swipe from the left
   screen edge to a quarter of the screen width and hold the finger still
   until "Timer" reads `done`.

   - [ ] "Blue" follows the finger; neither "Red" nor "Green" appears.

2. Release the finger.

   - [ ] "Blue" slides back to the left edge, then "Green" slides in from the
         right.

3. Swipe from the left screen edge to the right screen edge and release.

   - [ ] "Red" is shown.

4. Swipe from the left screen edge to the right screen edge and release, 2
   times.

   - [ ] "Home" is shown.
