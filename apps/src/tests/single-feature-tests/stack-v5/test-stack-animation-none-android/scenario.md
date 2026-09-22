# Test Scenario: Stack Animation None (Android)

## Details

**Description:** Verify the `none` preset of the `animation` prop of
`Stack.Screen` on Android. Pass: a push and a pop swap the screens without
motion, scaling or fading and without a flash of the window background, the
predictive back gesture still pops on release and leaves the stack untouched
when cancelled, and a screen pushed with `none` can still be popped with another
preset.

**OS test creation version:** Android API Level 37.

## E2E test

Incomplete: no step is automated. For manual testing perform steps 1-8.

The absence of motion and of a window-background flash, and the interactive
predictive back gesture, are not assertable with Detox; only the resulting stack
would be.

## Prerequisites

- Android emulator or device with gesture navigation enabled.
- Run the screen directly. In `apps/App.tsx` import and render
  `TestStackAnimationNoneAndroid` as the root component instead of `Example`.
  Opened through the in-app menu, system back leaves the screen instead of
  popping the stack.
- System animations are on: "Settings → Accessibility → Color and motion →
  Remove animations" is off.

## Note

- Wait for every animation to finish before the next tap.
- With `none` nothing moves while the finger is down during a predictive back
  gesture; the swipe takes effect on release.
- "As one band" means the two screens travel together with their edges
  touching, so no window background shows between them.

## Steps

### Baseline

1. Launch the screen directly (see Prerequisites).

   - [ ] "Home" is yellow with a dark frame at the screen edge and the title
         "Home". "next push" and "this screen" both read `none`, and
         "Push Blue" and "Push Red" are the only buttons: there is no "Pop"
         button.

### Push and pop

2. Tap "Push Blue".

   - [ ] "Blue" replaces "Home" in one frame: nothing slides, scales or fades,
         and no window background shows between them.

3. On "Blue", tap "Pop".

   - [ ] "Home" replaces "Blue" in one frame, with no motion, no fading and no
         flash of the window background.

### Predictive back gesture

4. Tap "Push Blue", then swipe in from the left screen edge and release past the
   middle.

   - [ ] Nothing moves while the finger is down (see Note); on release "Home"
         replaces "Blue" and the stack is popped.

5. Tap "Push Blue", swipe in from the left screen edge to the middle, then swipe
   back to the edge and release.

   - [ ] "Blue" is still shown and nothing is popped.

### Mixed with another preset

6. On "Blue", set "this screen" to `slideFromRight`, then tap "Pop".

   - [ ] "Blue" travels out to the right across the full width while "Home"
         travels in from the left as one band (see Note), even though the push
         had no animation.

7. On "Home", set "next push" to `slideFromRight`, then tap "Push Blue".

   - [ ] Both screens travel the full width as one band.

8. On "Blue", set "this screen" to `none`, then tap "Pop".

   - [ ] "Home" replaces "Blue" in one frame with no motion, even though the
         push was animated. You end on "Home".
