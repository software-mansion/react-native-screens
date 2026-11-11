# Test Scenario: Stack Animation Custom Motions (Android)

## Details

**Description:** Verify an `animation` prop of `Stack.Screen` on Android where a
screen's motion is written as tracks, one per animated property. Pass: each
track moves its property between its endpoints for its own duration, an
omitted endpoint is the property's rest value, a dim scrim tints the screen it
is written on, and an invalid track plays `default` instead. Presets used as a
screen's motion are covered by `test-stack-animation-preset-composition-android`.

**OS test creation version:** Android API Level 37.

## E2E test

Incomplete: no step is automated. For manual testing perform all steps.

Which screen moves, in which direction, for how long, the scrim and the
interactive predictive back gesture are not assertable with Detox.

## Prerequisites

- Android emulator or device with gesture navigation enabled, on API 34 or
  newer.
- Run the screen directly. In `apps/App.tsx` import and render
  `TestStackAnimationCustomMotionsAndroid` as the root component instead of
  `Example`. Opened through the in-app menu, system back leaves the screen
  instead of popping the stack.
- System animations are on: "Settings → Accessibility → Color and motion →
  Remove animations" is off.

## Note

- Wait for every transition to finish before the next tap.
- Static: the screen does not move and stays fully visible for the whole
  transition.
- "next push" applies to every screen pushed from then on; "this screen"
  changes how the current screen is popped.

## Steps

### Baseline

1. Launch the screen directly (see Prerequisites).

   - [ ] "Home" is yellow with the title "Home", "next push" and "this screen"
         both read `iosFromRight linear 2000 ms`, and there is no "Pop" button.

---

### A preset rebuilt from tracks

1. Set "next push" to `iosFromRight rebuilt from tracks 2000 ms`, then tap
   "Push Blue".

   - [ ] "Blue" slides in from the right over about 2 seconds on top of
         "Home", which moves left by about a third of the width and darkens
         slightly: the same as a push with `iosFromRight linear 2000 ms`.

2. On "Blue", tap "Pop".

   - [ ] "Blue" slides out to the right over about 2 seconds on top of "Home",
         which moves back in from the left by about a third of the width and
         brightens: the same as a pop with `iosFromRight linear 2000 ms`.

---

### Animated properties

1. On "Home", set "next push" to `from 200 dp left + fade 600 ms`, then tap
   "Push Blue".

   - [ ] "Blue" fades in while moving right a short distance, about half the
         width, and settles in place; "Home" is static (see Note).

2. On "Blue", tap "Pop". On "Home", set "next push" to
   `rotate + scale 2000 ms`, then tap "Push Blue".

   - [ ] "Blue" grows from half its size while turning clockwise from a
         quarter turn, both about its center, over about 2 seconds; "Home" is
         static.

3. On "Blue", tap "Pop". On "Home", set "next push" to
   `scaleX overrides scale 2000 ms`, then tap "Push Blue".

   - [ ] "Blue" starts twice as wide and half as tall and settles to its full
         size over about 2 seconds; it is never uniformly small.

---

### Dim scrim

1. On "Blue", tap "Pop". On "Home", set "next push" to
   `dim blue 50% on the covered screen`, then tap "Push Blue".

   - [ ] "Blue" slides in from the right over about 1 second while a blue
         tint spreads over "Home", deepening as "Blue" covers it, so the
         yellow turns dull; "Blue" is not tinted.

2. On "Blue", tap "Pop".

   - [ ] "Blue" slides out to the right over about 1 second while the blue
         tint fades off "Home", which is yellow again when "Blue" is gone.

3. On "Home", set "next push" to `arriving screen brightens 1000 ms`, then tap
   "Push Blue".

   - [ ] "Blue" slides in from the right over about 1 second, starting almost
         black and brightening to its color as it arrives; "Home" is static
         and not tinted.

---

### Per-track timing

1. On "Blue", tap "Pop". On "Home", set "next push" to
   `rise 2000 ms + fade 1000 ms after 1000 ms`, then tap "Push Blue".

   - [ ] "Blue" rises from the bottom edge over about 2 seconds; it is
         invisible for the first second, then fades in while still rising, and
         is fully visible when it settles.

2. On "Blue", tap "Pop".

   - [ ] "Blue" sinks toward the bottom edge over about 2 seconds while fading
         out during the first second; it is gone before it reaches the edge.

3. On "Home", tap "Push Blue", on "Blue" set "this screen" to
   `hold 2000 ms on pop`, then tap "Pop".

   - [ ] "Blue" stays in place fully visible for about 2 seconds, then
         disappears at once and "Home" is shown; nothing moves or fades.

---

### Predictive back gesture

1. On "Home", set "next push" to `rotate + scale 2000 ms`, tap "Push Blue",
   then on "Blue" drag from the left screen edge to the middle of the screen
   and hold.

   - [ ] "Blue" is turned partway clockwise, shrunk and darkened, on top of a
         static "Home".

2. Drag the finger back to the left screen edge and release.

   - [ ] "Blue" is upright, at its full size and not darkened; "Home" is not
         shown.

3. Drag from the left screen edge to the middle of the screen and release
   without moving it back.

   - [ ] "Blue" finishes turning clockwise, shrinking and darkening, then
         only "Home" is shown, at rest.

---

### Invalid values

1. On "Home", set "next push" to `invalid: no duration`, then tap "Push Blue".

   - [ ] The `default` push plays instead: "Blue" slides in from the right
         only a short distance, about a tenth of the width, while fading in,
         and "Home" slides the same short distance to the left. Nothing
         travels across the full width.

2. On "Blue", tap "Pop".

   - [ ] The `default` pop plays: "Blue" slides a short distance to the right
         while fading out and "Home" slides back in from the left.
