# Test Scenario: Stack Animation iOS Presets (Android)

## Details

**Description:** Verify the two iOS presets of the `animation` prop of
`Stack.Screen` on Android. Pass: the incoming screen travels the full width on
top while the covered screen recedes about a third of the width and darkens, the
pop reverses both, and the revealed screen carries no tint once a pop, a
cancelled predictive back gesture or a committed one has finished.

**OS test creation version:** Android API Level 37.

## E2E test

Incomplete: no step is automated. For manual testing perform steps 1-11.

The tint, the travel distances, the draw order and the interactive predictive
back gesture are not assertable with Detox.

## Prerequisites

- Android emulator or device with gesture navigation enabled.
- The interactive predictive back gesture needs API 34 or newer.
- Developer options, for steps 2-7 only: set "Animator duration scale" and
  "Transition animation scale" to 10x before step 2 and back to 1x after step 7.
  At 1x these transitions are 200 ms long and the tint, which exists only while
  one is running, cannot be compared against a swatch by eye.
- Run the screen directly. In `apps/App.tsx` import and render
  `TestStackAnimationIOSAndroid` as the root component instead of `Example`.
  Opened through the in-app menu, system back leaves the screen instead of
  popping the stack.
- System animations are on: "Settings → Accessibility → Color and motion →
  Remove animations" is off.

## Note

- Wait for every transition to finish before the next tap.
- As one band: the two screens travel together with their edges touching, so no
  window background shows between them.

## Steps

### Baseline

1. Launch the screen directly (see Prerequisites).

   - [ ] "Home" is yellow with a dark frame at the screen edge, the title
         "Home" and a yellow, blue and red swatch stacked flush with each side
         edge. "next push" and "this screen" both read `iosFromRight`, and
         "Push Blue" and "Push Red" are the only buttons: there is no "Pop"
         button. The card is white, not grey.

---

### `iosFromRight` (with extended animation duration scale)

2. Tap "Push Blue".

   - [ ] "Blue" travels in from the right edge across the full width, drawn
         above "Home". "Home" moves left by about a third of the width and takes
         on a tint (see Note) as it recedes: its yellow is visibly darker than
         the yellow swatch at "Blue"'s left edge, right beside it.

3. On "Blue", tap "Pop".

   - [ ] "Blue" travels out to the right, drawn above "Home". "Home" returns
         from a third of the width to the left and its tint lifts as it goes: by
         the time "Blue" reaches the right edge "Home"'s yellow matches the
         yellow swatch at "Blue"'s left edge, and its card is white, not grey.

---

### `iosFromLeft` (with extended animation duration scale)

4. On "Home", set "next push" to `iosFromLeft`, then tap "Push Blue".

   - [ ] Mirrored: "Blue" enters from the left edge across the full width on
         top, and "Home" recedes about a third of the width to the right and
         takes on a tint: its yellow is darker than the yellow swatch at
         "Blue"'s right edge.

5. On "Blue", tap "Pop".

   - [ ] "Blue" leaves to the left on top and "Home" returns from the right: by
         the time "Blue" reaches the left edge "Home"'s yellow matches the
         yellow swatch at "Blue"'s right edge, and its card is white, not grey.

---

### A preset changed before the pop (with extended animation duration scale)

6. On "Home", set "next push" to `slideFromRight`, then tap "Push Blue".

   - [ ] Both screens travel the full width as one band and "Home" takes on no
         tint: its yellow stays identical to the yellow swatch at "Blue"'s left
         edge for the whole push.

7. On "Blue", set "this screen" to `iosFromRight`, then tap "Pop".

   - [ ] "Blue" leaves to the right on top while "Home" returns from a third of
         the width to the left: "Home"'s yellow starts darker than the yellow
         swatch at "Blue"'s left edge and matches it by the end of the pop.

---

### Predictive back gesture and the tint

8. On "Home", set "next push" to `iosFromRight`, tap "Push Blue", then swipe in
   from the left screen edge and hold at the middle.

   - [ ] "Home" is revealed on the left and moves with the finger, and its tint
         lightens as "Blue" is dragged further right: its yellow closes on the
         yellow swatch at "Blue"'s left edge.

9. Swipe back to the edge and release.

   - [ ] "Blue" returns to rest with no residual offset, "Home" is hidden again
         and nothing is popped.

10. On "Blue", tap "Pop".

    - [ ] "Home"'s yellow matches the yellow swatch at "Blue"'s left edge by
          the time "Blue" leaves, and once the pop has finished "Home"'s card is
          white, not grey: no veil is left behind.

11. Tap "Push Blue", swipe in from the left screen edge and release past the
    middle.

    - [ ] The pop completes from the position the finger was released at, and
          "Home" ends untinted: its card is white, not grey.
