# Test Scenario: Stack lifecycle events

## Details

**Description:** Verifies that `onWillAppear`, `onDidAppear`,
`onWillDisappear`, and `onDidDisappear` fire in the correct order on stack
navigation, covering push, pop via the **Pop** button, pop via the **header
back button**, and pop via the **native back gesture / system back**. The same
push and pop checks are then repeated **inside a nested stack** and **across
the nested-stack boundary** (popping the whole container back to the outer
stack), exercising every dismissal method available at each level.

**OS test creation version:** iOS: 18.6 and 26.2, Android: API Level 36.

## E2E test

Incomplete: Each block contains a per-platform suite, as the two platforms fire
a different lifecycle event set and require distinct matchers within the example
app harness.

- iOS: steps 1–14. react-native-screens detaches covered screens on iOS, so
  every `Name:` and button matcher resolves to a single element (the top
  screen). Both the leaving and the entering screen fire on every transition,
  and each transition is exercised through **all** of its dismissal methods —
  the on-screen **Pop** button, the **native header back button** (steps 3, 8,
  12), the **edge-swipe / system gesture-back** (steps 4, 9, 11), and the
  **outer NestedStack header back button's** cross-boundary shortcut that pops
  `NestedA → Home` in one step (step 14) — each asserted to produce the
  identical toast event set.

- Android (`describeIfAndroid`): steps 1, 2, 5, 6, 7, 10, and 13 — the
  Pop-button-driven push/pop path only (top level, inner nested stack, and the
  nested-stack-root-bubbles-to-container-pop case). Unlike iOS, covered screens
  remain attached on Android, so stacked screens render duplicate buttons and
  labels; the suite taps and asserts on the topmost match (the last item in the
  hierarchy). Additionally, `<Button>` titles render uppercased (`PUSH A`,
  `POP`) and are matched in that form. Only the entering or leaving screen
  fires.

**Manual only (not automated):**

