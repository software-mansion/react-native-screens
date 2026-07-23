cd# Test Scenario: Simple navigation

## Details

**Description:** Verify basic push and pop navigation on the v5
`StackContainer`. The stack starts with **Home** and can push **A** or **B**
any number of times (including re-pushing a route already on the stack),
each push creating a new screen instance with its own unique `routeKey`;
non-root screens expose a **Pop** button. The test validates that push/pop
via the on-screen buttons, the native header back button, and the
edge-swipe-back / system gesture-back produce
consistent stack state, that `routeKey` values are unique per pushed
instance, and that the root screen (**Home**) cannot be popped. See the
Notes for `routeKey` behavior and how the two platforms are launched
(issue #1459).

**OS test creation version:** iOS 18.6 and 26.5, Android API Level 36.

## E2E test

Incomplete: automated
with a per-platform suite in each block, because the two platforms behave
differently in the example-app harness and need different matchers.

- iOS: steps 1–10, including the native header back button
  (step 8) and the edge-swipe pop (step 9). react-native-screens detaches
  covered screens on iOS, so a `Name:` / `Key:` or button matcher resolves to
  a single element — the top screen.
- Android (`describeIfAndroid`): steps 1–7 and 10 only. Unlike iOS, covered
  screens stay attached on Android, so every stacked screen renders duplicate
  buttons and labels; the suite reads the current route, taps buttons, and
  waits on the **topmost** match (the last one in hierarchy order). `<Button>`
  titles also render uppercased (`PUSH A`, `POP`) and are matched in that form.

**Manual only (not automated):**

- For Android: Step 8 and 9
- For iOS Step 9: the cancel-before-halfway case is not possible to be automated
  with Detox.
- For both platfroms: Steps 11–12 — rapid tapping before a transition finishes. Detox
  synchronizes on UI idle between actions, so it cannot dispatch taps
  mid-animation.

## Prerequisites

- iOS device or simulator
- Android emulator or device

### iOS launch

- Run the app normally and navigate to the **Simple stack navigation**
  screen (Stack v5) from the in-app scenario selection menu.

### Android launch

- To test on Android, run the screen **directly** by editing
  [apps/App.tsx](../../../../../App.tsx): import and render
  `TestStackSimpleNav` as the root component instead of `Example`, e.g.:

  ```tsx
  import { TestStackSimpleNav as Example } from './src/tests/single-feature-tests';
  ```

  With the v5 `StackContainer` at the root, the Android system
  gesture-back pops the stack directly.

- The Android system gesture-back requires **Gesture navigation** to be
  enabled on the emulator/device. If it is not already set, enable it
  manually in **Settings → Navigation mode → select Gesture navigation**.

## Note

- Each screen shows two labels: `Name` (the route name: `Home`, `A`, or
  `B`) and `Key` (the route's unique `routeKey`). Use the `Key` value to
  tell apart multiple stacked instances of the same route name.
- `Key` values use a session-global counterthat increments on every push and is **never reset** for
  the lifetime of the app session (it is shared across all Stack
  containers). Only the **relationships** matter — every push produces a strictly
  new `Key`, and a preserved (not recreated) screen keeps the same `Key`.
- **Android:** when the screen is launched **directly** via `App.tsx` (see
  the Android launch prerequisite),both the **native header back button** and
  the **system gesture-back** work — the same as on iOS. These only fail when the screen
  is nested inside the example app's own navigation (issue
  [#1459](https://github.com/software-mansion/react-native-screens-labs/issues/1459)),
  which is exactly why Android is tested via the direct launch. On both
  platforms the on-screen **Pop** button always works.

## Steps

### Baseline

1. Launch the app for the platform under test (see Prerequisites: iOS from
   the selection menu, Android directly via `App.tsx`) so the **Home**
   screen of the Simple stack navigation is shown.

- [ ] The **Home** screen is shown with `Name:
  Home`, and a `Key`. No back button is visible in
  the header. No **Pop** button is shown, only **Push A** and **Push B**.
  Note the displayed `Key` value to compare against later steps.

### Push navigation

2. Tap **Push A**.

- [ ] Screen **A** is pushed. Screen displays `Name: A`, and a
  `Key` with a new value, distinct from Home's.
  A native back button is visible in the header. **Push A**, **Push B**, and **Pop**
  buttons are all shown. Note this `Key` value.

3. While on **A**, tap **Push B**.

- [ ] Screen **B** is pushed on top of **A**. `Name:
  B`, and a new `Key`is shown.
  A native back button is visible in the header. Note this `Key` value.

### Re-pushing an already-present route

4. While on **B**, tap **Push A** again.

- [ ] A new instance of screen **A** is pushed on top of the stack (stack
  is now Home, A, B, A). `Name: A` and a new
  `Key` that is **different** from the `Key` shown in step 2.

### Pop via the on-screen button

5. Tap **Pop**.

- [ ] Returns to screen **B**. `Name: B` and the **same** `Key` value
  observed in step 3 (the instance was preserved, not recreated).

6. Tap **Pop** again.

- [ ] Returns to the original screen **A**. `Name: A` and the **same** `Key`
  value observed in step 2.

7. Tap **Pop** again.

- [ ] Returns to **Home**. No **Pop** button is shown and no header back
  button appears (root screen reached).

### Native header back button

8. Tap **Push A**, then tap **Push B**. Then tap the native back button in the
header.

- [ ] Tapping the native back button behaves the same as tapping **Pop**:
  returns to screen **A** with its `Key` unchanged. No crash and no
  inconsistent state.

### Edge-swipe / system gesture-back

9. While on screen **A** or **B**, swipe from the left screen edge
   to the right to trigger the interactive pop gesture.

- [ ] Completing the swipe/gesture pops the current screen, identical in
  effect to tapping **Pop**. The screen below is shown with its original,
  unchanged `Key`.
- [ ] Starting the swipe/gesture and releasing before the halfway point
  cancels it: the current screen returns to place and no navigation change
  occurs.

### Route key uniqueness (edge case)

10. From **Home**, tap **Push A**. While on the newly pushed **A**, tap
    **Push A** again. While on that new **A**, tap **Push A** once more,
    without popping in between.

- [ ] Three separate **A** instances are stacked. Each shows `Name: A`,
  but the `Key` value is different every time you land on a new push.

### Rapid tapping (edge case)

11. From any screen, rapidly tap **Push A** several times in quick
    succession, before each push transition finishes animating.

- [ ] Each tap results in exactly one additional **A** screen being
  pushed. No crash, no dropped pushes, and no duplicate `Key` values.

12. From the deepest screen reached in step 11, rapidly tap **Pop**
    several times in quick succession, before each pop transition
    finishes animating.

- [ ] The stack pops one screen per completed transition, eventually
  stabilizing on **Home**. No crash occurs, and no attempt is made to pop
  past the root screen.
