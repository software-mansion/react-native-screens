# Test Scenario: Stack Animation iosFrom Presets

## Details

**Description:** Verify the iOS presets of the `animation` prop of
`Stack.Screen`. Pass: the incoming screen travels the full width on top while
the covered screen recedes about a third of the width and is tinted, the pop
reverses both, no tint is left behind, and when the host's layout direction is
`rtl`, `iosFromTrailing` and `iosFromLeading` swap sides while `iosFromRight`
and `iosFromLeft` do not.

**OS test creation version:** iOS 18.6 and 27.2, Android API Level 37.

## E2E test

Incomplete: no step is automated. For manual testing perform all steps.

The tint, the travel distances, the draw order, the header during the
transition and the interactive back gestures are not assertable with Detox.

## Prerequisites

- iPhone: simulator or device.
- Android emulator or device with gesture navigation enabled. The interactive
  predictive back gesture needs API 34 or newer.
- Groups whose heading says "Android: 10x animation scale, iOS: normal": on
  Android, in Developer options set "Animator duration scale" and "Transition
  animation scale" to 10x before the first of them and back to 1x after the
  last. At 1x these transitions last 200 ms and the tint cannot be compared
  against a swatch by eye. On iOS they run at normal speed (350 ms
  transitions), like every other group; judge the tint from a screen recording
  if needed.
- Android: run the screen directly. In `apps/App.tsx` import and render
  `TestStackAnimationIOSFrom` as the root component instead of `Example`. Opened
  through the in-app menu, system back leaves the screen instead of popping the
  stack.
- System animations are on: on Android "Settings → Accessibility → Color and
  motion → Remove animations" is off; on iOS "Settings → Accessibility → Motion
  → Reduce Motion" is off.

## Note

- Wait for every transition to finish before the next tap.
- Tinted: the covered screen's yellow is darker than the yellow swatch at the
  edge of the screen drawn over it. Untinted: the two match, and "Home"'s card
  is white, not grey.
- As one band: the two screens travel together with their edges touching, so no
  window background shows between them.