- Android: Steps 3, 4, 8, 9, 11, 12, and 14 (the native header back button, the
  edge-swipe / system gesture-back, and the outer-back boundary case). Within
  the shared e2e app the screen is reached through the example app's own
  navigation, where native back and gesture-back navigate out to the selection
  menu instead of popping the nested `StackContainer` (issue #1459). Verify
  these via the direct `App.tsx` launch documented below; each produces an event
  set already automated via the equivalent Pop-button dismissals and on iOS.

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

- **iOS and Android fire a fundamentally different set of events**, so verify
  each platform against its own column below.

  **Android** — only the screen entering or leaving the stack fires; the
  screen underneath stays silent:
  - **Push (Y pushed over X):** only the pushed screen fires —
    `Y: onWillAppear`, then `Y: onDidAppear`. X fires nothing.
  - **Pop (Y popped, back to X):** only the popped screen fires —
    `Y: onWillDisappear`, then `Y: onDidDisappear`. X fires nothing.

  **iOS** — both screens fire; push and pop share the same interleaving —
  the leaving screen's disappear brackets the entering screen's appear
  (`willDisappear` → `willAppear` → `didDisappear` → `didAppear`):
  - **Push (Y pushed over X)** — X is leaving, Y is entering:
    1. `X: onWillDisappear`
    2. `Y: onWillAppear`
    3. `X: onDidDisappear`
    4. `Y: onDidAppear`
  - **Pop (Y popped, back to X)** — Y is leaving, X is entering:
    1. `Y: onWillDisappear`
    2. `X: onWillAppear`
    3. `Y: onDidDisappear`
    4. `X: onDidAppear`

- **Nested stack:** pushing the `NestedStack` route also mounts its inner
  stack's initial screen (`NestedHome`), so the appearance events are
  **duplicated** — both `NestedStack` and `NestedHome` fire their appear
  events on both platforms. The same duplication applies on pop.

  Navigation **inside** the nested stack (`NestedHome` ↔ `NestedA`) fires only
  the inner screens and behaves exactly like a top-level push/pop — the outer
  `NestedStack` route and `Home` stay silent. Crossing the **boundary** back
  out (`NestedStack` → `Home`) pops the whole container and fires the
  duplicated events described above.

- The dismissal method (Pop button, header back button, or native back
  gesture / system back) must **not** change which events fire — all three
  produce the same pop event set for the same transition. This holds at every
  level: the top-level stack, the inner nested stack, and the container
  boundary.

- The pushed `NestedStack` route keeps its own header, so inside the
  nested stack there are **two back buttons**. On iOS the **inner** one (in the active
  nested screen's header) pops within the nested stack, while the **outer** one
  (in the `NestedStack` header) pops the **whole container**
  back to `Home` in a single step — even from `NestedA`, skipping `NestedHome`.
  On Android there is no such shortcut: the toolbar back arrow (like the system
  back) always pops the **innermost** screen first, one level at a time.

- Toasts stack and dismiss automatically. To dismiss a toast manually, tap
  it. Toast background colors by event type: `onWillAppear` — green,
  `onWillDisappear` — light navy, `onDidAppear` — light blue,
  `onDidDisappear` — dark navy.

## Steps

### Baseline

1. Launch the app and navigate to **Stack lifecycle events**.

- [ ] The **Home** screen is visible with the header title **Home** and
  buttons **Push A** and **Push NestedStack**. Two toasts appear for the
  initial Home appearance (both platforms):
  - `Home: onWillAppear`
  - `Home: onDidAppear`

---

### Push — Home → A

2. Tap **Push A**.

- [ ] Screen **A** (header title "A") is pushed.

  **iOS** — four toasts:
  1. `Home: onWillDisappear`
  2. `A: onWillAppear`
  3. `Home: onDidDisappear`
  4. `A: onDidAppear`

  **Android** — two toasts (only the pushed screen fires):
  1. `A: onWillAppear`
  2. `A: onDidAppear`

---

### Pop via header back button — A → Home

3. On screen **A**, tap the **header back button** (top-left).

- [ ] Screen **Home** is shown again.

  **iOS** — four toasts:
  1. `A: onWillDisappear`
  2. `Home: onWillAppear`
  3. `A: onDidDisappear`
  4. `Home: onDidAppear`

  **Android** — two toasts (only the popped screen fires):
  1. `A: onWillDisappear`
  2. `A: onDidDisappear`

---

### Pop via native back gesture / system back — A → Home

4. Tap **Push A** again. Then dismiss screen **A** using the **native back
   gesture**: swipe from the left screen edge.

- [ ] Screen **Home** is shown again. The same pop toasts appear as in step 3
  (iOS: four; Android: two), confirming the native gesture / system back
  produces the identical pop event set.

---

### Pop via Pop button — A → Home

5. Tap **Push A**, then on screen **A** tap the **Pop** button.

- [ ] Screen **Home** is shown again. The same pop toasts appear as in step 3
  (iOS: four; Android: two). The Pop button, the header back button
  (step 3), and the native gesture (step 4) all produce the identical pop
  event set.

---

### Nested stack — push

6. From **Home**, tap **Push NestedStack**.

- [ ] The **NestedStack** route is pushed and its inner stack shows
  **NestedHome** (buttons **Push NestedA**, **Pop**). **Two stacked headers**
  are visible — the outer **NestedStack** title (the pushed route) above the
  inner **NestedHome** title (the nested stack's initial screen). The
  appearance events are **duplicated** across the outer route and the nested
  initial screen — both `NestedStack` and `NestedHome` fire.

  **iOS** — six toasts (both containers' `onWillAppear` fire before the
  previous screen's `onDidDisappear`):
  1. `Home: onWillDisappear`
  2. `NestedStack: onWillAppear`
  3. `NestedHome: onWillAppear`
  4. `Home: onDidDisappear`
  5. `NestedStack: onDidAppear`
  6. `NestedHome: onDidAppear`

  **Android** — four toasts (`Home` fires nothing):
  1. `NestedStack: onWillAppear`
  2. `NestedHome: onWillAppear`
  3. `NestedStack: onDidAppear`
  4. `NestedHome: onDidAppear`

---

### Nested stack — inner push — NestedHome → NestedA

7. On **NestedHome**, tap **Push NestedA**.

- [ ] Screen **NestedA** (header title "NestedA") is pushed **inside the
  nested stack**. **Two stacked headers** remain visible — the outer
  **NestedStack** header above the inner **NestedA**
  header — so NestedA shows **two back buttons**;
  on Android the toolbar back arrow always pops the innermost screen first.
  Only the inner screens fire — the outer `NestedStack` route and `Home` stay
  silent — so this behaves exactly like a top-level push (step 2):

  **iOS** — four toasts:
  1. `NestedHome: onWillDisappear`
  2. `NestedA: onWillAppear`
  3. `NestedHome: onDidDisappear`
  4. `NestedA: onDidAppear`

  **Android** — two toasts (only the pushed screen fires):
  1. `NestedA: onWillAppear`
  2. `NestedA: onDidAppear`

---

### Nested stack — inner pop via header back button — NestedA → NestedHome

8. On screen **NestedA**, tap the **NestedA header back button** — the
   **lower** of the two back buttons, in the **NestedA** header. This pops
   within the nested stack.

- [ ] Screen **NestedHome** is shown again inside the nested stack. Only the
  inner screens fire — this is the inner mirror of the top-level pop (step 3):

  **iOS** — four toasts:
  1. `NestedA: onWillDisappear`
  2. `NestedHome: onWillAppear`
  3. `NestedA: onDidDisappear`
  4. `NestedHome: onDidAppear`

  **Android** — two toasts (only the popped screen fires):
  1. `NestedA: onWillDisappear`
  2. `NestedA: onDidDisappear`

---

### Nested stack — inner pop via native gesture — NestedA → NestedHome

9. Tap **Push NestedA** again. Then dismiss screen **NestedA** using the
   **native back gesture**: swipe from the left screen edge.

- [ ] Screen **NestedHome** is shown again inside the nested stack. The same
  inner pop toasts appear as in step 8 (iOS: four; Android: two), confirming
  the native gesture produces the identical inner pop event set.

---

### Nested stack — inner pop via Pop button — NestedA → NestedHome

10. Tap **Push NestedA**, then on screen **NestedA** tap the **Pop** button.

- [ ] Screen **NestedHome** is shown again inside the nested stack. The same
  inner pop toasts appear as in step 8 (iOS: four; Android: two). The Pop
  button, the header back button (step 8), and the native gesture (step 9) all
  produce the identical inner pop event set.

---

### Nested stack — pop to Home via native gesture — NestedStack → Home

11. On **NestedHome**, dismiss the screen using the **native back gesture**:
    swipe from the left screen edge.

- [ ] Screen **Home** is shown again. This pops the whole **NestedStack**
  container, so the appearance events are **duplicated** — both `NestedStack`
  and `NestedHome` fire their disappear events (the mirror of the push in
  step 6):

  **iOS** — six toasts (both containers' `onWillDisappear` fire before the
  entering screen's `onWillAppear`; the outer `NestedStack` fires before the
  inner `NestedHome`):
  1. `NestedStack: onWillDisappear`
  2. `NestedHome: onWillDisappear`
  3. `Home: onWillAppear`
  4. `NestedStack: onDidDisappear`
  5. `NestedHome: onDidDisappear`
  6. `Home: onDidAppear`

  **Android** — four toasts (`Home` fires nothing):
  1. `NestedHome: onWillDisappear`
  2. `NestedStack: onWillDisappear`
  3. `NestedHome: onDidDisappear`
  4. `NestedStack: onDidDisappear`

---

### Nested stack — pop to Home via NestedStack header back button

12. From **Home**, tap **Push NestedStack**. Then on **NestedHome** tap the
    **NestedStack header back button** in the upper
    **NestedStack** header (on Android, the toolbar back arrow).

- [ ] Screen **Home** is shown again. `NestedHome` is the nested stack's root
  screen, so the outer NestedStack header back button pops the whole
  **NestedStack** container from **NestedHome → Home**, producing the same
  container-pop toasts as in step 11 (iOS: six; Android: four). The header back
  button and the native gesture (step 11) produce the identical container-pop
  event set.

---

### Nested stack — pop to Home via Pop button — NestedStack → Home

13. From **Home**, tap **Push NestedStack** again. Then on **NestedHome** tap
    the **Pop** button.

- [ ] Screen **Home** is shown again. Because `NestedHome` is the nested
  stack's only (root) screen, the Pop button pops the whole **NestedStack**
  container rather than a screen within it, so the same container-pop toasts
  appear as in step 11 (iOS: six; Android: four).

  The Pop button, the header back button (step 12), and the native gesture
  (step 11) produce the identical container-pop event set.

---

### Nested stack — pop from NestedA via the outer NestedStack back button

14. From **Home**, tap **Push NestedStack**, then on **NestedHome** tap **Push
    NestedA**. On screen **NestedA**, tap the **outer NestedStack header back
    button** — the **upper** back button, in the **NestedStack** header,
    **not** the inner NestedA one used in step 8.

- [ ] **iOS** — the outer back button pops the **whole NestedStack container**
  in one step, going **NestedA → Home** and skipping `NestedHome`. The
  container's disappear events fire **outer-first** (`NestedStack` before the
  inner `NestedA`) — the same ordering as the container pop from `NestedHome`
  (steps 11–13), but with `NestedA` (the active inner screen) firing in place
  of `NestedHome`. `NestedHome` does **not** fire (it already disappeared when
  `NestedA` was pushed). Six toasts:
  1. `NestedStack: onWillDisappear`
  2. `NestedA: onWillDisappear`
  3. `Home: onWillAppear`
  4. `NestedStack: onDidDisappear`
  5. `NestedA: onDidDisappear`
  6. `Home: onDidAppear`

- [ ] **Android** — there is **no boundary shortcut**: the toolbar back arrow
  always pops the **innermost** screen first, so tapping it on `NestedA` pops
  **only NestedA → NestedHome** and does **not** dismiss the container. The
  event set is identical to the inner pop in step 8 — two toasts:
  1. `NestedA: onWillDisappear`
  2. `NestedA: onDidDisappear`

  To then pop the whole container on Android, press back again from
  **NestedHome** (the container-pop event set of step 11).
