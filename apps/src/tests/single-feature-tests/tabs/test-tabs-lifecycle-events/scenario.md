# Test Scenario: Tabs lifecycle events

## Details

**Description:** Verifies that `onWillAppear`, `onDidAppear`,
`onWillDisappear`, and `onDidDisappear` fire on tab switches, covering
happy-path transitions, re-tapping the active tab, and rapid switching.
Both platforms fire the same four events per switch; only the interleaving
differs, so it is not verified — see **Note**.

**OS test creation version:** iOS: 18.6 and 26.2, Android: API Level 36.

## E2E test

Incomplete: The E2E test covers steps 1–4 on both iPhone and
Android, verifying baseline appearance events and all three tab-switch
transitions. On both platforms toasts are matched by message only, so the
event set is asserted without the interleaving. The re-tap (step 5) is covered
only for Android as for iOS 26+ Detox is not able to re-tap a tab bar item.

Not automated:

- Rapid switching (step 6) — cannot be reliably triggered through Detox's
  synchronous interaction model.
- Full 12-toast sequence (step 7) — too fragile due to shifting toast indices
  on each dismiss.

## Prerequisites

- iOS simulator or device (iPhone)
- Android emulator or device

## Note

- All four events should fire on every tab switch between TabX (leaving) and
  TabY (arriving). **Both platforms fire the same four events** — only the
  interleaving of the two tabs differs: iOS brackets them (the arriving tab's
  `onWillAppear` comes first), while Android runs the leaving tab to
  completion before the arriving one starts. It also differs between iOS
  versions (iOS 27 reorders the appear/disappear callbacks), so the
  interleaving is **not** verified on either platform. Check instead that:
  - all four events fire — none missing, none duplicated, and none for a tab
    not taking part in the switch;
  - each tab's own two events are in order — `TabY: onWillAppear` before
    `TabY: onDidAppear`, and `TabX: onWillDisappear` before
    `TabX: onDidDisappear`.
- A toast is labelled `<n>. <TabName>: <event>`, where `<n>` is its 1-based
  position in the emission order — a lower number fired earlier, so use the
  prefixes to check the per-tab `onWill*` → `onDid*` order. Dismissing a toast
  renumbers those behind it.
- Toasts stack and dismiss automatically. To dismiss a toast manually,
  tap it. Toast background colors by event type:
  `onWillAppear` — green, `onWillDisappear` — light navy,
  `onDidAppear` — light blue, `onDidDisappear` — dark navy.
- Re-tapping the currently active tab must not fire any lifecycle events.

## Steps

### Baseline

1. Launch the app and navigate to **Tabs lifecycle events**.

- [ ] Three tabs are visible in the tab bar: **Tab A**, **Tab B**,
  and **Tab C**. **Tab A** is selected. Two toasts
  appear for the initial Tab A appearance:
  - `TabA: onWillAppear` before `TabA: onDidAppear`

---

### Tab A → Tab B transition

2. Tap **Tab B** in the tab bar.

- [ ] The content area switches to show "TabB". Four toasts appear with each tab's own events in order:
  - `TabB: onWillAppear` before `TabB: onDidAppear`
  - `TabA: onWillDisappear` before `TabA: onDidDisappear`

---

### Tab B → Tab C transition

3. Tap **Tab C** in the tab bar.

- [ ] The content area switches to show "TabC". Four toasts appear with each tab's own events in order:
  - `TabC: onWillAppear` before `TabC: onDidAppear`
  - `TabB: onWillDisappear` before `TabB: onDidDisappear`

---

### Tab C → Tab A transition

4. Tap **Tab A** in the tab bar.

- [ ] The content area switches to show "TabA". Four toasts appear with each tab's own events in order:
  - `TabA: onWillAppear` before `TabA: onDidAppear`
  - `TabC: onWillDisappear` before `TabC: onDidDisappear`

---

### Re-tapping the active tab (edge case)

5. With **Tab A** selected, tap **Tab A** again in the tab bar.

- [ ] The content area does not change. No toast notifications
  appear. No lifecycle events fire for a tap on the already-active tab.

---

### Rapid tab switching (edge case)

6. Tap **Tab B**, then immediately tap **Tab C** before the toasts from
   the previous step have finished dismissing.

- [ ] Both transitions complete. Toasts from the B→C transition
  appear after the A→B toasts. The final selected
  tab is **Tab C** and its content area shows "TabC". No events are
  missing or duplicated — all eight toasts from both transitions are
  eventually shown.

---

### Full round-trip verification

7. From **Tab C**, tap **Tab A**, then **Tab B**, then **Tab C**.

- [ ] Each tab switch produces exactly four toasts (will/did
  disappear for the leaving tab, will/did appear for the arriving tab).
  After three switches, twelve toasts in total have been fired. The final
  selected tab is **Tab C**.
