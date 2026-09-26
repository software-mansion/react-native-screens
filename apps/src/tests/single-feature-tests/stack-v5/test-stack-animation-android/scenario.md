# Test Scenario: Stack Animation (Android)

## Details

**Description:** Verify how the v5 `StackContainer` plays a transition on
Android with the default `animation`: a push, a pop, the predictive back
gesture and a nested container. Pass: every transition runs in the right
direction and to completion, a screen that moves over a static one is drawn
above it, and a nested container animates on its own. Changing `animation` at
runtime is covered by `test-stack-animation-update-android`.

**OS test creation version:** Android API Level 37.

## E2E test

Incomplete: no step is automated. For manual testing perform steps 1-11.

The direction a screen moves in, the draw order over a static screen and the
interactive predictive back gesture are not assertable with Detox.

## Prerequisites

- Android emulator or device with gesture navigation enabled.
- Run the screen directly. In `apps/App.tsx` import and render
  `TestStackAnimationAndroid` as the root component instead of `Example`.
  Opened through the in-app menu, system back leaves the screen instead of
  popping the stack.
- System animations are on: "Settings → Accessibility → Color and motion →
  Remove animations" is off.

## Note

- Static: the screen does not move at all and stays fully visible for the whole
  transition.
- "NestedHost" is the only route with a non-default animation: it rises from
  and sinks to the bottom edge.

## Steps

### Baseline

1. Launch the screen directly (see Prerequisites).

   - [ ] The screen is yellow, reads "Name: Home" and shows "Push Blue",
         "Push Red" and "Push NestedHost" without a "Pop" button.

---

### Push and pop

2. Tap "Push Blue".

   - [ ] "Blue" (blue) slides in from the right and "Home" slides out to the
         left, both as rigid blocks.

3. On "Blue", tap "Pop".

   - [ ] "Blue" slides out to the right and "Home" slides in from the left.

---

### Predictive back gesture

4. Tap "Push Blue", then swipe in from the left screen edge and release past
   the middle.

   - [ ] "Blue" tracks the finger and "Home" is progressively revealed; on
         release the motion continues from that position until only "Home" is
         shown.

5. Tap "Push Blue", swipe in from the left screen edge to the middle, then
   swipe back to the edge and release.

   - [ ] "Blue" returns to rest with no residual offset and nothing is popped.

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

   - [ ] "NestedBlue" slides in from the right and "NestedHome" slides out to
         the left; nothing rises from the bottom edge.

10. On "NestedBlue", tap "Pop".

    - [ ] "NestedBlue" slides out to the right and "NestedHome" slides in from
          the left.

11. On "NestedHome", tap "Pop".

    - [ ] The green screen sinks to the bottom edge above a static "Home".
