# Test Scenario: Stack Animation Preset Composition

## Details

**Description:** Verify an `animation` prop of `Stack.Screen` composed from
presets, where the push and the pop transitions are named separately and a
transition can set the motion of each screen. Pass: each transition plays what
is named for it, a name in the pop position keeps its own direction, an omitted
part plays nothing, and an invalid value plays `default` instead. Preset
options on the whole animation are covered by `test-stack-animation-options`.

**OS test creation version:** iOS 18.6 and 27.2, Android API Level 37.

## E2E test

Incomplete: no step is automated. For manual testing perform all steps.

Which screen moves, in which direction, for how long, the draw order, the
header during the transition and the interactive back gestures are not
assertable with Detox.

## Prerequisites

- iPhone: simulator or device.
- Android emulator or device with gesture navigation enabled. The interactive
  predictive back gesture needs API 34 or newer.
- Android: run the screen directly. In `apps/App.tsx` import and render
  `TestStackAnimationPresetComposition` as the root component instead of
  `Example`. Opened through the in-app menu, system back leaves the screen
  instead of popping the stack.
- System animations are on: on Android "Settings → Accessibility → Color and
  motion → Remove animations" is off; on iOS "Settings → Accessibility → Motion
  → Reduce Motion" is off.

## Note

- Wait for every transition to finish before the next tap.
- Static: the screen does not move and stays fully visible for the whole
  transition.
- "next push" applies to every screen pushed from then on; "this screen"
  changes how the current screen is popped.
