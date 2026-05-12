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

Other: Planned, but will be implemented separately after research.

## Prerequisites

- iOS device or simulator
- Android emulator

## Note

- A toast labeled `onTabSelectionRejected` appears at the bottom of the
  screen whenever the callback fires.
- `heavyRender` is per-tab state. Toggling it on a given tab blocks the
  JS thread for 3 000 ms on every render of that tab, simulating a slow
  update that can arrive after the user has already acted.

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
   imediately tap the **Second** tab bar item.

- [ ] Expected: The tab bar changes to **Second** immediately. After
  the heavy render on Third finishes, a toast labeled
  `onTabSelectionRejected` appears. The final active tab is
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
  imediately but after the 3 000 ms block, the final active tab is
  **Third**.

6. Tap **Toggle rejectStaleNavStateUpdates** to re-enable it.

- [ ] Expected: Label updates to `rejectStaleNavStateUpdates: true`.

7. Repeat the actions from step 5.

- [ ] Expected: The tab bar changes to **Second** immediately. After
  the heavy render on Third finishes, a toast labeled
  `onTabSelectionRejected` appears. The final active tab is
  **Second**, not Third.
