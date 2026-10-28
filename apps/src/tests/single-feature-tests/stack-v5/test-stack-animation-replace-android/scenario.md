# Test Scenario: Stack Animation Replace (Android)

## Details

**Description:** Verify the `replaceAnimation` prop of `Stack.Screen` on
Android: with `pop` (the default) a replace plays the outgoing screen's pop
animation and the outgoing screen leaves on top; with `push` it plays the
incoming screen's push animation and the incoming screen covers the outgoing
one. Every route carries a different preset, so whose animation plays is
visible. Pass: every replace plays the expected animation in the expected draw
order, no other screen of the stack is ever visible, and the predictive back
gesture after a replace pops the new top with its own animation. A replace
with the default value at every depth, and a multi-replace, are covered by
`test-stack-animation-operations-android`.

**OS test creation version:** Android API Level 37.

## E2E test

Incomplete: no step is automated. For manual testing perform all steps.

Which screen moves, in which direction, the draw order over another screen and
the interactive predictive back gesture are not assertable with Detox.

## Prerequisites

- Android emulator or device with gesture navigation enabled, on API 33 or
  newer.
- Run the screen directly. In `apps/App.tsx` import and render
  `TestStackAnimationReplaceAndroid` as the root component instead of
  `Example`. Opened through the in-app menu, system back leaves the screen
  instead of popping the stack.
- System animations are on: "Settings → Accessibility → Color and motion →
  Remove animations" is off.

## Note

- Wait for every transition to finish before the next tap.
- Static: the screen does not move and stays fully visible for the whole
  transition.
- "replaceAnimation" applies to every screen pushed from then on, so it is set
  before the replace that it is meant to affect.

## Steps

### Baseline

1. Launch the app and navigate to the **Stack Animation Replace (Android)**
   screen.

   - [ ] The screen is yellow with the title "Home · default",
         "replaceAnimation" reads `pop`, and "Pop" and every "Replace with …"
         button are disabled.

---

### Replace with `pop`

1. Tap "Push Right", then tap "Replace with Bottom" on "Right".

   - [ ] "Right" (blue) slides out to the right while "Bottom" (green) slides
         in from the left beside it; "Bottom" does not rise from the bottom
         edge and "Home" is not visible.

2. On "Bottom", tap "Replace with Fade".

   - [ ] "Bottom" sinks to the bottom edge on top of a static "Fade" (red).

3. On "Fade", tap "Replace with Ios".

   - [ ] "Fade" fades out while "Ios" (purple) fades in; nothing slides.

4. On "Ios", tap "Pop".

   - [ ] "Ios" slides out to the right on top of "Home", which slides in from
         the left by about a third of the width and brightens.

---

### Replace with `push`

1. Set "replaceAnimation" to `push`, tap "Push Fade", then tap "Push Right" on
   "Fade", then tap "Replace with Bottom" on "Right".

   - [ ] "Bottom" rises from the bottom edge on top of a static "Right";
         "Right" does not slide and neither "Fade" nor "Home" is visible.

2. On "Bottom", tap "Replace with Ios".

   - [ ] "Ios" slides in from the right on top of "Bottom", which moves left by
         about a third of the width and darkens underneath; "Bottom" does not
         sink.

3. On "Ios", tap "Replace with Right".

   - [ ] "Right" slides in from the right while "Ios" slides out to the left
         beside it; "Ios" does not slide to the right.

4. On "Right", tap "Replace with Fade".

   - [ ] "Right" fades out while "Fade" fades in; nothing slides.

---

### Predictive back after a replace

1. Set "replaceAnimation" to `pop`, tap "Replace with Ios" on "Fade", then
   drag from the left screen edge to the middle of the screen and hold.

   - [ ] "Ios" follows the finger to the right on top of "Fade", which is
         partly shifted left and darkened underneath.

2. Release the finger without moving it back.

   - [ ] "Ios" slides out to the right and "Fade" is shown with the title
         "Fade · fade".

3. On "Fade", tap "Pop".

   - [ ] "Fade" fades out while "Home" fades in; the title reads
         "Home · default" and "replaceAnimation" reads `pop`.
