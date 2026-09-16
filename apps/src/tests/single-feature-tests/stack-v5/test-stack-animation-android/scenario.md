# Test Scenario: Stack Animation (Android)

## Details

**Description:** Verify screen transition animations on the v5
`StackContainer` on Android. Transitions are driven by the Android
**Transition API** (see [PR #3629](https://github.com/software-mansion/react-native-screens/pull/3629))
and configured per screen through the `animation` prop of `Stack.Screen`
(`slideFromRight`, `slideFromLeft`, `slideFromBottom`, `slideFromTop`,
`none`). The screen uses deliberately high-contrast, full-bleed screens —
**Home** (yellow), **Blue**, **Red**, and a **NestedHost** that embeds a second
`StackContainer` (**NestedHome** green / **NestedBlue** / **NestedRed**) — so
the transition, its button shadows, any content jump and the draw order are
easy to see. Every screen only offers pushes of a **different** colour, so
every transition is between two distinguishable screens.

Every screen shows two pickers:

- **next push** — the animation given to screens pushed from now on in the
  enclosing container (it is written into the route configs, so it applies
  to every route name).
- **this screen** — the animation of the current screen, applied through
  `setRouteOptions`. It drives that screen's pop (button and predictive back
  gesture), also when changed after the screen was pushed.

The test validates that push, on-screen **Pop** and the **predictive back
gesture** animate smoothly for every preset, that during a push the covered
screen is drawn **under** the entering screen (the static covered side of the
vertical slides must stay fully covered), that changing `animation` on the
top screen takes effect for the next pop, and it guards against the four
regressions PR #3629 fixed:

1. disappearing shadows during a transition,
2. content jumping to a different position mid-transition,
3. non-continuous animation (notably the interactive predictive back gesture),
4. native-pop completing instantly instead of animating.

It also checks that a **nested** `StackContainer` animates independently of
the top-level one, and ends with quick interactions under slowed system
animations.

**OS test creation version:** Android API Level 36.

## E2E test

Incomplete: all steps (1–25) must be tested manually.

Not automated: animation smoothness, draw order, button shadows continuity,
absence of content jumps and the interactive predictive back gesture are
visual / interactive qualities that Detox cannot assert reliably.

## Prerequisites

- Android emulator or device

- **System animations must be enabled** — this test observes transition
  animations, so they will not play at all if the OS is set to remove or
  disable them. Before testing, verify: **Settings → Accessibility → Color
  and motion → Remove animations** is **OFF**.

### Android launch

- To exercise the predictive back gesture, run the screen **directly** by
  editing [apps/App.tsx](../../../../../App.tsx): import and render
  `TestStackAnimationAndroid` as the root component instead of `Example`,
  e.g.:

  ```tsx
  import { TestStackAnimationAndroid as Example } from './src/tests/single-feature-tests';
  ```

  With the v5 `StackContainer` at the root, the system back button and
  gesture-back pop the stack directly. When the screen is nested inside the
  example app's own navigation, native back navigates out to the
  system/selection menu instead of popping the stack (issue
  [#1459](https://github.com/software-mansion/react-native-screens-labs/issues/1459)),
  which is why Android is tested via the direct launch.

- The predictive back gesture requires **Gesture navigation** to be enabled
  (**Settings → System → Navigation mode → Gesture navigation**) and, on
  devices where it is not on by default, the OS **predictive back** setting
  to be enabled.

- The last section needs **Developer options** to change the animator
  duration scale.

## Note

- Unless stated otherwise, both pickers are at their default,
  `slideFromRight`: on **push** the incoming screen slides in from the right
  while the covered screen slides out to the left; on **pop** the outgoing
  screen slides out to the right while the revealed screen slides in from the
  left.
- "Smooth" below means: continuous motion, button shadows persist during and
  after the transition, neither screen's content jumps, both move as rigid
  blocks.
- Every push must draw the incoming screen **above** the covered one, and
  every pop must draw the outgoing screen **above** the revealed one.
- **Pop** always pops the screen whose button was tapped. Tapping it twice on
  the same screen pops once; a second pop has to be tapped on the screen
  being revealed, which is only practical with slowed animations (last
  section).
- **Known issue:** a pop tapped while a previous pop is still animating
  completes the running transition instantly, the screen being revealed
  disappears **without** its own pop animation and only the screen below it
  animates in, over the window background. Step 23 records this.

## Steps

### Baseline

1. Launch the app directly via `App.tsx` (see Android launch) so the **Home**
   screen is shown.

   - [ ] **Home** is shown with the two pickers (both `slideFromRight`) and
         **Push Blue** / **Push Red** / **Push NestedHost** buttons. No **Pop**
         button is shown.

### Push and pop with the default preset

2. Tap **Push Blue**.

   - [ ] **Blue** slides in from the right over **Home**, which slides out to
         the left underneath it, smoothly.

3. On **Blue**, tap **Push Red**.

   - [ ] **Red** slides in over **Blue**, same as step 2.

4. On **Red**, tap **Pop**.

   - [ ] **Red** slides out to the right on top of **Blue**, which slides in
         from the left, smoothly (the reverse of the push).

### Predictive back gesture (interactive)

5. On **Blue**, tap **Push Red**, then slowly swipe inward from the **left
   screen edge** and **hold** without releasing.

   - [ ] The gesture is **interactive and continuous**: **Red** follows your
         finger and **Blue** is progressively revealed underneath, tracking the
         drag position. The animation is not stepped or frozen, and the button
         shadows remain visible.

6. Continue the swipe **past** the commit threshold and release.

   - [ ] The pop **completes smoothly from the current gesture position** to
         fully showing **Blue** — the animation continues to completion rather
         than snapping instantly.

7. On **Blue**, tap **Push Red** again, start the same edge swipe, then swipe
   back towards the left edge and release.

   - [ ] The gesture is **cancelled smoothly**: **Red** animates back into place
         and no navigation change occurs. **Red** sits exactly where it was
         before the gesture (no residual offset).

### `slideFromLeft`

8. On **Red**, set **next push** to `slideFromLeft`, then tap **Push Blue**.

   - [ ] **Blue** slides in from the **left** over **Red**, which slides out to
         the **right** underneath it.

9. On the new **Blue**, tap **Pop**. Then tap **Push Blue** on **Red** again
   and pop it with the predictive back gesture.

   - [ ] **Blue** slides out to the **left** on top of **Red**, which slides in
         from the **right** — both for the button pop and for the gesture, which
         stays interactive.

### `slideFromBottom` — static covered side

10. On **Red**, set **next push** to `slideFromBottom`, then tap
    **Push Blue**.

    - [ ] **Blue** rises from the bottom edge over **Red**. **Red** **does not
          move** and stays fully visible underneath for the whole duration; the
          rising screen is drawn **on top** of it. There is no flash of the
          window background and **Red** does not pop into or out of view at the
          end.

11. On **Blue**, tap **Pop**. Then push **Blue** again and pop it with the
    predictive back gesture (hold, then commit); push **Blue** once more,
    hold, then cancel; finally tap **Pop**.

    - [ ] **Blue** sinks to the bottom edge on top of **Red**, which stays put,
          for the button pop and for the committed gesture. The gesture is
          interactive; cancel returns **Blue** to rest. You end on **Red**.

### `slideFromTop`

12. On **Red**, set **next push** to `slideFromTop`, tap **Push Blue**, then
    tap **Pop**.

    - [ ] **Blue** drops in from the top edge over a static **Red** and rises
          back out through the top edge on pop, drawn on top both times.

### `none`

13. On **Red**, set **next push** to `none`, tap **Push Blue**, then tap
    **Pop**.

    - [ ] Both the push and the pop happen instantly, without any visible
          motion, flicker or leftover frame of the other screen.

14. Push **Blue** again (still `none`) and perform the predictive back
    gesture: hold, then commit; push **Blue** again, hold, then cancel; then
    tap **Pop**.

    - [ ] Nothing moves during the hold; releasing past the threshold pops
          instantly, cancelling leaves **Blue** in place. No crash. You end on
          **Red**.

### Changing the top screen's animation before it is popped

15. On **Red**, set **next push** back to `slideFromRight` and tap
    **Push Blue**. On **Blue**, set **this screen** to `slideFromBottom`,
    then perform the predictive back gesture and commit.

    - [ ] The gesture uses the **new** value: **Blue** sinks to the bottom edge
          and **Red** stays put.

16. On **Red**, tap **Push Blue** again. On **Blue**, set **this screen** to
    `slideFromLeft`, then tap **Pop**.

    - [ ] **Blue** slides out to the **left** and **Red** slides in from the
          right.

### Changing a covered screen's animation

17. On **Red**, set **this screen** to `slideFromTop`, then tap **Push Blue**
    (`slideFromRight`) and, on **Blue**, tap **Pop**.

    - [ ] The push plays **Blue**'s slide from the right; **Red**'s
          value does not affect it. The pop plays **Blue**'s own slide out to
          the right with **Red** entering from the left — the covered screen's
          value only governs its own pop.

18. On **Red** (top, `slideFromTop`), tap **Pop**.

    - [ ] **Red** rises out through the top edge over a static **Blue**.

### Nested stack

19. On **Blue**, tap **Pop** to return to **Home**. Set **next push** to
    `slideFromBottom`, then tap **Push NestedHost**.

    - [ ] The nested host rises from the bottom over the static **Home** and
          shows **NestedHome** (green) with its own pickers (both
          `slideFromRight`) and **Push NestedBlue** / **Push NestedRed** /
          **Pop** buttons.

20. On **NestedHome**, tap **Push NestedBlue**, then set **next push** to
    `slideFromLeft` and tap **Push NestedRed**.

    - [ ] Each push inside the **nested** stack animates with its own preset
          (default, then from the left), drawn on top, smooth, independently of
          the outer stack's `slideFromBottom`.

21. Inside the nested stack, tap **Pop**, then perform the predictive back
    gesture twice.

    - [ ] **NestedRed** slides out to the left with **NestedBlue** entering from
          the right; the gesture then pops **NestedBlue** to the right revealing
          **NestedHome** from the left, smoothly and interactively. When only
          **NestedHome** is left, the further back gesture pops the whole
          **NestedHost** route: it sinks to the bottom edge over the static
          **Home**.

### Quick interactions (slowed animations)

22. Open **Settings → System → Developer options** and set **Animator
    duration scale** and **Transition animation scale** to **5x**. Return to
    the app on **Home** and set **next push** to `slideFromRight`. Tap
    **Push Blue** and, while **Blue** is still sliding in, tap **Push Red**
    on it.

    - [ ] The first transition jumps to its end and **Red**'s push starts from
          the beginning; the final screen is **Red**, fully visible, with no
          stale copy of another screen left on screen.

23. On **Red**, tap **Pop** and, while **Red** slides out and **Blue** slides
    in, tap **Pop** on **Blue**.

    - [ ] **Blue**'s pop should slide it out to the right while **Home** slides
          in from the left. **Currently** (see Note) the running transition
          completes instantly, **Blue** disappears without animating and only
          **Home** animates in over the window background. Either way there is
          no crash, no leftover view, and the final screen is **Home**.

24. Tap **Push Blue** and, while it is still sliding in, start the
    predictive back gesture; hold, then commit.

    - [ ] The push transition is cancelled and jumps to its end, then the
          predictive back gesture starts: **Blue** follows the finger and
          **Home** is revealed underneath. After the commit no leftover view
          stays on screen, there is no crash, and **Home** is shown with the
          buttons it normally offers.

25. Set both developer-option scales back to **1x**.
