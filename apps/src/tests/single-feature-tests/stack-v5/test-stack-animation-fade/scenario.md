# Test Scenario: Stack Animation Fade Presets

## Details

**Description:** Verify the fade presets of the `animation` prop of
`Stack.Screen`. Pass: `fade` crossfades the two screens without moving either
and takes the same time in both directions. On Android `fadeFromBottom` and
`fadeFromTop` move the entering or leaving screen a short distance while its
opacity changes and leave the other screen static, their pop is shorter than
their push, and all three follow the predictive back gesture. On iOS the header
back button pops with `fade`.

**OS test creation version:** iOS 18.6 and 27.2, Android API Level 37.

## E2E test

Incomplete: no step is automated. For manual testing perform all steps.

Opacity, the short travel distance, the header during the transition and the
interactive back gestures are not assertable with Detox.

## Prerequisites

- iPhone: simulator or device.
- Android emulator or device with gesture navigation enabled. The interactive
  predictive back gesture needs API 34 or newer.
- Android, for the groups whose heading says "extended animation duration
  scale" only: in Developer options set "Animator duration scale" and
  "Transition animation scale" to 5x before the first of them and back to 1x
  after the last. iOS runs every group at real speed.
- Android: run the screen directly. In `apps/App.tsx` import and render
  `TestStackAnimationFade` as the root component instead of `Example`. Opened
  through the in-app menu, system back leaves the screen instead of popping the
  stack.
- System animations are on: on Android "Settings → Accessibility → Color and
  motion → Remove animations" is off; on iOS "Settings → Accessibility → Motion
  → Reduce Motion" is off.

## Note

- Wait for every transition to finish before the next tap.
- Static: the screen does not move and stays fully visible for the whole
  transition, with no flash of the window background and no jump at the end.
- While both screens are translucent the background behind them shows through
  faintly: on Android the window background, on iOS the app's background behind
  the stack (in this example app: white in light mode, black in dark mode).
- **Known issue:** on iOS the back swipe of a `fade` screen plays the `default`
  slide (labs #2066).

## Steps

### Baseline

1. Launch the app and navigate to the **Stack Animation Fade Presets** screen
   (on Android, launch the screen directly, see Prerequisites).

   - [ ] "Home" is yellow with a dark frame at the screen edge, no visible
         header and the title "Home". "next push" and "this screen" both read
         `fade`, "next push header hidden" reads `true`, and "Push Blue" and
         "Push Red" are the only buttons: there is no "Pop" button.

---

### `fade` (on Android with extended animation duration scale)

1. Tap "Push Blue".

   - [ ] Neither frame moves. "Blue" fades in while "Home" fades out, and
         mid-way both cards are partly visible at once (see Note).

2. On "Blue", tap "Pop".

   - [ ] Neither frame moves. "Blue" fades out while "Home" fades in, over the
         same time the push took.

## Steps - Android

### `fadeFromBottom` and `fadeFromTop` (with extended animation duration scale)

1. On "Home", set "next push" to `fadeFromBottom`, then tap "Push Blue".

   - [ ] "Blue" rises a short distance, about a twelfth of the height, while
         fading in and slowing towards the end. "Home" is static (see Note).

2. On "Blue", tap "Pop".

   - [ ] "Blue" sinks back the same short distance while fading out, over less
         time than the push took. "Home" is static.

3. On "Home", set "next push" to `fadeFromTop`, then tap "Push Blue".

   - [ ] Mirrored vertically: "Blue" drops in from the same short distance above
         while fading in. "Home" is static.

4. On "Blue", tap "Pop".

   - [ ] "Blue" rises the same short distance while fading out, again over less
         time than the push took. "Home" is static.

---

### Predictive back gesture

1. On "Home", set "next push" to `fade`, tap "Push Blue", then swipe in from the
   left screen edge and release past the middle.

   - [ ] The opacity of both screens follows the finger and neither frame moves;
         on release the crossfade completes from that position and only "Home"
         is shown.

2. Tap "Push Blue", swipe in from the left screen edge to the middle, then swipe
   back to the edge and release.

   - [ ] "Blue" returns to fully opaque, "Home" is hidden again and nothing is
         popped.

3. On "Blue", tap "Pop".

   - [ ] "Blue" fades out while "Home" fades in, with neither frame moving.

4. On "Home", set "next push" to `fadeFromBottom`, tap "Push Blue", then swipe
   in from the left screen edge and release past the middle.

   - [ ] "Blue" sinks steadily from the start of the swipe and its fade joins
         partway through; on release the pop completes from that position and
         only "Home" is shown.

5. Tap "Push Blue", swipe in from the left screen edge to the middle, then
   swipe back to the edge and release.

   - [ ] "Blue" returns to rest, fully opaque and with no residual offset, and
         nothing is popped.

6. On "Blue", tap "Pop".

   - [ ] "Blue" sinks the short distance while fading out, leaving you on
         "Home".

## Steps - iOS

### Header

1. On "Home", set "next push header hidden" to `false`, then tap "Push Blue".

   - [ ] "Blue" fades in over "Home" and the header with the title "Blue" and a
         back button fades in over the same time.

2. On "Blue", tap "Push Red".

   - [ ] "Red" fades in over "Blue". The header stays visible and shows "Red"
         and a back button by the end of the transition, with nothing left
         over.

3. Tap the back button in the header.

   - [ ] "Red" fades out while "Blue" fades in, with neither frame moving. The
         header shows "Blue" by the end of the transition.

4. On "Blue", tap "Pop".

   - [ ] "Blue" fades out while "Home" fades in and the header fades out over
         the same time.

---

### Back swipe

1. Tap "Push Blue", then swipe in from the left screen edge and release past
   the middle.

   - [ ] "Blue" follows the finger and slides out to the right while "Home"
         comes in from the left behind it (see Note).
