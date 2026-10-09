# Test Scenario: Stack lifecycle events

## Details

**Description:** Verifies that `onWillAppear`, `onDidAppear`,
`onWillDisappear`, and `onDidDisappear` fire on stack
navigation, covering push, pop via the **Pop** button, pop via the **header
back button**, and pop via the **native back gesture / system back**. The same
push and pop checks are then repeated **inside a nested stack** and **across
the nested-stack boundary** (popping the whole container back to the outer
stack), exercising every dismissal method available at each level. The
interleaving of the participating screens' events is not verified on either
platform — only the event set (automated) and each screen's own
`onWill*` → `onDid*` order (manual only; see **Note**).

**OS test creation version:** iOS: 18.6 and 26.2, Android: API Level 36.

## E2E test

Incomplete.

- iOS: all steps are automated.
- Android: steps 1, 2, 5, 6, 7, 10, and 13 - the
  Pop-button-driven push/pop path only.

**Manual only (not automated):**

- Android: Steps 3, 4, 8, 9, 11, 12, and 14 (the native header back button, the
  edge-swipe / system gesture-back, and the outer-back boundary case).
- Event order, on both platforms and in every step. The automated run matches
  toasts by message and ignores the `<n>.` prefix, so it asserts only that the
  expected set fired — neither the interleaving between screens nor each
  screen's own `onWill*` → `onDid*` order. Every "before" check in the steps
  below is a manual one.
  
## Prerequisites

- iOS simulator or device (iPhone)
- Android emulator or device

## Android launch