- **Known issue:** iOS: the back swipe plays UIKit's own pop, whatever the
  preset (https://github.com/software-mansion/react-native-screens-labs/issues/2066).

## Steps

### Baseline

1. Launch the app and navigate to the **Stack Animation iosFrom Presets** screen
   (on Android, launch the screen directly, see Prerequisites).

   - [ ] "Home" is yellow with a dark frame at the screen edge.
   - [ ] No header is visible.
   - [ ] A yellow, a blue and a red swatch are stacked flush with each side
         edge.
   - [ ] "next push" and "this screen" read `iosFromRight`.
   - [ ] "next push header hidden" reads `true`.
   - [ ] "direction" reads `ltr`.
   - [ ] The row below "direction" reads "START" on the left and "END" on the
         right.
   - [ ] "Push Blue" and "Push Red" are the only buttons.

---

### `iosFromRight` (Android: 10x animation scale, iOS: normal)

1. Tap "Push Blue".

   - [ ] "Blue" enters from the right edge, drawn above "Home".
   - [ ] "Home" moves left by about a third of the width.
   - [ ] "Home" is tinted while it moves (see Note).

2. On "Blue", tap "Pop".

   - [ ] "Blue" leaves to the right, drawn above "Home".
   - [ ] "Home" returns from the left.
   - [ ] "Home"'s tint lifts while it returns.
   - [ ] "Home" is untinted once the pop ends.

---

### `iosFromLeft` (Android: 10x animation scale, iOS: normal)

1. On "Home", set "next push" to `iosFromLeft`, then tap "Push Blue".

   - [ ] "Blue" enters from the left edge, drawn above "Home".
   - [ ] "Home" moves right by about a third of the width.
   - [ ] "Home" is tinted while it moves.

2. On "Blue", tap "Pop".

   - [ ] "Blue" leaves to the left, drawn above "Home".
   - [ ] "Home" returns from the right.
   - [ ] "Home" is untinted once the pop ends.

---

### `iosFromTrailing` and `iosFromLeading` (Android: 10x animation scale, iOS: normal)

1. On "Home", set "next push" to `iosFromTrailing`, then tap "Push Blue".

   - [ ] "Blue" enters from the right edge, drawn above "Home".
   - [ ] "Home" moves left by about a third of the width.
   - [ ] "Home" is tinted while it moves.

2. On "Blue", tap "Pop".

   - [ ] "Blue" leaves to the right.
   - [ ] "Home" returns from the left.
   - [ ] "Home" is untinted once the pop ends.

3. On "Home", set "next push" to `iosFromLeading`, then tap "Push Blue".

   - [ ] "Blue" enters from the left edge, drawn above "Home".
   - [ ] "Home" moves right by about a third of the width.
   - [ ] "Home" is tinted while it moves.

4. On "Blue", tap "Pop".

   - [ ] "Blue" leaves to the left.
   - [ ] "Home" returns from the right.
   - [ ] "Home" is untinted once the pop ends.

---

### A preset changed before the pop (Android: 10x animation scale, iOS: normal)

1. On "Home", set "next push" to `slideFromRight`, then tap "Push Blue".

   - [ ] "Blue" and "Home" travel the full width as one band (see Note).
   - [ ] "Home" is not tinted.

2. On "Blue", set "this screen" to `iosFromRight`, then tap "Pop".

   - [ ] "Blue" leaves to the right, drawn above "Home".
   - [ ] "Home" returns from a third of the width to the left.
   - [ ] "Home" starts tinted.
   - [ ] "Home" is untinted once the pop ends.

---

### Layout direction

1. On "Home", set "next push" to `iosFromRight`, then set "direction" to
   `rtl`.

   - [ ] Android: "START" moves to the right of the row and "END" to the left.
   - [ ] iOS: the row still reads "START" on the left.
   - [ ] The card, the pickers, the buttons and the swatches stay where they
         are.

2. Tap "Push Blue".

   - [ ] "Blue" enters from the right edge.
   - [ ] "Home" moves left.

3. On "Blue", tap "Pop".

   - [ ] "Blue" leaves to the right.
   - [ ] "Home" returns from the left.

4. On "Home", set "next push" to `iosFromTrailing`, then tap "Push Blue".

   - [ ] "Blue" enters from the left edge, drawn above "Home".
   - [ ] "Home" moves right by about a third of the width.
   - [ ] "Home" is tinted while it moves.

5. On "Blue", tap "Pop".

   - [ ] "Blue" leaves to the left.
   - [ ] "Home" returns from the right.
   - [ ] "Home" is untinted once the pop ends.

6. On "Home", set "next push" to `iosFromLeading`, then tap "Push Blue".

   - [ ] "Blue" enters from the right edge.
   - [ ] "Home" moves left by about a third of the width.

7. On "Blue", tap "Pop".

   - [ ] "Blue" leaves to the right.
   - [ ] "Home" returns from the left.

8. Set "direction" to `ltr`.

   - [ ] "direction" reads `ltr`.
   - [ ] The row reads "START" on the left.

## Steps - Android

### Predictive back gesture and the tint

1. On "Home", set "next push" to `iosFromRight`, tap "Push Blue", then swipe in
   from the left screen edge and hold at the middle.

   - [ ] "Home" is revealed on the left and moves with the finger.
   - [ ] "Home"'s tint lightens while "Blue" moves right.

2. Swipe back to the edge and release.

   - [ ] "Blue" returns to rest with no residual offset.
   - [ ] Nothing is popped.

3. On "Blue", tap "Pop".

   - [ ] "Home" is untinted once the pop ends.

4. Tap "Push Blue", swipe in from the left screen edge and release past the
   middle.

   - [ ] The pop completes from the position the finger was released at.
   - [ ] "Home" is untinted once the pop ends.

5. Set "direction" to `rtl` and "next push" to `iosFromTrailing`, tap "Push
   Blue", then swipe in from the left screen edge and release past the middle.

   - [ ] "Blue" moves left while the finger moves right.
   - [ ] "Home" is revealed on the right.
   - [ ] The pop completes.
   - [ ] "Home" is untinted once the pop ends.

6. Set "direction" to `ltr`.

   - [ ] "START" returns to the left of the row.

## Steps - iOS

### Header back button

1. On "Home", set "next push" to `iosFromRight` and "next push header hidden"
   to `false`, then tap "Push Blue".

   - [ ] "Blue" enters from the right edge.
   - [ ] "Home" moves left, tinted.
   - [ ] The header with the title "Blue" and a back button fades in over the
         same time without moving.

2. On "Blue", tap "Push Red".

   - [ ] "Red" enters from the right edge.
   - [ ] "Blue" moves left, tinted.
   - [ ] The header is not tinted.
   - [ ] The header stays in place and shows "Red" and a back button by the
         end of the transition, with nothing left over.
   - [ ] iOS: the header title crossfades.

3. Tap the back button in the header.

   - [ ] "Red" leaves to the right.
   - [ ] "Blue" returns from the left.
   - [ ] "Blue" is untinted once the pop ends.
   - [ ] The header shows "Blue" and a back button by the end of the
         transition, with nothing left over.

---

### Back button menu

1. On "Blue", tap "Push Red", touch and hold the back button in the header,
   then choose "Home" in the menu.

   - [ ] "Red" leaves to the right, drawn above "Home".
   - [ ] "Home" returns from the left.
   - [ ] "Home" is untinted once the pop ends.
   - [ ] The header fades out over the same time.

---

### Back swipe

1. Tap "Push Blue", then swipe in from the left screen edge and release past
   the middle.

   - [ ] "Blue" follows the finger.
   - [ ] "Blue" pops when released (see Note).
   - [ ] "Home" is untinted once the pop ends.
