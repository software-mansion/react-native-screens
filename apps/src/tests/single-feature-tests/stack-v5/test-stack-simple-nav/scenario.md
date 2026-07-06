# Test Scenario: Simple navigation

## Details

**Description:** Verify basic push and pop navigation on the gamma/v5
`StackContainer`. The stack starts with **Home** and can push **A** or **B**
any number of times (including re-pushing a route already on the stack),
each push creating a new screen instance with its own unique `routeKey`;
non-root screens expose a **Pop** button. The test validates that push/pop
via the on-screen buttons, the iOS native header back button, and the iOS
edge-swipe-back gesture all produce consistent stack state, that `routeKey`
values are unique per pushed instance, and that the root screen (**Home**)
cannot be popped. See the Notes for `routeKey` behavior and the Android
back-button caveat (issue #1459).

**OS test creation version:** iOS 18.6 and 26.5, Android API Level 36.

## E2E test

TBD: Automation is planned and should be straightforward for the
button-driven push/pop steps (similar in scope to the tabs
`test-tabs-simple-nav` suite). Native back button, iOS edge-swipe gesture,
and Android hardware back steps may need platform-specific handling and are
not yet implemented.

## Prerequisites

- iOS device or simulator
- Android emulator or device

## Note

- Each screen shows two labels: `Name` (the route name: `Home`, `A`, or
  `B`) and `Key` (the route's unique `routeKey`). Use the `Key` value to
  tell apart multiple stacked instances of the same route name.
- The `Key` has the form `r-<routeName>-<n>`, where `<n>` comes from a
  global counter that increments on every push and is **never reset** for
  the lifetime of the app session (it is shared across all Stack
  containers). Do **not** expect specific numbers such as `r-A-1`: the
  exact suffix depends on how many screens were pushed earlier in the
  session and will differ between runs and after a JS reload. Only the
  **relationships** matter — every push produces a strictly new `Key`, and
  a preserved (not recreated) screen keeps the same `Key`.
- **Android:** the gamma Stack does not render a header back button, and
  the Android system/hardware back button does not currently pop the stack
  (see issue [#1459](https://github.com/software-mansion/react-native-screens-labs/issues/1459)). All back-button steps below are therefore **iOS
  only**; on Android use the on-screen **Pop** button to go back.

## Steps

### Baseline

1. Launch the app and navigate to the **Simple stack navigation** screen (Stack
   v5).

- [ ] The **Home** screen is shown with a light blue background, `Name:
  Home`, and a `Key` of the form `r-Home-<n>`. No back button is visible in
  the header. No **Pop** button is shown, only **Push A** and **Push B**.
  Note the displayed `Key` value to compare against later steps.

### Push navigation

2. Tap **Push A**.

- [ ] Screen **A** is pushed. Background is light yellow, `Name: A`, and a
  `Key` of the form `r-A-<n>` is shown (a new value, distinct from Home's).
  On iOS a native back button is visible in the header (Android shows no
  header back button). **Push A**, **Push B**, and **Pop** buttons are all
  shown. Note this `Key` value.

3. While on **A**, tap **Push B**.

- [ ] Screen **B** is pushed on top of **A**. Background is green, `Name:
  B`, and a new `Key` of the form `r-B-<n>` is shown (distinct from all
  previous keys). On iOS a native back button is visible in the header.
  Note this `Key` value.

### Re-pushing an already-present route

4. While on **B**, tap **Push A** again.

- [ ] A new instance of screen **A** is pushed on top of the stack (stack
  is now Home, A, B, A). `Name: A`, background light yellow, and a new
  `r-A-<n>` `Key` that is **different** from the `Key` shown in step 2.

### Pop via the on-screen button

5. Tap **Pop**.

- [ ] Returns to screen **B**. `Name: B` and the **same** `Key` value
  observed in step 3 (the instance was preserved, not recreated).

6. Tap **Pop** again.

- [ ] Returns to the original screen **A**. `Name: A` and the **same** `Key`
  value observed in step 2.

7. Tap **Pop** again.

- [ ] Returns to **Home**. No **Pop** button is shown and, on iOS, no
  header back button appears (root screen reached).

### Native header back button (iOS only)

8. On iOS, tap **Push A**, then tap **Push B**. Then tap the native back
   button in the header (not the **Pop** button).

- [ ] Tapping the native back button behaves the same as tapping **Pop**:
  returns to screen **A** with its `Key` unchanged. No crash and no
  inconsistent state.

### iOS edge-swipe-back gesture (iOS only)

9. On iOS, while on screen **A** or **B**, swipe from the left screen edge
   to the right to trigger the interactive pop gesture.

- [ ] Completing the swipe pops the current screen, identical in effect to
  tapping **Pop**. The screen below is shown with its original,
  unchanged `Key`.
- [ ] Starting the swipe and releasing before the halfway point cancels
  the gesture: the current screen returns to place and no navigation
  change occurs.

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
