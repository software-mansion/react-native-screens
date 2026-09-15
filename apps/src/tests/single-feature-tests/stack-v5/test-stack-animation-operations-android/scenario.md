# Test Scenario: Stack Animation Operations (Android)

## Details

**Description:** Verify which animation plays for every stack operation shape
on the v5 `StackContainer` on Android: push, multi-push, pop, multi-pop,
replace and multi-replace. Every route has a fixed, distinct slide preset so
that exactly one direction is correct for each operation, and a wrong
direction, a moving intermediate screen or a flash of a screen that should
never appear is immediately visible.

| Route  | `animation`                | Colour |
| ------ | -------------------------- | ------ |
| Home   | default (`slideFromRight`) | yellow |
| Right  | `slideFromRight`           | blue   |
| Left   | `slideFromLeft`            | red    |
| Bottom | `slideFromBottom`          | green  |
| Top    | `slideFromTop`             | purple |

The rules the scenario checks:

- A **push** plays the **incoming** screen's push row: the incoming screen
  arrives through its edge; for the horizontal slides the covered screen
  leaves through the opposite edge, for the vertical slides it stays put.
- A **pop** (button or predictive back gesture) plays the **outgoing**
  screen's pop row: the outgoing screen leaves through the edge it came
  from; for the horizontal slides the revealed screen enters from the
  opposite edge, for the vertical slides it stays put.
- A **replace** (pop and push in one batch) plays the **outgoing** screen's
  pop row with the incoming screen in the revealed role: for the horizontal
  slides the incoming screen slides in from the opposite edge, for the
  vertical slides it is already in place. The outgoing screen is drawn on
  top. The incoming screen's own preset is not used.
- In a **multi-push**, **multi-pop** or **multi-replace** only the screen
  that ends on top (push) or the screen that was on top (pop, replace)
  animates. Screens pushed and covered, or popped from below the top, in
  the same batch never appear.

Every screen shows its route information and the same operation panel.
The multi-operation buttons dispatch one batched navigation action, which
reaches the native side as a single update.

**OS test creation version:** Android API Level 37.

## E2E test

Incomplete: all steps (1–21) must be tested manually.

Not automated: which screen moves, in which direction, and whether an
intermediate screen flashes are visual qualities that Detox cannot assert
reliably.

## Prerequisites

- Android emulator or device

- **System animations must be enabled**: verify **Settings → Accessibility
  → Color and motion → Remove animations** is **OFF**.

### Android launch

