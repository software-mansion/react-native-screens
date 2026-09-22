# Test Scenario: Stack Animation Update (Android)

## Details

**Description:** Verify that changing the `animation` prop of a `Stack.Screen`
that is already on the stack takes effect. Pass: the next pop of that screen
plays the new value, both with the "Pop" button and with the predictive back
gesture, and a value changed on a covered screen governs only that screen's own
pop.

**OS test creation version:** Android API Level 37.

## E2E test

Incomplete: no step is automated. For manual testing perform steps 1-9.

The direction a screen moves in and the interactive predictive back gesture
are not assertable with Detox.

## Prerequisites

- Android emulator or device with gesture navigation enabled.
- Run the screen directly. In `apps/App.tsx` import and render
  `TestStackAnimationUpdateAndroid` as the root component instead of `Example`.
  Opened through the in-app menu, system back leaves the screen instead of
  popping the stack.
- System animations are on: "Settings → Accessibility → Color and motion →
  Remove animations" is off.

## Note

- Static: the screen does not move at all and stays fully visible for the whole
  transition.

## Steps

### Baseline

1. Launch the screen directly (see Prerequisites).

   - [ ] The screen is yellow, reads "Name: Home", "this screen" reads
         `slideFromRight` and "Push Blue" is the only button.

---

### Change on the top screen

2. Tap "Push Blue", set "this screen" to `slideFromBottom`, then swipe in from
   the left screen edge and release past the middle.

   - [ ] "Blue" sinks to the bottom edge and "Home" is static.

3. Tap "Push Blue", set "this screen" to `slideFromLeft`, then tap "Pop".

   - [ ] "Blue" slides out to the left and "Home" slides in from the right.

4. Tap "Push Blue", set "this screen" to `slideFromTop`, then back to
   `slideFromRight`, and tap "Pop".

   - [ ] "Blue" slides out to the right and "Home" slides in from the left.

---

### Change on a covered screen

5. Tap "Push Blue", set "this screen" to `slideFromTop`, then tap "Push Red".

   - [ ] "Red" slides in from the right and "Blue" slides out to the left.

6. On "Red", tap "Pop".

   - [ ] "Red" slides out to the right and "Blue" slides in from the left.

7. On "Blue", tap "Pop".

   - [ ] "Blue" rises out through the top edge and "Home" is static.

---

### Change after a native pop

8. Tap "Push Blue", tap "Push Red", then swipe in from the left screen edge and
   release past the middle.

   - [ ] "Red" slides out to the right and "Blue" slides in from the left.

9. On "Blue", set "this screen" to `slideFromBottom`, then swipe in from the
   left screen edge and release past the middle.

   - [ ] "Blue" sinks to the bottom edge and "Home" is static.
