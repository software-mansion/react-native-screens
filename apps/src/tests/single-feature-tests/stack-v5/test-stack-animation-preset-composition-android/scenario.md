# Test Scenario: Stack Animation Preset Composition (Android)

## Details

**Description:** Verify an `animation` prop of `Stack.Screen` composed from
presets on Android, where the push and the pop transitions are named
separately and a transition can set the motion of each screen. Pass: each
transition plays what is named for it, a name in the pop position keeps its
own direction, an omitted part plays nothing, and an invalid value plays
`default` instead. Preset options on the whole animation are covered by
`test-stack-animation-options-android`.

**OS test creation version:** Android API Level 37.

## E2E test

Incomplete: no step is automated. For manual testing perform all steps.

Which screen moves, in which direction, for how long, the draw order and the
interactive predictive back gesture are not assertable with Detox.

## Prerequisites

- Android emulator or device with gesture navigation enabled, on API 34 or
  newer.
- Run the screen directly. In `apps/App.tsx` import and render
  `TestStackAnimationPresetCompositionAndroid` as the root component instead of
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
         both read `slideFromRight`, and there is no "Pop" button.

---

### Push and pop named separately

1. Set "next push" to `push slideFromBottom · pop fade`, then tap "Push Blue".

   - [ ] "Blue" rises from the bottom edge on top of a static "Home" (see
         Note).

2. On "Blue", tap "Pop".

   - [ ] "Blue" fades out while "Home" fades in; nothing moves.

3. Tap "Push Blue", on "Blue" set "this screen" to
   `push slideFromRight · pop slideFromLeft`, then tap "Pop".

   - [ ] "Blue" slides out to the right while "Home" slides in from the left
         beside it.

4. Tap "Push Blue", on "Blue" set "this screen" to
   `push slideFromRight · pop slideFromRight`, then tap "Pop".

   - [ ] "Blue" slides out to the left while "Home" slides in from the right
         beside it: both screens move left, as on a push.

5. Tap "Push Blue", on "Blue" set "this screen" to
   `push fadeFromBottom · pop fadeFromBottom`, then tap "Pop".

   - [ ] "Blue" rises a short distance, about a twelfth of the height, while
         fading out on top of a static "Home"; "Blue" does not sink.

6. Tap "Push Blue", on "Blue" set "this screen" to
   `push iosFromRight · pop iosFromRight`, then tap "Pop".

   - [ ] "Blue" slides out to the left on top of "Home", which moves in from
         the right by about a third of the width and brightens.

---

### Omitted parts

1. On "Home", set "next push" to `push enter slideFromRight only`, then tap
   "Push Blue".

   - [ ] "Blue" slides in from the right on top of a static "Home"; "Home"
         does not slide to the left.

2. On "Blue", tap "Pop".

   - [ ] "Blue" disappears at once and "Home" is shown; nothing moves or
         fades.

3. Set "next push" to `custom with nothing set`, then tap "Push Blue".

   - [ ] "Blue" appears at once; nothing moves or fades.

---

### Screen motions

1. On "Blue", tap "Pop". On "Home", set "next push" to
   `slide 2000 ms + fade 1000 ms`, then tap "Push Blue".

   - [ ] "Blue" slides in from the right on top of "Home" over about 2
         seconds.
   - [ ] The part of "Home" not yet covered by "Blue" fades out over the
         first second, while "Blue" is still about halfway in.

2. On "Blue", tap "Pop".

   - [ ] "Blue" slides out to the right on top of "Home" over about 2
         seconds.
   - [ ] The uncovered part of "Home" fades in over the first second and is
         fully visible while "Blue" is still moving.

3. On "Home", set "next push" to `parallax 30%`, then tap "Push Blue".

   - [ ] "Blue" slides in from the right on top of "Home", which moves left by
         about a third of the width; "Home" does not darken.

---

### Predictive back gesture

1. On "Blue", drag from the left screen edge to the middle of the screen and
   hold.

   - [ ] "Blue" follows the finger to the right on top of "Home", which is
         partly shifted to the left and is not darkened.

2. Release the finger without moving it back.

   - [ ] "Blue" slides out to the right and only "Home" is shown, at rest.

---

### Invalid values

1. On "Home", set "next push" to `invalid: enter iosFromRight`, then tap
   "Push Blue".

   - [ ] The `default` push plays instead: "Blue" slides in from the right
         only a short distance, about a tenth of the width, while fading in,
         and "Home" slides the same short distance to the left. Nothing
         travels across the full width.

2. On "Blue", tap "Pop". On "Home", set "next push" to
   `invalid: distance on pop`, then tap "Push Blue".

   - [ ] The `default` push plays again: "Blue" slides in a short distance
         while fading in; "Blue" does not appear at once.

3. On "Blue", tap "Pop".

   - [ ] The `default` pop plays: "Blue" slides a short distance to the right
         while fading out and "Home" slides back in from the left. Nothing
         travels across the full width.
