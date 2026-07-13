# Test Scenario: Prevent Native Dismiss - Nested Stack

## Details

**Description:** Verify how `preventNativeDismiss` behaves across a gamma/v5
Stack nested inside another Stack. When a screen has the flag **Enabled**,
native dismissal (the native header back-button chevron and the system
gesture-back / edge swipe) is intercepted, `onNativeDismissPrevented` fires
its own distinct toast, and the screen stays put — including at the **root**
of the nested stack, where interception blocks exiting back into the parent
stack. When the flag is **Disabled**, native back pops normally: a non-root
screen pops within its stack, and the nested root pops the whole nested
stack back into the parent. The on-screen **Pop** button always pops
regardless of the flag. Also verifies that when several ancestors prevent at
once, only the current top screen intercepts. See the Notes for `routeKey`
behavior and how Android is launched directly to work around issue #1459.

**OS test creation version:** Android API Level 36.

## E2E test

TBD: Automation is plausible — the native header back-button chevron, the
on-screen buttons, and the Toggle button are all Detox-drivable on Android —
but no e2e test has been implemented yet. The system gesture-back (edge
swipe) steps may need platform-specific handling.

## Prerequisites

- Android emulator or device

### Android launch

- To test the native-back / gesture-back flows, run the screen **directly**
  by editing [apps/App.tsx](../../../../../App.tsx): import and render
  `TestStackPreventNativeDismissNestedStack` as the root component instead of
  `Example`, e.g.:

  ```tsx
  import { TestStackPreventNativeDismissNestedStack as Example } from './src/tests/single-feature-tests';
  ```

  With the gamma `StackContainer` at the root, native back and gesture-back
  interact with the stack directly. When the screen is nested inside the
  example app's own navigation, native back navigates out to the
  system/selection menu instead of popping the stack (issue
  [#1459](https://github.com/software-mansion/react-native-screens-labs/issues/1459)),
  which is why Android is tested via the direct launch.

- The system gesture-back requires **Gesture navigation** to be enabled on
  the emulator/device. If it is not already set, enable it manually in
  **Settings → Navigation mode → select Gesture navigation**.

## Note

- iOS does not yet support `preventNativeDismiss` for stack v5 - it is unimplemented.
- Each `preventNativeDismiss` screen fires its **own** toast text, so you can
  tell which screen intercepted: `Native dismiss prevented - B`, `Native
  dismiss prevented - NestedHome`, `Native dismiss prevented - NestedB`.
- **NestedHome** is the nested stack's **root** and has **no header**, so it
  shows **no back chevron** — the only native dismissal trigger there is the
  system gesture-back. `A`, `B`, `NestedA`, and `NestedB` render a header and
  therefore show a back chevron.
- Flag defaults: `A` **Disabled**, `B` **Enabled**, the `NestedStack` host
  route itself **Disabled** (it never intercepts), `NestedHome` **Enabled**,
  `NestedA` **Disabled**, `NestedB` **Enabled**. The **Toggle Prevent Native
  Dismiss** button flips the flag at runtime via `setRouteOptions`.
- `Key` values use a session-global counter that never
  resets — only verify relationships: a push yields a new, higher key;
  popping back to a preserved instance keeps its key.
- When more than one ancestor screen has `preventNativeDismiss` enabled at
  once (e.g. **B**, then **NestedStack** → **NestedHome**), only the current
  top screen intercepts native dismissal; ancestors further down are not
  reached until the current screen stops intercepting.

## Steps

### Baseline

1. Launch the app directly via `App.tsx` so the
   **Home** screen is shown.

- [ ] **Home** is shown (blue background). No header/back chevron is visible.
      Only **Push A** / **Push B** / **Push NestedStack** buttons are shown
      (no **Pop** button).

### Push navigation and initial state (outer stack)

2. Tap **Push A**.

- [ ] Screen **A** is shown (yellow background) with a header titled "A" and
      a back chevron. Shows `Name: A`, a `Key`, and **Prevent
      native dismiss: Disabled**. **Push A** / **Push B** / **Push
      NestedStack** / **Pop** buttons are all present.

1. On **A**, tap **Push B**.

- [ ] Screen **B** is shown (green background) with a header titled "B" and a
      back chevron. Shows `Name: B`, a `Key` with number higher than A's, and
      **Prevent native dismiss: Enabled**. Push A / Push B / Push NestedStack
      / Pop and a **Toggle Prevent Native Dismiss** button are all present.

### Native dismiss blocked on B while Enabled (outer stack)

4. On **B** (prevent Enabled), tap the native header back-button chevron.

- [ ] The tap is intercepted: a green toast reading "Native dismiss prevented
      - B" appears, and the app remains on **B** (no pop, `Key` unchanged).

5. On **B**, perform a system gesture-back: swipe from the left screen edge
   to the right.

- [ ] The gesture is intercepted: the "Native dismiss prevented - B" toast
      appears again, and the app remains on **B**.

### Native dismiss allowed on A while Disabled (outer stack)

6. On **B**, tap the on-screen **Pop** button.

- [ ] App pops back to screen **A** normally, no toast shown. A's `Key` is
      unchanged from step 2.

7. On **A** (prevent Disabled), tap the native header back-button chevron.

- [ ] The chevron pops the stack normally and returns to **Home**. No toast
      is shown (dismissal is not prevented while Disabled).

8. From **Home**, tap **Push A** again. On **A**, perform a system
   gesture-back.

- [ ] The gesture pops the stack normally and returns to **Home**. No toast
      is shown.

### Native dismiss blocked at the nested root while Enabled

9. From **Home**, tap **Push A**, then on **A** tap **Push NestedStack**.

- [ ] The nested stack mounts and shows **NestedHome** (blue background). No
      header/back chevron is visible. Shows `Name: NestedHome`, a `Key`
      higher than any previous key, and **Prevent native
      dismiss: Enabled**. **Push NestedA** / **Push NestedB** / **Pop** and a
      **Toggle** button are present.

1.  On **NestedHome** (prevent Enabled, no chevron), perform a system
    gesture-back.

- [ ] The gesture is intercepted: a green toast reading "Native dismiss
      prevented - NestedHome" appears. The app stays on **NestedHome** — it
      does **not** exit the nested stack back to screen **A**.

11. Repeat the system gesture-back two or three times in quick succession.

- [ ] Each gesture is intercepted individually; the new toast appears each
      time; the app never leaves **NestedHome**.

### Nested root: allowed while Disabled bubbles up and exits the nested stack

12. On **NestedHome**, tap **Toggle Prevent Native Dismiss**.

- [ ] The info label switches to **Prevent native dismiss: Disabled**.

13. On **NestedHome**, perform a system gesture-back.

- [ ] The gesture pops the whole **NestedStack** route and returns
      to screen **A**. No toast is shown.

### Within-nested-stack navigation (non-root nested screens)

14. From **A**, tap **Push NestedStack** again.

- [ ] A fresh **NestedHome** instance is shown, with a `Key` higher than the
      one from step 9 and **Prevent native dismiss: Enabled** (default option
      restored on the new instance).

15. On **NestedHome**, tap **Push NestedA**.

- [ ] Screen **NestedA** is shown (blue background) with a header titled
      "NestedA" and a back chevron. Shows `Name: NestedA`, a `Key`,
      and **Prevent native dismiss: Disabled**. Push NestedA
      / Push NestedB / Pop buttons are present (no Toggle button).

1.  On **NestedA** (prevent Disabled), tap the native header back-button
    chevron.

- [ ] The chevron pops normally back to **NestedHome** within the nested
      stack. No toast is shown. NestedHome's `Key` is preserved from step 14.

### Native dismiss blocked on NestedB while Enabled

17. From **NestedHome**, tap **Push NestedB**.

- [ ] Screen **NestedB** is shown (blue background) with a header titled
      "NestedB" and a back chevron. Shows `Name: NestedB`, a `Key`,
      and **Prevent native dismiss: Enabled**. A Toggle
      button is present.

1.  On **NestedB** (prevent Enabled), tap the native header back-button
    chevron.

- [ ] The tap is intercepted: a green toast reading "Native dismiss prevented
      - NestedB" appears; the app stays on **NestedB**.

19. On **NestedB**, perform a system gesture-back.

- [ ] The gesture is intercepted: the "Native dismiss prevented - NestedB"
      toast appears again; the app stays on **NestedB**.

### NestedB: allowed while Disabled pops within the nested stack

20. On **NestedB**, tap **Toggle Prevent Native Dismiss** to Disabled, then
    tap the native header back-button chevron.

- [ ] The chevron pops normally back to **NestedHome** within the nested
      stack. No toast is shown.

### Pop button always works, even inside the nested stack

21. On **NestedHome** (now the sole attached route of the nested stack), tap
    the on-screen **Pop** button.

- [ ] Since NestedHome is the only attached route left in the nested stack,
      Pop bubbles up and pops the whole **NestedStack** route from the outer
      stack: the app returns to screen **A**. No toast is shown — Pop bypasses
      `preventNativeDismiss` even when it triggers this container-level
      bubbling.

### Edge case: layered prevention across nesting levels

22. From **A**, tap **Push B**, then on **B** tap **Push NestedStack**.

- [ ] **NestedHome** is shown (fresh instance), **Prevent native dismiss:
      Enabled**, with a `Key` higher than any seen so far. **B** (Enabled)
      now sits below the nested stack.

23. On **NestedHome**, perform a system gesture-back.

- [ ] The gesture is intercepted by **NestedHome** specifically: the toast
      reads "Native dismiss prevented - NestedHome" (not "- B"), confirming
      only the current top screen intercepts even though **B** below it also
      prevents. The app stays on **NestedHome**.

24. On **NestedHome**, tap **Toggle Prevent Native Dismiss** to Disabled,
    then tap the on-screen **Pop** button.

- [ ] **Pop** exits the nested stack and returns to screen **B** (not
      A/Home) — the screen directly below NestedStack on the outer stack. No
      toast is shown.

25. On **B** (top screen again, still prevent Enabled), tap the native
    header back-button chevron.

- [ ] The tap is intercepted again: the toast now reads "Native dismiss
      prevented - B", and the app stays on **B** — B resumes blocking native
      dismissal once it becomes the top screen again.

26. On **B**, tap the on-screen **Pop** button.

- [ ] App pops back to screen **A** normally. No toast is shown.
