# Test Scenario: Stack Animation (Android)

## Details

**Description:** Verify screen transition animations on the gamma/v5
`StackContainer` on Android, which are driven by the Android **Transition
API** (see [PR #3629](https://github.com/software-mansion/react-native-screens/pull/3629)).
The screen uses deliberately high-contrast, full-bleed screens — **Home**
(yellow), **Blue**, **Red**, and a **NestedHost** that embeds a second
`StackContainer` (**NestedHome** yellow / **NestedBlue** / **NestedRed**) —
so the transition, its shadow, and any content jump are easy to see.

The test validates that push, on-screen **Pop**, native (system) back, and
the **predictive back gesture** all animate smoothly, and guards against the
four regressions PR #3629 fixed:

1. disappearing shadows during a transition,
2. content jumping to a different position mid-transition,
3. non-continuous animation (notably the interactive predictive back gesture),
4. native-pop completing instantly instead of animating.

It also checks that a **nested** `StackContainer` animates the same way as
the top-level one.

**OS test creation version:** Android API Level 36.

## E2E test

Incomplete: Not automated. Animation smoothness, shadow continuity, absence of content
jumps, and the interactive predictive back gesture are visual / interactive
qualities that Detox cannot assert reliably. This scenario is manual only.

## Prerequisites

- Android emulator or device (this is an **Android-only** test; there is no
  iOS-specific behavior to verify here).

- **System animations must be enabled** — this test observes transition
  animations, so they will not play at all if the OS is set to remove/disable
  them. Before testing, verify: **Settings → Accessibility → Color and motion → Remove animations** is **OFF**.

### Android launch

- To exercise the native back button and the predictive back gesture, run the
  screen **directly** by editing
  [apps/App.tsx](../../../../../App.tsx): import and render
  `TestStackAnimationAndroid` as the root component instead of `Example`, e.g.:

  ```tsx
  import { TestStackAnimationAndroid as Example } from './src/tests/single-feature-tests';
  ```

  With the gamma `StackContainer` at the root, the system back button and
  gesture-back pop the stack directly. When the screen is nested inside the
  example app's own navigation, native back navigates out to the
  system/selection menu instead of popping the stack (issue
  [#1459](https://github.com/software-mansion/react-native-screens-labs/issues/1459)),
  which is why Android is tested via the direct launch.

- The predictive back gesture requires **Gesture navigation** to be enabled
  (**Settings → System → Navigation mode → Gesture navigation**) and, on
  devices where it is not on by default, the OS **predictive back** setting
  to be enabled.

## Note

- On **push**, the incoming screen slides in from right to left; on **pop**,
  the animation reverses — the outgoing screen slides out from left to right.

## Steps

### Baseline

1. Launch the app directly via `App.tsx` (see Android launch) so the **Home**
   screen is shown.

- [ ] **Home** is shown with a solid **yellow** background and **Push Blue** /
      **Push Red** / **Push NestedHost** buttons. No **Pop** button is shown.

### Push animation

2. Tap **Push Blue**.

- [ ] The **Blue** screen slides from right to left 
      in over **Home** with a smooth, continuous
      animation. A drop shadow is visible along the leading edge of the
      incoming screen throughout the transition. Neither screen's content
      jumps; both move as rigid blocks.

3. On **Blue**, tap **Push Red**.

- [ ] The **Red** screen slides in over **Blue**, same as step 2 — smooth,
      shadow present, no content jump.

### Pop animation (on-screen button)

4. On **Red**, tap **Pop**.

- [ ] **Red** slides back out and **Blue** is revealed with a smooth
      animation (the reverse of the push). The shadow stays visible along the
      moving edge; no content jump occurs.

### Predictive back gesture (interactive)

5. On **Blue**, tap **Push Red**.

- [ ] The **Red** screen slides in over **Blue**, same as step 2 — smooth,
      shadow present, no content jump.

6. On **Red** slowly swipe inward from the **left screen edge** and **hold** without
   releasing.

- [ ] The gesture is **interactive and continuous**: **Red** follows your
      finger and the screen underneath (**Blue**) is progressively revealed,
      tracking the drag position. The animation is not stepped or frozen, and
      the shadow remains visible.

7. Continue the swipe **past** the commit threshold and release.

- [ ] The pop **completes smoothly from the current gesture position** to
      fully showing **Blue** — the animation continues to completion rather
      than snapping instantly.

8. Push back to **Red**, start the same edge swipe, but **release before** the
   commit threshold (a short drag).

- [ ] The gesture is **cancelled smoothly**: **Red** animates back into place
      and no navigation change occurs.

### Nested stack animations

9. Pop/navigate back to **Home**, then tap **Push NestedHost**.

- [ ] The nested host slides in and shows **NestedHome** (yellow) with **Push
      NestedBlue** / **Push NestedRed** / **Pop** buttons. The push is
      animated with the same quality as the outer stack.

10. On **NestedHome**, tap **Push NestedBlue**, then on **NestedBlue** tap
    **Push NestedRed**.

- [ ] Each push inside the **nested** stack slides in smoothly, with a visible
      shadow and no content jump — identical behaviour to the top-level stack.

11. Inside the nested stack, tap **Pop**, then perform a **predictive back gesture**
(swipe from the left edge) twice.

- [ ] Each pop inside the nested stack animates smoothly (button and interactive
      gesture all behave as they do on the outer stack).
      When the nested stack has only **NestedHome** left, a further back
      pops the whole **NestedHost** route and returns to **Home**, animated.

### Re-pushing the same route (edge case)

12. From **Home**, tap **Push Blue**; on **Blue**, tap **Push Blue** again;
    on the new **Blue**, tap **Push Blue** once more.

- [ ] Every push animates a fresh **Blue** screen sliding in over the previous
      one (three stacked Blue instances). No transition is skipped, and no
      screen jumps or loses its shadow, even though consecutive screens share
      the same color.
