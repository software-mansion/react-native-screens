# Test Scenario: Stale update rejection

## Details

**Description:** Verifies the `rejectStaleNavStateUpdates` prop on `TabsHost`
and the `onTabSelectionRejected` callback that fires when the native container
rejects a navigation state update. When `rejectStaleNavStateUpdates` is `true`,
the native side rejects any state update whose provenance baseline has been
superseded - meaning a newer state of a different origin
was committed before the JS update reached the UI thread. Each rejection fires
`onTabSelectionRejected` with a `TabSelectionRejectedEvent` payload.

**OS test creation version:** iOS: 18.6 and 26.4, Android: API Level 36.

## E2E test

Incomplete: Steps 1–3 (rejectStaleNavStateUpdates:true) and steps 4–5
(rejectStaleNavStateUpdates:false) are covered as separate test suites,
each preceded by a reloadReactNative to guarantee a clean baseline.

Not covered:
Testing changes to rejectStaleNavStateUpdates within the same session - including
switching from false back to true - is not automated. Due to inconsistent behavior
in Detox when toggling this setting at runtime, the only reliable way to verify
the logic for both states is to restart the app between tests.

## Prerequisites

- iOS device or simulator
- Android emulator

## Note

- A toast labeled `onTabSelectionRejected` appears at the bottom of the
  screen whenever the callback fires.
- `heavyRender` is per-tab state. Toggling it on a given tab blocks the
  JS thread for 3 000 ms on every render of that tab, simulating a slow
  update that can arrive after the user has already acted.
- Runtime State Changes (Steps 5–7): Automated coverage is limited to fresh app
launches. Testing the transition from true to false and back to true mid-session
(starting at Step 5) must be done manually.
Attention: Because of the 3000ms "heavy render" window, these steps are highly
sensitive to timing. If the interaction is too slow, you will get a false pass.
Ensure the app's behavior strictly matches the expected results at each transition.

## Steps

### Baseline

1. Launch the app and navigate to **Stale update rejection**.

- [ ] Expected: The **First** tab is selected. The content area shows
  `heavyRender: false` and `rejectStaleNavStateUpdates: true`.
  No toast is visible.

---

### Stale rejection triggered by heavy render

2. Tap the **Third** tab in the native tab bar to navigate to it. Tap
   **Toggle heavyRender** on the Third tab to enable heavy render.

- [ ] Expected: The label updates to `heavyRender: true`. No toast
  appears.

3. Tap the **First** tab bar item to go back to the First tab. Tap
   **Select Third** (JS dispatches a navigation update to Third), then
   immediately tap the **Second** tab bar item.

- [ ] Expected: The tab bar changes to **Second** immediately. After
  the heavy render on Third finishes, a toast labeled
  `onTabSelectionRejected: Third` appears. The final active tab is
  **Second**, not Third.

---

### Disabling rejectStaleNavStateUpdates at runtime

4. Navigate to the **Third** tab (heavy render still enabled). Tap
   **Toggle rejectStaleNavStateUpdates** to disable it.

- [ ] Expected: The label updates to `rejectStaleNavStateUpdates:
  false`. No toast fires from this action.

5. Navigate back to **First**. Tap **Select Third**, then immediately
   tap **Second** in the tab bar before the heavy render ends.

- [ ] Expected: No `onTabSelectionRejected` toast appears. Tab Second is selected
  immediately but after the 3 000 ms block, the final active tab is
  **Third**.

6. Tap **Toggle rejectStaleNavStateUpdates** to re-enable it.

- [ ] Expected: Label updates to `rejectStaleNavStateUpdates: true`.

7. Repeat the actions from step 5.

- [ ] Expected: The tab bar changes to **Second** immediately. After
  the heavy render on Third finishes, a toast labeled
  `onTabSelectionRejected: Third` appears. The final active tab is
  **Second**, not Third.
