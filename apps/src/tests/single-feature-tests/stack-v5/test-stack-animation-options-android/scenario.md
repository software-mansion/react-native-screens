# Test Scenario: Stack Animation Preset Options (Android)

## Details

**Description:** Verify the `duration`, `easing` and `distance` options of the
object form of the `animation` prop of `Stack.Screen` on Android. Pass:
`duration` sets how long both the push and the pop take and keeps a pop that is
shorter than its push shorter, `easing` changes the curve of a played transition
but not of the predictive back gesture, `distance` sets how far `fadeFromBottom`
and `fadeFromTop` move, and an invalid value plays `default` instead.

**OS test creation version:** Android API Level 37.

## E2E test

Incomplete: no step is automated. For manual testing perform all steps.

Durations, curves, travel distances and the interactive predictive back gesture
are not assertable with Detox.

## Prerequisites

- Android emulator or device with gesture navigation enabled, on API 34 or
  newer.
- Run the screen directly. In `apps/App.tsx` import and render
  `TestStackAnimationOptionsAndroid` as the root component instead of
  `Example`. Opened through the in-app menu, system back leaves the screen
  instead of popping the stack.
- System animations are on: "Settings → Accessibility → Color and motion →
  Remove animations" is off.

## Note

- Wait for every transition to finish before the next tap.
- Static: the screen does not move and stays fully visible for the whole
  transition.

## Steps

### Baseline

1. Launch the screen directly (see Prerequisites).

   - [ ] "Home" is yellow with a dark frame at the screen edge and the title
         "Home". "next push" and "this screen" both read `slideFromRight`, and
         "Push Blue" and "Push Red" are the only buttons: there is no "Pop"
         button.

---

### Duration

1. Set "next push" to `slideFromRight 2000 ms`, then tap "Push Blue".

   - [ ] "Blue" travels in from the right while "Home" travels out to the
         left, together, over about 2 seconds, five times as long as a plain
         `slideFromRight`. The motion speeds up at the start and
         slows down at the end.

2. On "Blue", set "this screen" to `slideFromRight 100 ms`, then tap "Pop".

   - [ ] The pop is over almost at once: "Home" is shown in about a tenth of a
         second.

3. On "Home", set "next push" to `fadeFromBottom 2000 ms`, then tap
   "Push Blue".

   - [ ] "Blue" rises a short distance, about a twelfth of the height, while
         fading in, and settles over about 2 seconds, slowing down strongly
         at the end. "Home" is static (see Note).

4. On "Blue", tap "Pop".

   - [ ] "Blue" sinks the same short distance while fading out, in clearly
         less time than the push took. "Home" is static.

---

### Easing

1. On "Home", set "next push" to `slideFromRight 2000 ms linear`, then tap
   "Push Blue".

   - [ ] Both screens move at one constant speed for the whole 2 seconds,
         with no speeding up at the start and no slowing down at the end.

2. On "Blue", tap "Pop". On "Home", set "next push" to
   `slideFromRight 2000 ms overshoot`, then tap "Push Blue".

   - [ ] "Blue" travels most of the way in quickly, then passes its resting
         position by about a tenth of the width: its left frame edge leaves
         the screen and a strip of window background shows at the right
         edge. "Blue" then slowly settles back to rest (see Note).

---

### Predictive back gesture

1. On "Blue", swipe in slowly from the left screen edge to near the right edge,
   then release.

   - [ ] While the finger moves, "Blue" follows it to the right and "Home" is
         revealed from the left at the same rate. On release the pop
         completes from that position and only "Home" is shown. "Home" never
         moves past its resting position, neither during the swipe nor after
         the release.

2. Tap "Push Blue", swipe in from the left screen edge to the middle, then
   swipe back to the edge and release.

   - [ ] "Blue" returns to rest with no residual offset, "Home" is hidden
         again and nothing is popped.

---

### Distance

1. On "Blue", tap "Pop". On "Home", set "next push" to
   `fadeFromBottom 2000 ms 50%`, then tap "Push Blue".

   - [ ] "Blue" rises a long way while fading in: it starts about half the
         screen height lower, far below where it started in step 3 of
         **Duration**, and slows down into place. "Home" is static.

2. On "Blue", tap "Pop".

   - [ ] "Blue" sinks about half the screen height while fading out. "Home"
         is static.

3. On "Home", set "next push" to `fadeFromBottom 2000 ms 300 dp`, then tap
   "Push Blue".

   - [ ] "Blue" rises a long way while fading in, about a third of the screen
         height on a phone and clearly further than in step 3 of
         **Duration**. Nothing slides in sideways and "Home" is static.

4. On "Blue", tap "Pop". On "Home", set "next push" to
   `fadeFromTop 2000 ms 50%`, then tap "Push Blue".

   - [ ] Mirrored vertically: "Blue" drops in from about half the screen
         height above while fading in. "Home" is static.

---

### Invalid values

1. On "Blue", tap "Pop". On "Home", set "next push" to
   `invalid: distance on slideFromRight`, then tap "Push Blue".

   - [ ] The `default` push plays instead: "Blue" slides in from the right
         only a short distance, about a tenth of the width, while fading in,
         and "Home" slides the same short distance to the left. Nothing
         travels across the full width.

2. On "Blue", set "this screen" to `fadeFromBottom 2000 ms 50%`, then to
   `invalid: bezier x1 = 1.5`, and tap "Pop".

   - [ ] The `default` pop plays instead: "Blue" slides a short distance to
         the right while fading out and "Home" slides back in from the left.
         "Blue" does not sink.