- **Known issue:** iOS: the back swipe plays UIKit's own pop, whatever the
  animation (https://github.com/software-mansion/react-native-screens-labs/issues/2066).

## Steps

### Baseline

1. Launch the app and navigate to the **Stack Animation Preset Composition**
   screen (on Android, launch the screen directly, see Prerequisites).

   - [ ] "Home" is yellow with the title "Home".
   - [ ] No header is visible.
   - [ ] "next push" and "this screen" read `slideFromRight`.
   - [ ] "next push header hidden" reads `true`.
   - [ ] There is no "Pop" button.

---

### Push and pop named separately

1. Set "next push" to `push slideFromBottom · pop fade`, then tap "Push Blue".

   - [ ] "Blue" rises from the bottom edge, drawn above "Home".
   - [ ] "Home" is static (see Note).

2. On "Blue", tap "Pop".

   - [ ] "Blue" fades out while "Home" fades in.
   - [ ] Nothing moves.

3. Tap "Push Blue", on "Blue" set "this screen" to
   `push slideFromRight · pop slideFromLeft`, then tap "Pop".

   - [ ] "Blue" leaves to the right, drawn beside "Home".
   - [ ] "Home" enters from the left.

4. Tap "Push Blue", on "Blue" set "this screen" to
   `push slideFromRight · pop slideFromRight`, then tap "Pop".

   - [ ] "Blue" leaves to the left, drawn beside "Home".
   - [ ] "Home" enters from the right.

5. Tap "Push Blue", on "Blue" set "this screen" to
   `push fadeFromBottom · pop fadeFromBottom`, then tap "Pop".

   - [ ] "Blue" rises about a twelfth of the height while fading out, drawn
         above "Home".
   - [ ] "Home" is static.

6. Tap "Push Blue", on "Blue" set "this screen" to
   `push iosFromRight · pop iosFromRight`, then tap "Pop".

   - [ ] "Blue" leaves to the left, drawn above "Home".
   - [ ] "Home" returns from the right by about a third of the width.
   - [ ] "Home" brightens while it returns.

---

### Omitted parts

1. On "Home", set "next push" to `push enter slideFromRight only`, then tap
   "Push Blue".

   - [ ] "Blue" enters from the right, drawn above "Home".
   - [ ] "Home" is static.

2. On "Blue", tap "Pop".

   - [ ] "Blue" disappears at once and "Home" is shown.
   - [ ] Nothing moves or fades.

3. Set "next push" to `custom with nothing set`, then tap "Push Blue".

   - [ ] "Blue" appears at once.
   - [ ] Nothing moves or fades.

---

### Screen motions

1. On "Blue", tap "Pop". On "Home", set "next push" to
   `slide 2000 ms + fade 1000 ms`, then tap "Push Blue".

   - [ ] "Blue" enters from the right over about 2 seconds, drawn above
         "Home".
   - [ ] The part of "Home" not yet covered by "Blue" fades out over the first
         second, while "Blue" is still about halfway in.

2. On "Blue", tap "Pop".

   - [ ] "Blue" leaves to the right over about 2 seconds, drawn above "Home".
   - [ ] The uncovered part of "Home" fades in over the first second.
   - [ ] "Home" is fully visible while "Blue" is still moving.

3. On "Home", set "next push" to `parallax 30%`, then tap "Push Blue".

   - [ ] "Blue" enters from the right, drawn above "Home".
   - [ ] "Home" moves left by about a third of the width.
   - [ ] "Home" does not darken.

---

### Invalid values

1. On "Blue", tap "Pop". On "Home", set "next push" to
   `invalid: enter iosFromRight`, then tap "Push Blue".

   - [ ] The `default` push plays instead.
   - [ ] Android: "Blue" slides in from the right only about a tenth of the
         width while fading in, and "Home" slides the same distance to the
         left.
   - [ ] iOS: UIKit's push: "Blue" enters from the right, and "Home" moves
         about a third of the width to the left and dims.

2. On "Blue", tap "Pop". On "Home", set "next push" to
   `invalid: distance on pop`, then tap "Push Blue".

   - [ ] The `default` push plays again.
   - [ ] "Blue" does not appear at once.

3. On "Blue", tap "Pop".

   - [ ] The `default` pop plays.
   - [ ] Android: "Blue" slides about a tenth of the width to the right while
         fading out, and "Home" slides back in from the left.
   - [ ] iOS: UIKit's pop: "Blue" leaves to the right, and "Home" returns from
         the left.

## Steps - Android

### Predictive back gesture

1. On "Home", set "next push" to `parallax 30%`, tap "Push Blue", then drag
   from the left screen edge to the middle of the screen and hold.

   - [ ] "Blue" follows the finger to the right, drawn above "Home".
   - [ ] "Home" is partly shifted to the left.
   - [ ] "Home" is not darkened.

2. Release the finger without moving it back.

   - [ ] "Blue" slides out to the right.
   - [ ] Only "Home" is shown, at rest.

## Steps - iOS

### Header back button

1. On "Home", set "next push" to `push slideFromBottom · pop fade` and "next
   push header hidden" to `false`, then tap "Push Blue".

   - [ ] "Blue" rises from the bottom edge, drawn above a static "Home".
   - [ ] The header with the title "Blue" and a back button fades in without
         moving.

2. Tap the back button in the header.

   - [ ] "Blue" fades out while "Home" fades in.
   - [ ] The header fades out over the same time.

---

### Back button menu

1. On "Home", set "next push" to `push iosFromRight · pop iosFromRight`, tap
   "Push Blue", then on "Blue" tap "Push Red".

   - [ ] "Red" enters from the right, drawn above "Blue".
   - [ ] The header shows the title "Red" and a back button.

2. Touch and hold the back button in the header, then choose "Home" in the
   menu.

   - [ ] "Red" leaves to the left, drawn above "Home".
   - [ ] "Home" returns from the right by about a third of the width.
   - [ ] "Home" brightens while it returns.
   - [ ] The header fades out over the same time.

---

### Omitted pop with a header

1. On "Home", set "next push" to `push enter slideFromRight only`, tap "Push
   Blue", then tap the back button in the header.

   - [ ] "Blue" disappears at once and "Home" is shown.
   - [ ] The header disappears at once.
   - [ ] Nothing moves or fades.
