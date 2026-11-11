# Test Scenario: Stack Animation Update

## Details

**Description:** Verify that changing the `animation` prop of a `Stack.Screen`
that is already on the stack takes effect. Pass: the next pop of that screen
plays the new value, both with the "Pop" button and, on Android, with the
predictive back gesture, and a value changed on a covered screen governs only
that screen's own pop.

**OS test creation version:** iOS 18.6 and 27.2, Android API Level 37.

## E2E test

Incomplete: no step is automated. For manual testing perform all steps.

The direction a screen moves in and the interactive back gestures are not
assertable with Detox.

## Prerequisites

- iPhone: simulator or device.
- Android emulator or device with gesture navigation enabled.
- Android: run the screen directly. In `apps/App.tsx` import and render
  `TestStackAnimationUpdate` as the root component instead of `Example`. Opened
  through the in-app menu, system back leaves the screen instead of popping the
  stack.
- System animations are on: on Android "Settings → Accessibility → Color and
  motion → Remove animations" is off; on iOS "Settings → Accessibility → Motion
  → Reduce Motion" is off.

## Note

- Static: the screen does not move at all and stays fully visible for the whole
  transition.
- **Known issue:** on iOS the back swipe plays the `default` slide, whatever
  the `animation` of the screen (labs #2066).

## Steps

### Baseline

1. Launch the app and navigate to the **Stack Animation Update** screen (on
   Android, launch the screen directly, see Prerequisites).

   - [ ] The screen is yellow, reads "Name: Home", "this screen" reads
         `slideFromRight` and "Push Blue" is the only button.

---

### Change on the top screen

1. Tap "Push Blue", set "this screen" to `slideFromBottom`, then swipe in from
   the left screen edge and release past the middle.

   - [ ] Android: "Blue" sinks to the bottom edge and "Home" is static.
   - [ ] iOS: "Blue" slides out to the right and "Home" comes in from the left
         behind it (see Note).

2. Tap "Push Blue", set "this screen" to `slideFromLeft`, then tap "Pop".

   - [ ] "Blue" slides out to the left and "Home" slides in from the right.

3. Tap "Push Blue", set "this screen" to `slideFromTop`, then back to
   `slideFromRight`, and tap "Pop".

   - [ ] "Blue" slides out to the right and "Home" slides in from the left.

---

### Change on a covered screen

1. Tap "Push Blue", set "this screen" to `slideFromTop`, then tap "Push Red".

   - [ ] "Red" slides in from the right and "Blue" slides out to the left.

2. On "Red", tap "Pop".

   - [ ] "Red" slides out to the right and "Blue" slides in from the left.

3. On "Blue", tap "Pop".

   - [ ] "Blue" rises out through the top edge and "Home" is static.

---

### Change after a native pop

1. Tap "Push Blue", tap "Push Red", then swipe in from the left screen edge and
   release past the middle.

   - [ ] "Red" slides out to the right and "Blue" slides in from the left.

2. On "Blue", set "this screen" to `slideFromBottom`, then swipe in from the
   left screen edge and release past the middle.

   - [ ] Android: "Blue" sinks to the bottom edge and "Home" is static.
   - [ ] iOS: "Blue" slides out to the right and "Home" comes in from the left
         behind it (see Note).
