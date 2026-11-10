# Test Scenario: Stack Animation None

## Details

**Description:** Verify the `none` preset of the `animation` prop of
`Stack.Screen`. Pass: every push and pop, by button, header back button or back
button menu, swaps the screens and the header in one frame, the back gesture
still pops on release and leaves the stack untouched when cancelled, and a
screen pushed with `none` can still be popped with `default`.

**OS test creation version:** iOS 18.6 and 27.2, Android API Level 37.

## E2E test

Incomplete: no step is automated. For manual testing perform all steps.

The absence of motion and of a window-background flash, and the interactive back
gesture, are not assertable with Detox; only the resulting stack would be.

## Prerequisites

- iPhone: simulator or device.
- Android emulator or device with gesture navigation enabled.
- Android: run the screen directly. In `apps/App.tsx` import and render
  `TestStackAnimationNone` as the root component instead of `Example`. Opened
  through the in-app menu, system back leaves the screen instead of popping the
  stack.
- System animations are on: on Android "Settings → Accessibility → Color and
  motion → Remove animations" is off; on iOS "Settings → Accessibility → Motion
  → Reduce Motion" is off.

## Note

- Wait for every animation to finish before the next tap.
- "In one frame": the new screen replaces the old one with no slide, scale or
  fade, and no window background shows between them. A header that appears,
  disappears or changes its title does so in the same frame.
- **Known issue:** on iOS the back swipe of a `none` screen slides like a
  `default` one (labs #2066).

## Steps

### Baseline

1. Launch the app and navigate to the **Stack Animation None** screen (on
   Android, launch the screen directly, see Prerequisites).

   - [ ] "Home" is yellow with a dark frame at the screen edge and no visible
         header. "next push" and "this screen" read `none`, "next push header
         hidden" reads `true`, and "Push Blue" and "Push Red" are the only
         buttons: there is no "Pop" button.

---

### Push and pop

1. Tap "Push Blue".

   - [ ] "Blue" replaces "Home" in one frame (see Note), without a header.

2. On "Blue", tap "Pop".

   - [ ] "Home" replaces "Blue" in one frame.

---

### Header

1. Set "next push header hidden" to `false`, then tap "Push Blue".

   - [ ] "Blue" and its header with the title "Blue" and a back button appear in
         one frame.

2. On "Blue", tap "Push Red".

   - [ ] "Red" replaces "Blue" in one frame; the header title changes to "Red"
         in the same frame and nothing in the header slides or fades.

3. Tap the back button in the header.

   - [ ] "Blue" replaces "Red" in one frame; the header title changes to "Blue"
         in the same frame and nothing in the header slides or fades.

4. Tap the back button in the header.

   - [ ] "Home" replaces "Blue" in one frame and the header disappears in the
         same frame.

5. Tap "Push Blue", set "next push header hidden" to `true`, then tap "Push
   Red".

   - [ ] "Red" replaces "Blue" in one frame and the header disappears in the
         same frame.

6. On "Red", tap "Pop".

   - [ ] "Blue" and its header appear in one frame.

7. On "Blue", tap "Pop".

   - [ ] "Home" replaces "Blue" in one frame and the header disappears in the
         same frame.

---

### Back gesture

1. Tap "Push Blue", then swipe in from the left screen edge and release past the
   middle.

   - [ ] Android: nothing moves while the finger is down; on release "Home"
         replaces "Blue" in one frame.
   - [ ] iOS: "Blue" follows the finger and slides out, and "Home" is shown (see
         Note).

2. Tap "Push Blue", swipe in from the left screen edge to the middle, then swipe
   back to the edge and release.

   - [ ] "Blue" is still shown and nothing is popped.

---

### Mixed with `default`

1. On "Blue", set "this screen" to `default`, then tap "Pop".

   - [ ] The pop is animated, even though the push had no animation.
   - [ ] iOS: "Blue" slides out to the right while "Home" comes in from the
         left.
   - [ ] Android: "Blue" fades out while moving a short way to the right, and
         "Home" fades in from the left.

2. On "Home", set "next push" to `default`, then tap "Push Blue".

   - [ ] iOS: "Blue" slides in from the right while "Home" moves out to the
         left.
   - [ ] Android: "Blue" fades in while moving a short way in from the right.

3. On "Blue", set "this screen" to `none`, then tap "Pop".

   - [ ] "Home" replaces "Blue" in one frame, even though the push was animated.

## Steps - iOS

### Back button menu

1. On "Home", set "next push" to `none` and "next push header hidden" to
   `false`, then tap "Push Blue" and "Push Red".

   - [ ] "Red" is shown with a header and a back button.

2. Touch and hold the back button in the header, then choose "Home" in the
   menu.

   - [ ] "Home" replaces "Red" in one frame and the header disappears in the
         same frame; only the menu fades out.
