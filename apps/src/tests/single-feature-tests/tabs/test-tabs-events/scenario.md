# Test Scenario: Tabs lifecycle events

## Details

**Description:** Verifies that `onWillAppear`, `onDidAppear`,
`onWillDisappear`, and `onDidDisappear` fire in the correct order on tab
switches, covering happy-path transitions, re-tapping the active tab, and
rapid switching.

**OS test creation version:** iOS: 18.6 and 26.2, Android: 18.6.

## E2E test

Other: On going research

## Prerequisites

- iOS simulator or device (iPhone)
- Android emulator or device

## Note

- All four events should fire on every tab switch. The expected order for
  a switch between TabX and TabY depends on platform
  For iOS:
  1. `TabY: onWillAppear`
  2. `TabX: onWillDisappear`
  3. `TabY: onDidAppear`
  4. `TabX: onDidDisappear`
  For Android:
  1. `TabX: onWillDisappear`
  2. `TabX: onDidDisappear`
  3. `TabY: onWillAppear`
  4. `TabY: onDidAppear`
- Toasts stack and dismiss automatically; observe each toast color and
  label as it appears. To dismiss a toast manually, tap it.
- Re-tapping the currently active tab must not fire any lifecycle events.

## Steps

### Baseline

1. Launch the app and navigate to **Tabs lifecycle events**.

- [ ] Expected: Three tabs are visible in the tab bar: **Tab A**, **Tab B**,
  and **Tab C**. **Tab A** is selected. Two toasts
  appear for the initial Tab A appearance:
  - `TabA: onWillAppear`
  - `TabA: onDidAppear`

---

### Tab A → Tab B transition

2. Tap **Tab B** in the tab bar.

- [ ] Expected: The content area switches to show "TabB". Four toast
  notifications appear in order specific platform:
  - `TabB: onWillAppear` (green background)
  - `TabA: onWillDisappear` (light navy background)
  - `TabB: onDidAppear` (light blue background)
  - `TabA: onDidDisappear` (dark navy background)

---

### Tab B → Tab C transition

3. Tap **Tab C** in the tab bar.

- [ ] Expected: The content area switches to show "TabC". Four toast
  notifications appear in order specific platform:
  - `TabC: onWillAppear` (green background)
  - `TabB: onWillDisappear` (light navy background)
  - `TabC: onDidAppear` (light blue background)  
  - `TabB: onDidDisappear` (dark navy background)

---

### Tab C → Tab A transition

4. Tap **Tab A** in the tab bar.

- [ ] Expected: The content area switches to show "TabA". Four toast
  notifications appear in order specific platform:
  - `TabA: onWillAppear` (green background)  
  - `TabC: onWillDisappear` (light navy background)
  - `TabA: onDidAppear` (light blue background)
  - `TabC: onDidDisappear` (dark navy background)

---

### Re-tapping the active tab (edge case)

5. With **Tab A** selected, tap **Tab A** again in the tab bar.

- [ ] Expected: The content area does not change. No toast notifications
  appear. No lifecycle events fire for a tap on the already-active tab.

---

### Rapid tab switching (edge case)

6. Tap **Tab B**, then immediately tap **Tab C** before the toasts from
   the previous step have finished dismissing.

- [ ] Expected: Both transitions complete. Toasts from the B→C transition
  appear after the A→B toasts. The final selected
  tab is **Tab C** and its content area shows "TabC". No events are
  missing or duplicated — all eight toasts from both transitions are
  eventually shown.

---

### Full round-trip verification

7. From **Tab C**, tap **Tab A**, then **Tab B**, then **Tab C**.

- [ ] Expected: Each tab switch produces exactly four toasts (will/did
  disappear for the leaving tab, will/did appear for the arriving tab).
  After three switches, twelve toasts in total have been fired. The final
  selected tab is **Tab C**.
