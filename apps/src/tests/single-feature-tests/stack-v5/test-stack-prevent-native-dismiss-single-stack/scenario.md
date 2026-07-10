# Test Scenario: Prevent Native Dismiss - Single Stack

## Details

**Description:** Verify the `preventNativeDismiss` route option on the
gamma/v5 `StackContainer`. When **Enabled**, native dismissal (the Android
system/hardware back button, the native header back-button chevron, and the
system gesture-back / edge swipe) is blocked and `onNativeDismissPrevented`
fires (a green toast is shown); the screen stays put. When **Disabled**,
those same native gestures pop the stack normally. The on-screen **Pop**
button is JS-driven and always pops regardless of the flag. The stack starts
on **Home** and pushes **A** (`preventNativeDismiss` disabled) and **B**
(`preventNativeDismiss` enabled, with a **Toggle Prevent Native Dismiss**
button). See the Notes for `Instance` behavior and how Android is launched
directly to work around issue #1459.

**OS test creation version:** Android API Level 36.

## E2E test

TBD: Automation is plausible - the system back button, the native header
back-button chevron, and the on-screen buttons are all Detox-drivable on
Android - but no e2e test has been implemented yet. The system gesture-back
(edge swipe) step may need platform-specific handling.

## Prerequisites

- Android emulator or device

### Android launch

- To test the native-back / gesture-back flows, run the screen **directly**
  by editing [apps/App.tsx](../../../../../App.tsx): import and render
  `TestStackPreventNativeDismissSingleStack` as the root component instead of
  `Example`, e.g.:

  ```tsx
  import { TestStackPreventNativeDismissSingleStack as Example } from './src/tests/single-feature-tests';
  ```

  With the gamma `StackContainer` at the root, the Android system back button
  and gesture-back interact with the stack directly. When the screen is
  nested inside the example app's own navigation, native back navigates out
  to the system/selection menu instead of popping the stack (issue
  [#1459](https://github.com/software-mansion/react-native-screens-labs/issues/1459)),
  which is why Android is tested via the direct launch.

- The system gesture-back requires **Gesture navigation** to be enabled on
  the emulator/device. If it is not already set, enable it manually in
  **Settings → Navigation mode → select Gesture navigation**.

## Note

- iOS does not yet support `preventNativeDismiss` for stack v5 - it is unimplemented.
- Each screen shows an `Instance` number - a **test-owned** counter that
  increments once per mounted screen instance (it does **not** rely on the
  library's internal `routeKey`, which is an implementation detail). Do
  **not** expect specific numbers; only the **relationships** matter - every
  push produces a strictly new (higher) `Instance`, and a preserved (not
  recreated) screen keeps the same `Instance`.
- Route **A** starts with `preventNativeDismiss` **Disabled**; route **B**
  starts with it **Enabled**. On **B**, the **Toggle Prevent Native
  Dismiss** button flips the flag at runtime via `setRouteOptions`.
- The on-screen **Pop** button always pops regardless of the flag.

## Steps

### Baseline

1. Launch the app directly via `App.tsx` so the
   **Home** screen is shown.

- [ ] **Home** is shown, `Name: Home` and an
      `Instance` number. No header/back button is visible. Only **Push A** /
      **Push B** buttons are shown (no **Pop** button).

### Push navigation and initial state

2. Tap **Push A**.

- [ ] Screen **A** is shown with a header titled "A" and
      a back-button chevron. Shows `Name: A`, an `Instance` number, and
      **Prevent native dismiss: Disabled**. **Push A** / **Push B** / **Pop**
      buttons are all present.

1. On **A**, tap **Push B**.

- [ ] Screen **B** is shown with a header titled "B" and a
      back-button chevron. Shows `Name: B`, an `Instance` number higher than
      A's, and **Prevent native dismiss: Enabled**. **Push A** / **Push
      B** / **Pop** and a **Toggle Prevent Native Dismiss** button are all
      present.

### Native dismiss blocked while Enabled (screen B)

4. On **B** (prevent native dismiss Enabled), tap the native header back-button chevron.

- [ ] The tap is intercepted: a green toast reading "Native dismiss
      prevented" appears, and the app remains on **B** (no pop, `Instance`
      unchanged).

5. On **B**, perform a system gesture-back: swipe from the left screen edge
   to the right.

- [ ] The gesture is intercepted: the green toast appears, and the app
      remains on **B**. No pop occurs.

6. Repeat tapping the header back-button chevron three or four times in
   quick succession.

- [ ] Each tap is intercepted individually; a new toast appears each time;
      the app never pops off of **B**.

### Native dismiss allowed while Disabled (screen A)

7. Tap the on-screen **Pop** button to return to **A**.
   Confirm **A** shows **Prevent native dismiss: Disabled**.
   Tap the native header back-button chevron.

- [ ] The chevron pops the stack normally, the app returns to the screen below
      **A**. **No toast** is shown (dismissal is not prevented while
      Disabled).

8. Push **A** again so it is on top with a screen below it. On **A**,
   perform a system gesture-back: swipe from the left screen edge to the
   right.

- [ ] The gesture pops the stack normally. No toast is shown.

### Toggling the flag at runtime (screen B)

9. From **Home**, tap **Push B** so **B** (Prevent native dismiss Enabled)
   is directly above Home. Tap **Toggle Prevent Native Dismiss**.

- [ ] The label updates to **Prevent native dismiss: Disabled**.

10. With **B** now Disabled, tap the native header back-button chevron.

- [ ] The chevron pops **B** normally and returns to **Home**. No toast is
      shown.

11. From **Home**, tap **Push B** again so **B** (Prevent native dismiss
    Enabled) is on top. Tap the native header back-button chevron.

- [ ] The chevron is intercepted: the green toast appears and the app remains
      on **B**.

### JS-driven Pop always works regardless of the flag

12. On **B** (prevent native dismiss Enabled), tap the on-screen **Pop**
    button.

- [ ] App pops back to **Home** normally. **No toast** is shown - the on-screen
      **Pop** bypasses `preventNativeDismiss` entirely.

### Edge case: toggling immediately before a native dismiss

13. From **Home**, tap **Push B**. On **B**, tap **Toggle Prevent Native
    Dismiss** to Disabled, then immediately toggle it back to Enabled, then
    immediately press the native header back-button chevron.

- [ ] The most recent toggle takes effect before the back press: since
      prevent is Enabled at press time, back is intercepted (toast shown, app
      stays on **B**).
