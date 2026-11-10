# Test Scenario: Stack Animation Slide Presets

## Details

**Description:** Verify the slide presets of the `animation` prop of
`Stack.Screen`. Pass: the horizontal presets move both screens the full width
in the same direction, `slideFromBottom` and `slideFromTop` move only the
screen that enters or leaves, and every preset reverses on pop. On Android
every preset follows the predictive back gesture and, when the host's layout
direction is `rtl`, which the "START"/"END" row reports, `slideFromTrailing`
and `slideFromLeading` swap sides while `slideFromRight` and `slideFromLeft` do
not. On iOS the header back button and the back button menu pop with the
preset.

**OS test creation version:** iOS 18.6 and 27.2, Android API Level 37.

## E2E test

Incomplete: no step is automated. For manual testing perform all steps.

The direction a screen moves in, whether the other screen moves with it, the
header during the transition and the interactive back gestures are not
assertable with Detox.

## Prerequisites

- iPhone: simulator or device.
- Android emulator or device with gesture navigation enabled. The interactive
  predictive back gesture needs API 34 or newer.
- Android: run the screen directly. In `apps/App.tsx` import and render
  `TestStackAnimationSlide` as the root component instead of `Example`. Opened
  through the in-app menu, system back leaves the screen instead of popping the
  stack.
- System animations are on: on Android "Settings → Accessibility → Color and
  motion → Remove animations" is off; on iOS "Settings → Accessibility → Motion
  → Reduce Motion" is off.

## Note

- Wait for every animation to finish before the next tap.
- "Static" means the screen does not move at all and stays fully visible for
  the whole transition, with no flash of the window background and no jump at
  the end.
- "As one band" means the two screens travel together with their edges
  touching, so no window background shows between them.
