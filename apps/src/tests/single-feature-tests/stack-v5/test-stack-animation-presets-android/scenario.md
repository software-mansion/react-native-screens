# Test Scenario: Stack Animation Presets (Android)

## Details

**Description:** Verify the look of every animation preset of the v5
`StackContainer` on Android, configured per screen through the `animation` prop
of `Stack.Screen`.

The test validates, for each preset, which screen moves and how, in which order
the screens are drawn, that the predictive back gesture scrubs the preset and
leaves no residue on cancel or commit (in particular no leftover dim scrim),
that `default` is the fallback for an unset `animation` and picks its look by
API level, and that `default` is currently the only preset that follows the
layout direction.

**OS test creation version:** Android API Level 37

## E2E test

Incomplete: all steps (1–25) must be tested manually.

Not automated: which screen moves, its opacity, scale and travel, the dim
scrim and the interactive predictive back gesture are visual / interactive
qualities that Detox cannot assert reliably.

## Prerequisites

- Android emulator or device on **API 33 or newer** for every section except
  "`default` below API 33", which needs a second emulator on **API 32 or
  older**.

- **System animations must be enabled** — verify **Settings → Accessibility →
  Color and motion → Remove animations** is **OFF**.

### Android launch

- To exercise the predictive back gesture, run the screen **directly** by
  editing [apps/App.tsx](../../../../../App.tsx): import and render
  `TestStackAnimationPresetsAndroid` as the root component instead of
  `Example`, e.g.:

  ```tsx
  import { TestStackAnimationPresetsAndroid as Example } from './src/tests/single-feature-tests';
  ```

  When the screen is nested inside the example app's own navigation, native
  back navigates out to the selection menu instead of popping the stack
  (issue
  [#1459](https://github.com/software-mansion/react-native-screens-labs/issues/1459)).

- The predictive back gesture requires **Gesture navigation**
  (**Settings → System → Navigation mode → Gesture navigation**).

## Note

- "Static" below means the screen does not move at all and stays fully
  visible for the whole transition, with no flash of the window background
  and no jump at the end.
- Every push must draw the incoming screen **above** the covered one, and
  every pop must draw the outgoing screen **above** the revealed one.
- "Predictive back hold / commit / cancel" means: swipe inward from a screen
  edge slowly and hold (the gesture must be interactive: the transition
  follows the finger), then either release past the threshold (commit) or
  swipe back to the edge and release (cancel).
- **Expected on API 33+:** during a `default` pop, once the outgoing screen
  has faded out (after ~120 ms) a narrow strip of the window background can
  show at the trailing edge while the revealed screen finishes its 10 %
  travel. The legacy stack behaved the same on API 33+.
- Only `default` follows the `direction` picker; every other preset keeps its
  physical direction in RTL.
- **Known issue:** an operation dispatched while a transition is still
  running completes that transition instantly and a screen popped by the new
  batch is removed without its own pop animation. Wait for every animation to
  finish before the next tap.

## Steps

### Baseline

1. Launch the app directly via `App.tsx` (see Android launch).

   - [ ] **Home** (yellow) is shown with the dark frame at the screen edge,
         the white card with the title **Home**, the three pickers
         (`next push` = `default`, `this screen` = `default`,
         `direction` = `ltr`) and **Push Blue** / **Push Red**. No **Pop**
         button.

### `default` on API 33 and newer

2. Tap **Push Blue**.

   - [ ] **Blue** slides in from the right over a short distance (about a
         tenth of the width) and fades in during the first moments; **Home**
         slides left by the same short distance underneath. Both frames move,
         **Blue** is drawn on top, the motion decelerates smoothly.

3. On **Blue**, tap **Pop**.

   - [ ] **Blue** slides right by the short distance and fades out quickly on
         top; **Home** slides back in from the left by the same distance. A
         narrow strip of window background at the right edge late in the pop
         is expected (see Note).

4. Tap **Push Blue**, then predictive back **hold** and **commit**; tap
   **Push Blue** again, **hold**, then **cancel**.

   - [ ] The gesture is interactive: **Blue** follows the finger and fades
         while **Home** slides in. Commit completes smoothly from the gesture
         position. Cancel returns **Blue** to rest, fully opaque and with no
         residual offset.

### `default` below API 33 (second emulator)

5. On the API 32 (or older) emulator, launch the screen directly and tap
   **Push Blue**.

   - [ ] No sliding: **Blue** zooms in from slightly smaller (85 %) and fades
         in during the second half; **Home** grows slightly (to 115 %) and
         dims to 40 % opacity underneath. Neither frame moves sideways.

6. On **Blue**, tap **Pop**.

   - [ ] **Blue** shrinks and fades out on top; **Home** shrinks back to its
         size and fades in.

7. Tap **Push Blue**, predictive back **hold**, **commit**; push again,
   **hold**, **cancel**.

   - [ ] The zoom is scrubbed by the finger; cancel restores both screens to
         full size and full opacity. Continue on the API 33+ emulator.

### `fade`

8. On **Home**, set **next push** to `fade`, tap **Push Blue**, then tap
   **Pop**.

   - [ ] Crossfade both ways: mid-way both cards are partially visible, no
         frame moves and no window background shows. On the push **Blue**
         fades in on top of **Home**; on the pop **Blue** fades out on top of
         **Home**.

9. Tap **Push Blue**, predictive back **hold**, **commit**; push again,
   **hold**, **cancel**.

   - [ ] The opacity of both screens tracks the finger. Cancel leaves **Blue**
         fully opaque with **Home** hidden.

### `fadeFromBottom` and `fadeFromTop`

10. On **Home**, set **next push** to `fadeFromBottom`, tap **Push Blue**.

    - [ ] **Blue** rises a short distance (about 8 % of the height) while
          fading in, decelerating; **Home** is static underneath.

11. On **Blue**, tap **Pop**.

    - [ ] **Blue** sinks the same short distance while fading out, noticeably
          faster than the push, and the fade starts after a short delay so
          the sinking is visible first. **Home** is static.

12. Tap **Push Blue**, predictive back **hold**, **commit**; push again,
    **hold**, **cancel**.

    - [ ] The sink and fade track the finger; cancel returns **Blue** to rest,
          fully opaque.

13. On **Home**, set **next push** to `fadeFromTop`, tap **Push Blue**, then
    tap **Pop**.

    - [ ] Mirrored vertically: **Blue** drops in from slightly above while
          fading in, and rises out while fading out. **Home** is static.

### `iosFromRight` and `iosFromLeft`

14. On **Home**, set **next push** to `iosFromRight`, tap **Push Blue**.

    - [ ] **Blue** slides in full width from the right on top. **Home** slides
          left by about 30 % underneath and **darkens slightly** (a faint
          black tint over its card and background) as it recedes.

15. On **Blue**, tap **Pop**.

    - [ ] **Blue** slides out to the right on top; **Home** returns from 30 %
          left and its tint fades away. After the pop **Home** has no tint.

16. Tap **Push Blue**, then predictive back **hold**.

    - [ ] **Home** is revealed on the left, moving with the finger, and its
          tint lightens as **Blue** is dragged further right.

17. **Cancel** the gesture, then tap **Pop**.

    - [ ] Cancel: **Blue** returns to rest, **Home** hidden. The following pop
          reveals **Home** with **no tint at all** once it ends (no leftover
          scrim).

18. Tap **Push Blue**, predictive back **hold**, **commit**.

    - [ ] The pop completes from the gesture position; **Home** ends fully
          untinted.

19. On **Home**, set **next push** to `iosFromLeft`, tap **Push Blue**, then
    tap **Pop**.

    - [ ] Mirrored: **Blue** enters from the left, **Home** recedes 30 % to
          the right and darkens; the pop reverses it and leaves **Home**
          untinted.

### Changing the top screen's animation before it is popped

20. On **Home**, set **next push** to `slideFromRight`, tap **Push Blue**. On
    **Blue**, set **this screen** to `iosFromRight`, then predictive back
    **hold** and **commit**.

    - [ ] The gesture plays `iosFromRight`'s pop: **Blue** leaves to the right
          on top while **Home** comes back from 30 % left with its tint fading
          — not the full-width conveyor of the push.

21. On **Home**, set **next push** to `fadeFromBottom`, tap **Push Blue**. On
    **Blue**, set **this screen** to `default`, then tap **Pop**.

    - [ ] The pop plays `default`'s pop (short slide with a quick fade on API
          33+), not the sinking fade **Blue** was pushed with.

### Layout direction (API 33 and newer)

22. On **Home**, set **next push** to `default` and **direction** to `rtl`.
    Tap **Push Blue**.

    - [ ] The pickers and buttons re-lay out right-to-left immediately.
          **Blue** enters from the **left** with the short slide and fade;
          **Home** moves right underneath.

23. On **Blue**, tap **Pop**. Tap **Push Blue** again, then predictive back
    **hold** and **commit**.

    - [ ] Both pops mirror the LTR look: **Blue** leaves to the **left** and
          **Home** returns from the right.

24. On **Home**, set **next push** to `iosFromRight`, tap **Push Blue**, then
    tap **Pop**.

    - [ ] Not mirrored: **Blue** still enters from the right and leaves to the
          right, **Home** still recedes to the left. Only `default` follows
          the direction.

25. On **Home**, set **next push** to `default`, tap **Push Blue**. On
    **Blue**, set **direction** to `ltr`, then tap **Pop**.

    - [ ] The pop uses the direction in effect when it starts: **Blue** leaves
          to the **right** and **Home** returns from the left. You end on
          **Home** in `ltr`.
