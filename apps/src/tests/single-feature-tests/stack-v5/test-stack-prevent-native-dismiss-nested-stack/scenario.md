# Test Scenario: Prevent Native Dismiss - Nested Stack

## Details

**Description:** Verifies how `preventNativeDismiss` behaves across a
Stack nested inside another Stack. A screen at the root of the nested
stack can block native dismissal from exiting into the parent stack.
Also verifies non-root screens inside the nested stack behave like a
single stack, and that each screen's `onNativeDismissPrevented` fires
its own distinct toast. See Note for mechanics and the currently
deferred back-button coverage ([#1459](https://github.com/software-mansion/react-native-screens-labs/issues/1459)).

**OS test creation version:** Android: API Level 36

## E2E test

TBD: Automation is plausible — the system back button, the header
back-button chevron, the on-screen buttons, and the Toggle button are
all Detox-drivable on Android — but no e2e test has been implemented
yet.

## Prerequisites

- Android emulator or device

## Note

- Android-only feature (no iOS implementation); do not run this screen
  on iOS.
- Back-button dismissal is **not yet covered** by this scenario. When a
  screen does not prevent dismissal, popping via the system
  navigation-bar back button and via the header back chevron does not
  work yet ([#1459](https://github.com/software-mansion/react-native-screens-labs/issues/1459)); steps covering both will be added once it is fixed.
  Until then, navigate back with the on-screen **Pop** button.
  (Pressing a native back button on a screen that *does* prevent
  dismissal still triggers the block — the steps below cover that.)
- `Key` values (`r-<routeName>-<n>`) use a session-global counter that
  never resets — only verify relationships: a push yields a new,
  higher key; popping back to a preserved instance keeps its key.
- When more than one ancestor screen has `preventNativeDismiss`
  enabled at once (e.g. **B**, then **NestedStack** -> **NestedHome**),
  only the current top screen intercepts native dismissal; ancestors
  further down are not reached until the current screen stops
  intercepting.

## Steps

### Baseline

1. Launch the app and navigate to the **Prevent native dismiss -
   nested stack** screen.

- [ ] **Home** screen is shown (blue background). No header/back
      chevron is visible. Only **Push A** / **Push B** / **Push
      NestedStack** buttons are shown (no Pop button).

### Push navigation and initial state (outer stack)

2. Tap **Push A**.

- [ ] Screen **A** is shown (yellow background) with a header titled
      "A" and a back chevron. Shows `Name: A` and a `Key`
      `r-A-<n>`. Shows "Prevent native dismiss: Disabled". Push A /
      Push B / Push NestedStack / Pop buttons are all present.

3. On A, tap **Push B**.

- [ ] Screen **B** is shown (green background) with a header titled
      "B" and a back chevron. Shows `Name: B` and a `Key` `r-B-<m>`,
      higher than A's key. Shows "Prevent native dismiss: Enabled".
      Push A / Push B / Push NestedStack / Pop and a
      **Toggle Prevent Native Dismiss** button are
      all present.

### Native dismiss blocked on B (outer stack)

4. On B (prevent Enabled), press the Android system/hardware back
   button.

- [ ] Back press is intercepted: a green toast reading "Native dismiss
      prevented - B" appears, and the app remains on screen **B**.

5. On B, tap the header's back chevron.

- [ ] Same as step 4: the tap is intercepted, the "Native dismiss
      prevented - B" toast appears again, app remains on **B**.

6. On B, tap the on-screen **Pop** button.

- [ ] App pops back to screen **A** normally, no toast shown. A's
      `Key` is unchanged from step 2.

### Entering the nested stack (nested root)

7. From A, tap **Push NestedStack**.

- [ ] The nested stack mounts and shows **NestedHome** (blue
      background). No header/back chevron is visible. Shows
      `Name: NestedHome` and a `Key` `r-NestedHome-<p>`, higher than
      any previous key. Shows "Prevent native dismiss: Enabled". Push
      NestedA / Push NestedB / Pop, and a Toggle button are present.

### Native dismiss blocked at the nested stack's root

8. On NestedHome (prevent Enabled), press the system back button.

- [ ] Back press is intercepted: a green toast reading "Native dismiss
      prevented - NestedHome" appears. The app stays on **NestedHome**
      — it does **not** exit the nested stack back to screen A.

9. Repeat step 8 (system back) two or three times in quick succession.

- [ ] Each press is intercepted individually; the toast reappears (or
      re-queues) each time; the app never leaves **NestedHome**.

### Toggling off the nested root

10. On NestedHome, tap **Toggle Prevent Native Dismiss**.

- [ ] The info label switches to "Prevent native dismiss: Disabled".

11. Tap the on-screen **Pop** button.

- [ ] Tapping **Pop** then exits the nested stack and returns to
      screen **A** (the outer screen that pushed NestedStack).

### Within-nested-stack navigation (non-root nested screens)

12. From A, tap **Push NestedStack** again.

- [ ] A new **NestedHome** instance is shown, with a `Key` higher than
      the one from step 7. "Prevent native dismiss: Enabled" again
      (fresh instance, default option restored).

13. On NestedHome, tap **Push NestedA**.

- [ ] Screen **NestedA** is shown (blue background) with a header
      titled "NestedA" and a back chevron. Shows `Name: NestedA` and a
      `Key` `r-NestedA-<q>`. Shows "Prevent native dismiss: Disabled".
      Push NestedA / Push NestedB / Pop buttons are present (no
      Toggle button).

14. On NestedA, tap the Pop button.

- [ ] Pops normally back to **NestedHome** within the nested stack, no
      toast. NestedHome's `Key` is preserved from step 12.

### Native dismiss blocked on NestedB

15. From NestedHome, tap **Push NestedB**.

- [ ] Screen **NestedB** is shown (blue background) with a header
      titled "NestedB" and a back chevron. Shows `Name: NestedB` and a
      `Key` `r-NestedB-<r>`. Shows "Prevent native dismiss: Enabled".
      A Toggle button is present.

16. On NestedB (prevent Enabled), press the system back button.

- [ ] Back press is intercepted: a green toast reading "Native dismiss
      prevented - NestedB" appears; app stays on **NestedB**.

17. On NestedB, tap the header's back chevron.

- [ ] Same as step 16: intercepted again, "Native dismiss prevented -
      NestedB" toast shown, app stays on **NestedB**.

### Pop button always works, even inside the nested stack

18. On NestedB (prevent still Enabled), tap the on-screen **Pop**
    button.

- [ ] Pops back to **NestedHome** normally, no toast shown. NestedHome
      is now the sole attached route of the nested stack.

19. On NestedHome, tap **Pop**.

- [ ] Since NestedHome is the only attached route left in the nested
      stack, Pop bubbles up and pops the whole **NestedStack** route
      from the outer stack: the app returns to screen **A**. No toast
      is shown — Pop bypasses `preventNativeDismiss` even when it
      triggers this container-level bubbling.

### Edge case: layered prevention across nesting levels

20. From A, tap **Push B**.

- [ ] Screen **B** is shown, "Prevent native dismiss: Enabled", with a
      `Key` higher than any seen so far.

21. On B, tap **Push NestedStack**.

- [ ] **NestedHome** is shown (fresh instance), "Prevent native
      dismiss: Enabled".

22. On NestedHome, press the system back button.

- [ ] Back press is intercepted by **NestedHome** specifically: the
      toast reads "Native dismiss prevented - NestedHome" (not "B"),
      confirming only the current top screen intercepts even though B
      below it also prevents. App stays on NestedHome.

23. On NestedHome, tap **Toggle Prevent Native Dismiss** to Disabled,
    then tap the on-screen **Pop** button.

- [ ] Tapping **Pop** exits the nested stack and returns to screen
      **B** (not A/Home) — the screen directly below NestedStack on
      the outer stack. No toast is shown.

24. Back on B (now the top screen again, still prevent Enabled), press
    the system back button.

- [ ] Back press is intercepted again: the toast now reads "Native
      dismiss prevented - B", and the app stays on **B** — B resumes
      blocking native dismissal once it becomes the top screen again.

25. On B, tap the on-screen **Pop** button.

- [ ] Pops back to screen **A** normally, no toast shown.
