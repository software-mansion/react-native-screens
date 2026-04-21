# Test Scenario: preventNativeSelection

## Details

**Description:** Verifies the `preventNativeSelection` prop on `TabsScreen`, which blocks the native tab selection gesture for a given tab. When enabled, tapping the tab in the tab bar should not switch to it, and the `onTabSelectionPrevented` callback should fire instead, delivering the key of the blocked tab. The test validates that the prop can be toggled at runtime, that the callback is called correctly, and that programmatic navigation via `selectTab` is not affected by the prop.

**OS test creation version:** iOS: 18.6, Android: 16.0 (Baklava).

## E2E test

No: The test requires verifying that a native tap gesture on a tab bar item is intercepted and blocked. Detox cannot reliably distinguish between a blocked tap and a successful tab switch at the native level, nor can it inspect toast messages tied to native callbacks.

## Prerequisites

- iOS device or simulator
- Android emulator

## Steps

### Baseline

1. Launch the app and navigate to **Prevent native selection**.

- [ ] Expected: Six tabs are shown. The first tab is selected. Each tab displays its name and `preventNativeSelection: false`.

---

### Enabling preventNativeSelection

2. While on the **First** tab, tap **Toggle preventNativeSelection**.

- [ ] Expected: The label updates to `preventNativeSelection: true`.

3. Tap the **First** tab item in the tab bar.

- [ ] Expected: The tab does not change. A toast appears with the message `onTabSelectionPrevented: First`.

4. Tap **Select Second** button (programmatic navigation).

- [ ] Expected: Navigation switches to the **Second** tab normally — programmatic navigation is not blocked by `preventNativeSelection`.

5. Tap the **First** tab item in the tab bar to navigate back.

- [ ] Expected: Navigation switches to the **First** tab normally — `preventNativeSelection` is only set on the current route's options, and does not block navigation to it from another tab.

---

### Disabling preventNativeSelection

6. While on the **First** tab (with `preventNativeSelection: true`), tap **Toggle preventNativeSelection**.

- [ ] Expected: The label updates back to `preventNativeSelection: false`.

7. Tap the **First** tab item in the tab bar (or navigate away and tap back).

- [ ] Expected: Tab switches normally. No toast appears.

---

### Multiple tabs

8. Navigate to the **Third** tab and tap **Toggle preventNativeSelection**.

- [ ] Expected: Third tab label shows `preventNativeSelection: true`.

9. Navigate to a different tab, then tap the **Third** tab item in the tab bar.

- [ ] Expected: Tab does not switch. Toast appears with `onTabSelectionPrevented: Third`.

10. Navigate to the **First** tab and confirm its `preventNativeSelection` is still `false`.

- [ ] Expected: First tab label shows `preventNativeSelection: false`. Tapping it from another tab works normally.