- **Known issue:** on iOS the back swipe of a slide screen plays the `default`
  slide, whatever the preset (labs #2066).

## Steps

### Baseline

1. Launch the app and navigate to the **Stack Animation Slide Presets** screen
   (on Android, launch the screen directly, see Prerequisites).

   - [ ] "Home" is yellow with a dark frame at the screen edge, no visible
         header and the title "Home". "next push" and "this screen" both read
         `slideFromRight`, "next push header hidden" reads `true`, "direction"
         reads `ltr` with "START" on the left and "END" on the right of the row
         below it, and "Push Blue" and "Push Red" are the only buttons: there
         is no "Pop" button.

---

### `slideFromRight` and `slideFromLeft`

1. Tap "Push Blue".

   - [ ] "Blue" travels in from the right edge across the full width while
         "Home" travels out to the left by the same distance, as one band (see
         Note).

2. On "Blue", tap "Pop".

   - [ ] "Blue" travels out to the right across the full width while "Home"
         travels back in from the left, as one band.

3. On "Home", set "next push" to `slideFromLeft`, then tap "Push Blue".

   - [ ] Mirrored: "Blue" enters from the left edge and "Home" leaves to the
         right, as one band.

4. On "Blue", tap "Pop".

   - [ ] "Blue" leaves to the left and "Home" returns from the right, as one
         band.

---

### `slideFromBottom` and `slideFromTop`

1. On "Home", set "next push" to `slideFromBottom`, then tap "Push Blue".

   - [ ] "Blue" rises from the bottom edge across the full height, drawn above
         "Home", which is static (see Note).

2. On "Blue", tap "Pop".

   - [ ] "Blue" sinks back out through the bottom edge, drawn above "Home",
         which is static.

3. On "Home", set "next push" to `slideFromTop`, then tap "Push Blue".

   - [ ] Mirrored vertically: "Blue" drops in from the top edge across the full
         height and "Home" is static.

4. On "Blue", tap "Pop".

   - [ ] "Blue" rises back out through the top edge and "Home" is static.

## Steps - Android

### `slideFromTrailing` and `slideFromLeading`

1. On "Home", set "next push" to `slideFromTrailing`, then tap "Push Blue".

   - [ ] The same as `slideFromRight`: "Blue" travels in from the right edge
         across the full width while "Home" travels out to the left, as one
         band.

2. On "Blue", tap "Pop".

   - [ ] "Blue" travels out to the right across the full width while "Home"
         travels back in from the left, as one band.

3. On "Home", set "next push" to `slideFromLeading`, then tap "Push Blue".

   - [ ] The same as `slideFromLeft`: "Blue" enters from the left edge and
         "Home" leaves to the right, as one band.

4. On "Blue", tap "Pop".

   - [ ] "Blue" leaves to the left and "Home" returns from the right, as one
         band.

---

### Predictive back gesture

1. On "Home", set "next push" to `slideFromRight`, tap "Push Blue", then swipe
   in from the left screen edge and release past the middle.

   - [ ] "Blue" follows the finger to the right and "Home" is revealed from
         the left at the same rate, as one band; on release the band continues
         from that position until only "Home" is shown.

2. Tap "Push Blue", swipe in from the left screen edge to the middle, then
   swipe back to the edge and release.

   - [ ] "Blue" returns to rest with no residual offset, "Home" is hidden
         again and nothing is popped.

3. On "Blue", tap "Pop".

   - [ ] "Blue" travels out to the right across the full width while "Home"
         travels back in from the left, as one band.

---

### Layout direction

1. Set "direction" to `rtl`.

   - [ ] "START" moves to the right of the row and "END" to the left. The card,
         the pickers and the buttons are centred, so they stay where they are.

2. Tap "Push Blue".

   - [ ] "Blue" still enters from the right edge and "Home" still leaves to the
         left.

3. On "Blue", tap "Pop".

   - [ ] "Blue" travels out to the right and "Home" returns from the left, the
         same way as under `ltr`.

4. On "Home", set "next push" to `slideFromTrailing`, then tap "Push Blue".

   - [ ] Mirrored: "Blue" enters from the left edge and "Home" leaves to the
         right, as one band.

5. On "Blue", tap "Pop".

   - [ ] "Blue" leaves to the left and "Home" returns from the right, as one
         band.

6. On "Home", set "next push" to `slideFromLeading`, then tap "Push Blue".

   - [ ] "Blue" enters from the right edge and "Home" leaves to the left, as
         one band.

7. On "Blue", tap "Pop".

   - [ ] "Blue" leaves to the right and "Home" returns from the left, as one
         band.

8. Set "direction" to `ltr`.

   - [ ] "START" returns to the left of the row and "END" to the right. You end
         on "Home" with "direction" reading `ltr`.

## Steps - iOS

### Header back button

1. On "Home", set "next push" to `slideFromRight` and "next push header hidden"
   to `false`, then tap "Push Blue".

   - [ ] "Blue" enters from the right as one band with "Home", and the header
         with the title "Blue" and a back button fades in over the same time
         without moving.

2. On "Blue", tap "Push Red".

   - [ ] "Red" enters from the right as one band with "Blue". The header stays
         in place and shows "Red" and a back button by the end of the
         transition, with nothing left over.
   - [ ] iOS 18: the header title and the back button label crossfade over the
         whole transition.
   - [ ] iOS 26+: the header title crossfades in the middle of the transition
         and the back button stays in place.

3. Tap the back button in the header.

   - [ ] "Red" leaves to the right as one band with "Blue". The header stays in
         place and shows "Blue" and a back button by the end of the
         transition, with nothing left over.

---

### Back button menu

1. On "Blue", tap "Push Red", touch and hold the back button in the header,
   then choose "Home" in the menu.

   - [ ] "Red" leaves to the right as one band with "Home" and the header
         fades out over the same time.

---

### Back swipe

1. Tap "Push Blue", then swipe in from the left screen edge and release past
   the middle.

   - [ ] "Blue" follows the finger and slides out to the right while "Home"
         comes in from the left behind it (see Note).

---

### Header with `slideFromBottom`

1. On "Home", set "next push" to `slideFromBottom`, then tap "Push Blue".

   - [ ] "Blue" rises from the bottom edge above a static "Home" while the
         header with the title "Blue" fades in over the same time.

2. On "Blue", tap "Pop".

   - [ ] "Blue" sinks out through the bottom edge above a static "Home" while
         the header fades out over the same time. You end on "Home".
