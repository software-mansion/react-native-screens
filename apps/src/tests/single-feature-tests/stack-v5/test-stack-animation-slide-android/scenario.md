# Test Scenario: Stack Animation Slide Presets (Android)

## Details

**Description:** Verify the four slide presets of the `animation` prop of
`Stack.Screen` on Android. Pass: `slideFromRight` and `slideFromLeft` move both
screens the full width in the same direction, `slideFromBottom` and
`slideFromTop` move only the screen that enters or leaves, every preset reverses
on pop and follows the predictive back gesture, and none of them mirrors when
the host's layout direction is `rtl`, which the "START"/"END" row reports.

**OS test creation version:** Android API Level 37.

## E2E test

Incomplete: no step is automated. For manual testing perform steps 1-16.

The direction a screen moves in, whether the other screen moves with it and the
interactive predictive back gesture are not assertable with Detox.

## Prerequisites

- Android emulator or device with gesture navigation enabled.
- The interactive predictive back gesture needs API 34 or newer.
- Run the screen directly. In `apps/App.tsx` import and render
  `TestStackAnimationSlideAndroid` as the root component instead of `Example`.
  Opened through the in-app menu, system back leaves the screen instead of
  popping the stack.
- System animations are on: "Settings → Accessibility → Color and motion →
  Remove animations" is off.

## Note

- Wait for every animation to finish before the next tap.
- "Static" means the screen does not move at all and stays fully visible for
  the whole transition, with no flash of the window background and no jump at
  the end.
- "As one band" means the two screens travel together with their edges
  touching, so no window background shows between them.

## Steps

### Baseline

1. Launch the screen directly (see Prerequisites).

   - [ ] "Home" is yellow with a dark frame at the screen edge and the title
         "Home". "next push" and "this screen" both read `slideFromRight`,
         "direction" reads `ltr` with "START" on the left and "END" on the right
         of the row below it, and "Push Blue" and "Push Red" are the only
         buttons: there is no "Pop" button.

### `slideFromRight` and `slideFromLeft`

2. Tap "Push Blue".

   - [ ] "Blue" travels in from the right edge across the full width while
         "Home" travels out to the left by the same distance, as one band (see
         Note).

3. On "Blue", tap "Pop".

   - [ ] "Blue" travels out to the right across the full width while "Home"
         travels back in from the left, as one band.

4. On "Home", set "next push" to `slideFromLeft`, then tap "Push Blue".

   - [ ] Mirrored: "Blue" enters from the left edge and "Home" leaves to the
         right, as one band.

5. On "Blue", tap "Pop".

   - [ ] "Blue" leaves to the left and "Home" returns from the right, as one
         band.

### `slideFromBottom` and `slideFromTop`

6. On "Home", set "next push" to `slideFromBottom`, then tap "Push Blue".

   - [ ] "Blue" rises from the bottom edge across the full height, drawn above
         "Home", which is static (see Note).

7. On "Blue", tap "Pop".

   - [ ] "Blue" sinks back out through the bottom edge, drawn above "Home",
         which is static.

8. On "Home", set "next push" to `slideFromTop`, then tap "Push Blue".

   - [ ] Mirrored vertically: "Blue" drops in from the top edge across the full
         height and "Home" is static.

9. On "Blue", tap "Pop".

   - [ ] "Blue" rises back out through the top edge and "Home" is static.

### Predictive back gesture

10. On "Home", set "next push" to `slideFromRight`, tap "Push Blue", then swipe
    in from the left screen edge and release past the middle.

    - [ ] "Blue" follows the finger to the right and "Home" is revealed from
          the left at the same rate, as one band; on release the band continues
          from that position until only "Home" is shown.

11. Tap "Push Blue", swipe in from the left screen edge to the middle, then
    swipe back to the edge and release.

    - [ ] "Blue" returns to rest with no residual offset, "Home" is hidden
          again and nothing is popped.

12. On "Blue", tap "Pop".

    - [ ] "Blue" travels out to the right across the full width while "Home"
          travels back in from the left, as one band.

### Layout direction

13. Set "direction" to `rtl`.

    - [ ] "START" moves to the right of the row and "END" to the left. The card,
          the pickers and the buttons are centred, so they stay where they are.

14. Tap "Push Blue".

    - [ ] "Blue" still enters from the right edge and "Home" still leaves to the
          left.

15. On "Blue", tap "Pop".

    - [ ] "Blue" travels out to the right and "Home" returns from the left, the
          same way as under `ltr`.

16. Set "direction" to `ltr`.

    - [ ] "START" returns to the left of the row and "END" to the right. You end
          on "Home" with "direction" reading `ltr`.
