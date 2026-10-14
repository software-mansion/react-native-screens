# Test Scenario: Stack Animation (Android)

## Details

**Description:** Verify how the v5 `StackContainer` plays a transition on
Android with the `default` `animation`, which is the platform look for the
running API level: a push, a pop, the predictive back gesture and a nested
container. Pass: every transition runs in the right direction and to completion,
a screen that moves over a static one is drawn above it, and a nested container
animates on its own. Changing `animation` at runtime is covered by
`test-stack-animation-update-android`; the other presets by
`test-stack-animation-slide-android`, `-fade-android`, `-ios-android` and
`-none-android`.

**OS test creation version:** Android API Level 37 and API Level 30.

## E2E test

Incomplete: no step is automated. For manual testing perform steps 1-14.

The direction a screen moves in, the travel distance, the scale, the draw order
over a static screen and the interactive predictive back gesture are not
assertable with Detox.

## Prerequisites

- Android emulator or device with gesture navigation enabled, on **API 33 or
  newer** for steps 1-11.
- Steps 12-14 need a second emulator or device with gesture navigation enabled
  on **API 32 or older**, where `default` is a different animation.
- Run the screen directly. In `apps/App.tsx` import and render
  `TestStackAnimationAndroid` as the root component instead of `Example`.
  Opened through the in-app menu, system back leaves the screen instead of
  popping the stack.
- System animations are on: "Settings → Accessibility → Color and motion →
  Remove animations" is off.

## Note

- Static: the screen does not move at all and stays fully visible for the whole
  transition.
- "A short distance" means about a tenth of the screen width, the travel
  `default` uses on API 33 and newer.
- During a `default` pop, once the outgoing screen has faded out a narrow strip
  of the window background can show at the trailing edge while the revealed
  screen finishes its travel.
- "NestedHost" is the only route with an explicit animation: it rises from and
  sinks to the bottom edge.

## Steps

### Baseline

1. Launch the screen directly (see Prerequisites).

   - [ ] The screen is yellow, reads "Name: Home" and shows "Push Blue",
         "Push Red" and "Push NestedHost" without a "Pop" button.

---

### Push and pop

2. Tap "Push Blue".

   - [ ] "Blue" (blue) slides in from the right a short distance (see Note)
         while fading in, and "Home" slides the same short distance to the left
         underneath. "Blue" is drawn above "Home" and the motion decelerates
         smoothly.

3. On "Blue", tap "Pop".

   - [ ] "Blue" slides the short distance to the right on top while fading out,
         and "Home" slides back in from the left by the same distance. A narrow
         strip of window background at the right edge late in the pop is
         expected (see Note).

---

### Predictive back gesture

4. Tap "Push Blue", then swipe in from the left screen edge and release past
   the middle.

   - [ ] "Blue" tracks the finger and fades while "Home" is progressively
         revealed; on release the motion continues from that position until only
         "Home" is shown.

5. Tap "Push Blue", swipe in from the left screen edge to the middle, then
   swipe back to the edge and release.

   - [ ] "Blue" returns to rest, fully opaque and with no residual offset, and
         nothing is popped.

6. On "Blue", tap "Push Red", then swipe in from the left screen edge and
   release past the middle.

   - [ ] "Red" (red) tracks the finger and is popped, leaving "Blue".

7. Swipe in from the left screen edge and release past the middle again.

   - [ ] "Blue" tracks the finger the same way and is popped, leaving "Home".

---

### Nested stack

8. Tap "Push NestedHost".

   - [ ] A green screen reading "Name: NestedHome" rises from the bottom edge
         above a static "Home".

9. On "NestedHome", tap "Push NestedBlue".

   - [ ] "NestedBlue" slides in from the right a short distance and fades in
         while "NestedHome" slides the same distance to the left; nothing rises
         from the bottom edge.

10. On "NestedBlue", tap "Pop".

    - [ ] "NestedBlue" slides the short distance to the right and fades out
          while "NestedHome" slides back in from the left.

11. On "NestedHome", tap "Pop".

    - [ ] The green screen sinks to the bottom edge above a static "Home".

---

### `default` below API 33

12. On the API 32 or older device, launch the screen directly and tap
    "Push Blue".

    - [ ] Nothing slides sideways: "Blue" zooms in from 85 % of its size while
          fading in, and "Home" grows to 115 % and dims to 40 % opacity
          underneath.

13. On "Blue", tap "Pop".

    - [ ] "Blue" shrinks to 85 % and fades out on top, while "Home" shrinks back
          to its own size and fades in.

14. Tap "Push Blue", then swipe in from the left screen edge and release.

    - [ ] Nothing moves while the finger is down; on release the pop plays the
          same zoom as in step 13, leaving "Home".