- To exercise the predictive back gesture, run the screen **directly** by
  editing [apps/App.tsx](../../../../../App.tsx): import and render
  `TestStackAnimationOperationsAndroid` as the root component instead of
  `Example`, e.g.:

  ```tsx
  import { TestStackAnimationOperationsAndroid as Example } from './src/tests/single-feature-tests';
  ```

  When the screen is nested inside the example app's own navigation, native
  back navigates out to the selection menu instead of popping the stack
  (issue
  [#1459](https://github.com/software-mansion/react-native-screens-labs/issues/1459)).

- The predictive back gesture requires **Gesture navigation**
  (**Settings → System → Navigation mode → Gesture navigation**).

- The last section needs **Developer options** to change the animator
  duration scale.

## Note

- Every button acts on the screen it is shown on: **Pop** pops that screen,
  **Pop 2** and **Pop 3** also pop the screens below it. The panel tracks the
  stack by the order screens mounted, and a popped screen is removed from that
  list only once its dismissal completes, so **wait for every animation to
  finish** before tapping the next button; otherwise a multi-pop may target a
  screen that is already gone and pop fewer screens than requested, and a tap
  right after a native pop is ignored with a warning, because the navigator
  still sees the popped screen on top.
- "Static" below means the screen does not move at all and stays fully
  visible for the whole transition, with no flash of the window background
  and no jump at the end.
- Every push and replace must draw the entering screen **above** the other
  one; every pop must draw the outgoing screen **above** the revealed one.
- **Known issue:** an operation dispatched while a transition is still running
  completes that transition instantly, and a screen popped by the new batch is
  removed **without** its own pop animation; only a screen that newly appears
  still animates, over the window background. Steps 19 and 20 record this.

## Steps

### Baseline

1. Launch the app directly via `App.tsx` (see Android launch).

   - [ ] **Home** (yellow) is shown with the title `Home · default`, its route
         information and the operation panel. **Pop**, **Pop 2**, **Pop 3**,
         **Replace with …** and **Replace 2 …** are disabled.

### Single push and pop

2. Tap **Push Right**, then **Pop**.

   - [ ] Push: **Right** (blue) slides in from the right, **Home** slides out
         to the left underneath. Pop: **Right** slides out to the right on
         top, **Home** slides in from the left.

3. Tap **Push Left**, then **Pop**.

   - [ ] Push: **Left** (red) slides in from the left, **Home** slides out to
         the right underneath. Pop: **Left** slides out to the left on top,
         **Home** slides in from the right.

4. Tap **Push Bottom**, then **Pop**.

   - [ ] Push: **Bottom** (green) rises from the bottom edge over a static
         **Home**. Pop: **Bottom** sinks to the bottom edge over a static
         **Home**.

5. Tap **Push Top**, then **Pop**.

   - [ ] Push: **Top** (purple) drops from the top edge over a static
         **Home**. Pop: **Top** rises out through the top edge over a static
         **Home**.

### Multi-push

6. On **Home**, tap **Push Left + Top**.

   - [ ] Only **Top**'s push row plays: **Top** (purple) drops from the top
         edge over a **static Home**. No red screen and no leftward slide is
         visible at any point.
   - [ ] The result shows **Top** with **Pop 2** enabled (stack:
         Home, Left, Top).

7. Perform the predictive back gesture (swipe in from the left edge, hold,
   then release past the threshold).

   - [ ] The gesture is interactive and plays **Top**'s pop row: **Top** rises
         out through the top edge revealing a **static Left** (red), which
         was pushed underneath it without ever animating.

8. On **Left**, perform the predictive back gesture again and commit.

   - [ ] **Left**'s pop row plays: **Left** slides out to the left on top,
         **Home** slides in from the right.

9. On **Home**, tap **Push Right + Bottom + Left**.

   - [ ] Only **Left**'s push row plays: **Left** (red) slides in from the
         left, **Home** slides out to the right underneath. No blue or green
         frame is visible.
   - [ ] **Pop 3** is enabled (stack: Home, Right, Bottom, Left).

### Multi-pop

10. On **Left**, tap **Pop 3**.

    - [ ] Only **Left**'s pop row plays: **Left** slides out to the left on
          top, **Home** slides in from the right. No blue or green frame is
          visible, and **Home** is the screen revealed.
    - [ ] **Pop** is disabled again on **Home**.

11. Tap **Push Right**, then **Push Bottom**, then **Push Top** (one at a
    time, waiting for each animation). On **Top**, tap **Pop 2**.

    - [ ] Only **Top**'s pop row plays: **Top** (purple) rises out through the
          top edge over a **static Right** (blue). **Bottom** (green) does not
          appear and does not sink.
    - [ ] The result shows **Right**.

12. On **Right**, tap **Pop**.

    - [ ] **Right** slides out to the right on top, **Home** slides in from the
          left.

### Replace

13. Tap **Push Right**. On **Right**, tap **Replace with Bottom**.

    - [ ] **Right**'s pop row plays: **Right** (blue) slides out to the right
          **on top of Bottom** (green), which slides in from the **left**
          underneath it. **Bottom** does not rise from the bottom edge and
          **Home** is not visible.
    - [ ] The result shows **Bottom** with **Pop** enabled and **Pop 2**
          disabled (stack: Home, Bottom).

14. On **Bottom**, perform the predictive back gesture: hold, then commit.

    - [ ] The gesture is interactive and plays **Bottom**'s own pop row:
          **Bottom** sinks to the bottom edge over a **static Home**.

15. Tap **Push Left**. On **Left**, tap **Replace with Right**, then
    perform the predictive back gesture: hold, then cancel (swipe back to
    the edge and release).

    - [ ] Replace: **Left** (red) slides out to the **left** on top of
          **Right** (blue), which slides in from the **right** underneath it.
          Gesture: **Right** follows the finger to the right revealing **Home**
          from the left, and returns to rest on cancel with no residual
          offset.

16. On **Right**, tap **Pop**.

    - [ ] **Right** slides out to the right, **Home** slides in from the left.

### Multi-replace

17. Tap **Push Right**, then **Push Bottom**. On **Bottom**, tap
    **Replace 2 with Left + Top**.

    - [ ] Only **Bottom**'s pop row plays: **Bottom** (green) sinks to the
          bottom edge revealing **Top** (purple), already in place beneath it.
          No blue frame and no red slide is visible; **Top** does not drop
          from the top edge.
    - [ ] The result shows **Top** with **Pop 2** enabled (stack:
          Home, Left, Top).

18. Perform the predictive back gesture and commit, twice.

    - [ ] First: **Top** rises out through the top edge over a **static
          Left** (red). Second: **Left** slides out to the left, **Home**
          slides in from the right.

### Quick interactions (slowed animations)

19. Open **Settings → System → Developer options** and set **Animator
    duration scale** and **Transition animation scale** to **5x**. Return to
    the app on **Home**. Tap **Push Right + Bottom + Left** and, while
    **Left** is still sliding in, tap **Pop 3** on it.

    - [ ] The running push completes instantly and **Home** is shown at once,
          with no animation at all: **Left** disappears without its pop
          animation (see Note) and nothing slides in. No crash, no leftover
          view, **Pop** disabled on **Home**.

20. Tap **Push Right** and, while it is still sliding in, tap
    **Replace with Bottom** on it.

    - [ ] **Right** disappears instantly (see Note) and **Bottom** slides in
          from the **left** over the window background; **Home** is not visible
          underneath. No crash, no leftover view, and the stack ends as
          **Bottom** with **Pop** enabled and **Pop 2** disabled.

21. Set both developer-option scales back to **1x**.