- To test the native-back / gesture-back pop flows, run the screen
  **directly** by editing [apps/App.tsx](../../../../../App.tsx): import and
  render `TestStackLifecycleEvents` as the root component instead of
  `Example`, e.g.:

  ```tsx
  import { TestStackLifecycleEvents as Example } from './src/tests/single-feature-tests';
  ```

  With the v5 `StackContainer` at the root, native back and gesture-back
  interact with the stack directly. When the screen is nested inside the
  example app's own navigation, native back navigates out to the
  system/selection menu instead of popping the stack (issue
  [#1459](https://github.com/software-mansion/react-native-screens-labs/issues/1459)),
  which is why Android is tested via the direct launch.

- The system gesture-back requires **Gesture navigation** to be enabled on
  the emulator/device. If it is not already set, enable it manually in
  **Settings → Navigation mode → select Gesture navigation**.

## Note

- **The interleaving of the screens' events is never asserted**, on either
  platform: it differs between the platforms and between iOS versions (iOS 27
  reorders the appear/disappear callbacks). Every step below therefore lists an
  **unordered set**. Verify that the whole set fires - none missing, none
  duplicated, and none for a screen not taking part in the transition - and
  that **each screen's own events stay in order** (`onWill*` before
  `onDid*`).

- **Both screens fire on every transition on both platforms** - the entering
  and the leaving screen each emit their pair, so iOS and Android fire the
  same event set in every step:
  - **Push (Y pushed over X)** - X is leaving, Y is entering:
    - `X: onWillDisappear` before `X: onDidDisappear`
    - `Y: onWillAppear` before `Y: onDidAppear`
  - **Pop (Y popped, back to X)** - Y is leaving, X is entering:
    - `Y: onWillDisappear` before `Y: onDidDisappear`
    - `X: onWillAppear` before `X: onDidAppear`

- **Nested stack:** pushing the `NestedStack` route also mounts its inner
  stack's initial screen (`NestedHome`), so the appearance events are
  **duplicated** - both `NestedStack` and `NestedHome` fire their appear
  events on both platforms. The same duplication applies on pop.

  Navigation **inside** the nested stack (`NestedHome` ↔ `NestedA`) fires only
  the inner screens and behaves exactly like a top-level push/pop - the outer
  `NestedStack` route and `Home` stay silent. Crossing the **boundary** back
  out (`NestedStack` → `Home`) pops the whole container and fires the
  duplicated events described above.

- The dismissal method (Pop button, header back button, or native back
  gesture / system back) must **not** change which events fire - all three
  produce the same pop event set for the same transition. This holds at every
  level: the top-level stack, the inner nested stack, and the container
  boundary. Note that the **outer** header back button triggers the
  container-pop transition even while a deeper nested screen is active,
  whereas the Android system back / gesture-back from that same screen pops
  the innermost screen - those are different transitions, each with its own
  event set (see step 14).

- **Android, cancelled back gesture:** predictive back prepares the pop when
  the gesture starts and reverts it on cancel, so a cancelled gesture emits
  the pop-start events (`Y: onWillDisappear`, `Y: onDidDisappear`,
  `X: onWillAppear`) followed by their reversal (`Y: onWillAppear`,
  `X: onDidDisappear`, `Y: onDidAppear`), ending on an unchanged screen.

- The pushed `NestedStack` route keeps its own header, so inside the
  nested stack there are **two back buttons**. On both platforms the **inner**
  one (in the active nested screen's header) pops within the nested stack,
  while the **outer** one (in the `NestedStack` header) pops the **whole
  container** back to `Home` in a single step - even from `NestedA`. The
  Android system back / gesture-back has no such shortcut: it always pops the
  **innermost** screen first, one level at a time.

- A toast is labelled `<n>. <ScreenName>: <event>`, where `<n>` is its
  1-based position in the emission order - a lower number fired earlier, so
  use the prefixes to check each screen's `onWill*` → `onDid*` order.
  Dismissing a toast renumbers those behind it.

- Toasts stack and dismiss automatically. To dismiss a toast manually, tap
  it. Toast background colors by event type: `onWillAppear` - green,
  `onWillDisappear` - light navy, `onDidAppear` - light blue,
  `onDidDisappear` - dark navy.

## Steps

### Baseline

1. Launch the app and navigate to **Stack lifecycle events**.

- [ ] The **Home** screen is visible with the header title **Home** and
      buttons **Push A** and **Push NestedStack**. Two toasts appear for the
      initial Home appearance (both platforms):
  - `Home: onWillAppear` before `Home: onDidAppear`

---

### Push - Home → A

2. Tap **Push A**.

- [ ] Screen **A** (header title "A") is pushed. Four toasts (both platforms):
  - `Home: onWillDisappear` before `Home: onDidDisappear`
  - `A: onWillAppear` before `A: onDidAppear`

---

### Pop via header back button - A → Home

3. On screen **A**, tap the **header back button** (top-left).

- [ ] Screen **Home** is shown again. Four toasts (both platforms):
  - `A: onWillDisappear` before `A: onDidDisappear`
  - `Home: onWillAppear` before `Home: onDidAppear`

---

### Pop via native back gesture / system back - A → Home

4. Tap **Push A** again. Then dismiss screen **A** using the **native back
   gesture**: swipe from the left screen edge.

- [ ] Screen **Home** is shown again. The same pop toasts appear as in step 3
      (four on both platforms), confirming the native gesture / system back
      produces the identical pop event set.

---

### Pop via Pop button - A → Home

5. Tap **Push A**, then on screen **A** tap the **Pop** button.

- [ ] Screen **Home** is shown again. The same pop toasts appear as in step 3
      (four on both platforms). The Pop button, the header back button
      (step 3), and the native gesture (step 4) all produce the identical pop
      event set.

---

### Nested stack - push

6. From **Home**, tap **Push NestedStack**.

- [ ] The **NestedStack** route is pushed and its inner stack shows
      **NestedHome** (buttons **Push NestedA**, **Pop**). **Two stacked headers**
      are visible - the outer **NestedStack** title (the pushed route) above the
      inner **NestedHome** title (the nested stack's initial screen). The
      appearance events are **duplicated** across the outer route and the nested
      initial screen - both `NestedStack` and `NestedHome` fire. Six toasts
      (both platforms):
  - `Home: onWillDisappear` before `Home: onDidDisappear`
  - `NestedStack: onWillAppear` before `NestedStack: onDidAppear`
  - `NestedHome: onWillAppear` before `NestedHome: onDidAppear`

---

### Nested stack - inner push - NestedHome → NestedA

7. On **NestedHome**, tap **Push NestedA**.

- [ ] Screen **NestedA** (header title "NestedA") is pushed **inside the
      nested stack**. **Two stacked headers** remain visible - the outer
      **NestedStack** header above the inner **NestedA**
      header - so NestedA shows **two back buttons** (the inner one pops within
      the nested stack, the outer one pops the whole container - see step 14).
      Only the inner screens fire - the outer `NestedStack` route and `Home` stay
      silent - so this behaves exactly like a top-level push (step 2). Four
      toasts (both platforms):
  - `NestedHome: onWillDisappear` before `NestedHome: onDidDisappear`
  - `NestedA: onWillAppear` before `NestedA: onDidAppear`

---

### Nested stack - inner pop via header back button - NestedA → NestedHome

8. On screen **NestedA**, tap the **NestedA header back button** - the
   **lower** of the two back buttons, in the **NestedA** header. This pops
   within the nested stack.

- [ ] Screen **NestedHome** is shown again inside the nested stack. Only the
      inner screens fire - this is the inner mirror of the top-level pop
      (step 3). Four toasts (both platforms):
  - `NestedA: onWillDisappear` before `NestedA: onDidDisappear`
  - `NestedHome: onWillAppear` before `NestedHome: onDidAppear`

---

### Nested stack - inner pop via native gesture - NestedA → NestedHome

9. Tap **Push NestedA** again. Then dismiss screen **NestedA** using the
   **native back gesture**: swipe from the left screen edge.

- [ ] Screen **NestedHome** is shown again inside the nested stack. The same
      inner pop toasts appear as in step 8 (four on both platforms), confirming
      the native gesture produces the identical inner pop event set.

---

### Nested stack - inner pop via Pop button - NestedA → NestedHome

10. Tap **Push NestedA**, then on screen **NestedA** tap the **Pop** button.

- [ ] Screen **NestedHome** is shown again inside the nested stack. The same
      inner pop toasts appear as in step 8 (four on both platforms). The Pop
      button, the header back button (step 8), and the native gesture (step 9) all
      produce the identical inner pop event set.

---

### Nested stack - pop to Home via native gesture - NestedStack → Home

11. On **NestedHome**, dismiss the screen using the **native back gesture**:
    swipe from the left screen edge.

- [ ] Screen **Home** is shown again. This pops the whole **NestedStack**
      container, so the appearance events are **duplicated** - both `NestedStack`
      and `NestedHome` fire their disappear events (the mirror of the push in
      step 6). Six toasts (both platforms):
  - `NestedStack: onWillDisappear` before `NestedStack: onDidDisappear`
  - `NestedHome: onWillDisappear` before `NestedHome: onDidDisappear`
  - `Home: onWillAppear` before `Home: onDidAppear`

---

### Nested stack - pop to Home via NestedStack header back button

12. From **Home**, tap **Push NestedStack**. Then on **NestedHome** tap the
    **NestedStack header back button** in the upper
    **NestedStack** header (on Android, the toolbar back arrow).

- [ ] Screen **Home** is shown again. `NestedHome` is the nested stack's root
      screen, so the outer NestedStack header back button pops the whole
      **NestedStack** container from **NestedHome → Home**, producing the same
      container-pop toasts as in step 11 (six on both platforms). The header back
      button and the native gesture (step 11) produce the identical container-pop
      event set.

---

### Nested stack - pop to Home via Pop button - NestedStack → Home

13. From **Home**, tap **Push NestedStack** again. Then on **NestedHome** tap
    the **Pop** button.

- [ ] Screen **Home** is shown again. Because `NestedHome` is the nested
      stack's only (root) screen, the Pop button pops the whole **NestedStack**
      container rather than a screen within it, so the same container-pop toasts
      appear as in step 11 (six on both platforms).

  The Pop button, the header back button (step 12), and the native gesture
  (step 11) produce the identical container-pop event set.

---

### Nested stack - pop from NestedA via the outer NestedStack back button

14. From **Home**, tap **Push NestedStack**, then on **NestedHome** tap **Push
    NestedA**. On screen **NestedA**, tap the **outer NestedStack header back
    button** - the **upper** back button, in the **NestedStack** header,
    **not** the inner NestedA one used in step 8.

- [ ] The outer back button (on Android, the outer toolbar back arrow) pops the
      **whole NestedStack container** in one step, going **NestedA → Home** and
      skipping `NestedHome`. The same event set as the container pop from
      `NestedHome` (steps 11–13), but with `NestedA` (the active inner screen)
      firing in place of `NestedHome`. `NestedHome` does **not** fire (it
      already disappeared when `NestedA` was pushed). Six toasts (both
      platforms):
  - `NestedStack: onWillDisappear` before `NestedStack: onDidDisappear`
  - `NestedA: onWillDisappear` before `NestedA: onDidDisappear`
  - `Home: onWillAppear` before `Home: onDidAppear`
