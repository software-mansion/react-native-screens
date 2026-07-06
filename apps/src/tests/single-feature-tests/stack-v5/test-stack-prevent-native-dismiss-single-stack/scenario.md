# Test Scenario: Prevent Native Dismiss - Single Stack

## Details

**Description:** Verifies that enabling `preventNativeDismiss` on a
gamma Stack route blocks Android native dismissal (system back and the
header back-button chevron) and fires `onNativeDismissPrevented`, while
the on-screen **Pop** button always pops regardless of the flag.

**OS test creation version:** Android: API Level 36

## E2E test

TBD: Automation is plausible — the system back button, the header
back-button chevron, and the on-screen buttons are all Detox-drivable
on Android — but no e2e test has been implemented yet.

## Prerequisites

- Android emulator or device

## Note

- Android-only feature (no iOS implementation); do not run this screen
on iOS. Both `A` and `B` render a header with a back-button chevron;
the chevron is intercepted identically to the system back button. The
on-screen **Pop** button is JS-driven and always pops regardless of
the flag.
- Known-issue caveat
([#1459](https://github.com/software-mansion/react-native-screens-labs/issues/1459)):
when `preventNativeDismiss` is **disabled**, native back (system button
and header chevron) navigates out to the system menu instead of popping
the stack. Steps exercising native dismissal while the flag is Disabled
were removed until this is fixed; only native-back-while-Enabled
(interception) steps remain.
- `Key` values (`r-<routeName>-<n>`) use a session-global counter that
never resets — only verify relationships: a push yields a new, higher
key; popping back to a preserved instance keeps its original key.

## Steps

### Baseline

1. Launch the app and navigate to the **Prevent native dismiss -
   single stack** screen.

- [ ] **Home** screen is shown (blue background). No header/back
      button is visible. Only
      **Push A** / **Push B** buttons are shown (no Pop button).

### Push navigation and initial state

2. Tap **Push A**.

- [ ] Screen **A** is shown (yellow background) with a header titled
      "A" and a back-button chevron. Shows `Name: A` and a `Key`
      `r-A-<n>`. Shows "Prevent native dismiss: Disabled". Push A /
      Push B / Pop buttons are all present.

3. On A, tap **Push B**.

- [ ] Screen **B** is shown (green background) with a header titled
      "B" and a back-button chevron. Shows `Name: B` and a `Key`
      `r-B-<m>`, higher than A's key. Shows "Prevent native dismiss:
      Enabled". Push A / Push B / Pop, and a **Toggle Prevent Native
      Dismiss** button are all present.

### Native dismiss blocked while enabled

4. On B (prevent native dismiss Enabled), press the Android system/
   hardware back button.

- [ ] Back press is intercepted: a green toast reading "Native dismiss
      prevented" appears, and the app remains on screen **B** (no pop
      occurs).

5. On B, tap the header's back-button chevron.

- [ ] Same as step 4: the tap is intercepted, the green toast appears
      again, and the app remains on screen **B**.

6. Repeat step 4 (system back) three or four times in quick
   succession.

- [ ] Each press is intercepted individually; the toast reappears (or
      re-queues) each time; the app never pops off of **B**.

### JS-driven Pop always works regardless of the flag

7. On B (prevent native dismiss still Enabled), tap the on-screen
   **Pop** button.

- [ ] App pops back to screen **A** normally. No toast is shown — Pop
      bypasses `preventNativeDismiss` entirely.

### Edge case: toggling immediately before a native dismiss

8. From A, tap **Push B**. On B, tap **Toggle Prevent Native
   Dismiss** to Disabled, then immediately toggle it back to Enabled,
   then immediately press the system back button.

- [ ] The most recent toggle takes effect before the back press: since
      prevent is Enabled at press time, back is intercepted (toast
      shown, app stays on B).
