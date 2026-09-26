# Test Scenario: Stack Animation Fade Presets (Android)

## Details

**Description:** Verify the three fade presets of the `animation` prop of
`Stack.Screen` on Android. Pass: `fade` crossfades the two screens without
moving either and takes the same time in both directions, `fadeFromBottom` and
`fadeFromTop` move the entering or leaving screen a short distance while its
opacity changes and leave the other screen static, their pop is shorter than
their push, and all three follow the predictive back gesture.

**OS test creation version:** Android API Level 37.

## E2E test

Incomplete: no step is automated. For manual testing perform steps 1-13.

Opacity, the short travel distance and the interactive predictive back gesture
are not assertable with Detox.

## Prerequisites

- Android emulator or device with gesture navigation enabled.
- The interactive predictive back gesture needs API 34 or newer.
- Developer options, for steps 2-7 only: set "Animator duration scale" and
  "Transition animation scale" to 5x before step 2 and back to 1x after step 7.
- Run the screen directly. In `apps/App.tsx` import and render
  `TestStackAnimationFadeAndroid` as the root component instead of `Example`.
  Opened through the in-app menu, system back leaves the screen instead of
  popping the stack.
- System animations are on: "Settings → Accessibility → Color and motion →
  Remove animations" is off.

## Note

- Wait for every transition to finish before the next tap.
- Static: the screen does not move and stays fully visible for the whole
  transition, with no flash of the window background and no jump at the end.
- While both screens are translucent the window background shows through
  faintly.

## Steps

### Baseline

1. Launch the screen directly (see Prerequisites).

   - [ ] "Home" is yellow with a dark frame at the screen edge and the title
         "Home". "next push" and "this screen" both read `fade`, and
         "Push Blue" and "Push Red" are the only buttons: there is no "Pop"
         button.

---

### `fade` (with extended animation duration scale)

2. Tap "Push Blue".

   - [ ] Neither frame moves. "Blue" fades in while "Home" fades out, and
         mid-way both cards are partly visible at once (see Note).

3. On "Blue", tap "Pop".

   - [ ] Neither frame moves. "Blue" fades out while "Home" fades in, over the
         same time the push took.

---

### `fadeFromBottom` and `fadeFromTop` (with extended animation duration scale)

4. On "Home", set "next push" to `fadeFromBottom`, then tap "Push Blue".

   - [ ] "Blue" rises a short distance, about a twelfth of the height, while
         fading in and slowing towards the end. "Home" is static (see Note).

5. On "Blue", tap "Pop".

   - [ ] "Blue" sinks back the same short distance while fading out, over less
         time than the push took. "Home" is static.

6. On "Home", set "next push" to `fadeFromTop`, then tap "Push Blue".

   - [ ] Mirrored vertically: "Blue" drops in from the same short distance above
         while fading in. "Home" is static.

7. On "Blue", tap "Pop".

   - [ ] "Blue" rises the same short distance while fading out, again over less
         time than the push took. "Home" is static.

---

### Predictive back gesture

8. On "Home", set "next push" to `fade`, tap "Push Blue", then swipe in from the
   left screen edge and release past the middle.

   - [ ] The opacity of both screens follows the finger and neither frame moves;
         on release the crossfade completes from that position and only "Home"
         is shown.

9. Tap "Push Blue", swipe in from the left screen edge to the middle, then swipe
   back to the edge and release.

   - [ ] "Blue" returns to fully opaque, "Home" is hidden again and nothing is
         popped.

10. On "Blue", tap "Pop".

    - [ ] "Blue" fades out while "Home" fades in, with neither frame moving.

11. On "Home", set "next push" to `fadeFromBottom`, tap "Push Blue", then swipe
    in from the left screen edge and release past the middle.

    - [ ] "Blue" sinks steadily from the start of the swipe and its fade joins
          partway through; on release the pop completes from that position and
          only "Home" is shown.

12. Tap "Push Blue", swipe in from the left screen edge to the middle, then
    swipe back to the edge and release.

    - [ ] "Blue" returns to rest, fully opaque and with no residual offset, and
          nothing is popped.

13. On "Blue", tap "Pop".

    - [ ] "Blue" sinks the short distance while fading out, leaving you on
          "Home".
