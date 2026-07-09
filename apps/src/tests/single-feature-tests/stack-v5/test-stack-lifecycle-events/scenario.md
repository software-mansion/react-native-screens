# Test Scenario: Stack lifecycle events

## Details

**Description:** Verifies that `onWillAppear`, `onDidAppear`,
`onWillDisappear`, and `onDidDisappear` fire in the correct order on stack
navigation, covering push, pop via the **Pop** button, pop via the **header
back button**, pop via the **native back gesture / system back**, and a
nested stack.

**OS test creation version:** iOS: 18.6 and 26.2, Android: API Level 36.

## E2E test

- **TBD:** E2E test has to be implemented in future.

## Prerequisites

- iOS simulator or device (iPhone)
- Android emulator or device

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

- The dismissal method (Pop button, header back button, or native back
  gesture / system back) must **not** change which events fire — all three
  produce the same pop event set for the same transition.

- Toasts stack and dismiss automatically. To dismiss a toast manually, tap
  it. Toast background colors by event type: `onWillAppear` — green,
  `onWillDisappear` — light navy, `onDidAppear` — light blue,
  `onDidDisappear` — dark navy.

## Steps

### Baseline

1. Launch the app and navigate to **Stack lifecycle events**.

- [ ] The **Home** screen is visible with buttons **Push A** and **Push
  NestedStack**. Two toasts appear for the initial Home appearance
  (both platforms):
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
   gesture** (iOS: swipe from the left screen edge) or the **Android system
   back** (gesture / hardware button).

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
  **NestedHome** (buttons **Push NestedA**, **Pop**). The appearance events
  are **duplicated** across the outer route and the nested initial screen —
  both `NestedStack` and `NestedHome` fire.

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
  3. `NestedHome: onDidAppear`
  4. `NestedStack: onDidAppear`

---

### Nested stack — inner push / pop

7. On **NestedHome**, tap **Push NestedA**, then pop back with the **header
   back button**.

- [ ] Screen **NestedA** (header title "NestedA") is pushed inside the nested
  stack, then popped back to **NestedHome**. Push and pop fire the same
  per-platform event sets as at the top level (iOS: four per transition;
  Android: two per transition — appear for the entering screen on push,
  disappear for the leaving screen on pop).
