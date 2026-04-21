# Test Scenario: preventNativeSelection

## Details

**Description:** Verifies the `preventNativeSelection` prop on `TabsScreen`, which blocks the native tab selection gesture for a given tab. When enabled, tapping the tab in the tab bar — or selecting it from the "More" list on iOS — will be blocked. The `TabsHost` fires an `onTabSelectionPrevented` event with the key of the prevented screen, allowing JS to handle the attempt (e.g. show a toast or dialog). The test validates that the prop can be toggled at runtime, that the callback is called correctly, that programmatic navigation via `selectTab` is not affected, and that the "More" navigation controller on iOS is also subject to prevention.

**OS test creation version:** iOS: 18.6 and 26.2, Android: 16.0 (Baklava).

## E2E test

Other: ongoing research.

## Prerequisites

- iOS device or simulator
- Android emulator

## Note

- On iOS with 6 tabs, the tab bar shows only the first 4 tabs plus a **More** item. The **Fifth** and **Sixth** tabs are accessible via the More list.
- On Android all 6 tabs are visible in the tab bar directly.
- A toast message `onTabSelectionPrevented: <key>` appears whenever a native selection is blocked.

## Steps

### Baseline

1. Launch the app and navigate to **Prevent native selection**.

- [ ] Expected: On Android — six tabs visible in the tab bar. On iOS — four tabs and a **More** item visible. The first tab is selected. Each tab displays its name and `preventNativeSelection: false`.

---

### Enabling preventNativeSelection

2. While on the **First** tab, tap **Toggle preventNativeSelection**.

- [ ] Expected: The label updates to `preventNativeSelection: true`.

3. Tap the **Second** tab item in the tab bar.

- [ ] Expected: **Second** tab is selected normally. `preventNativeSelection` is `false` on Second.

4. Tap the **First** tab item in the tab bar.

- [ ] Expected: The tab does not change. A toast appears with `onTabSelectionPrevented: First`.

5. Tap **Select First** button (programmatic navigation).

- [ ] Expected: Navigation switches to the **First** tab normally — programmatic navigation is not blocked by `preventNativeSelection`.

---

### Disabling preventNativeSelection

6. While on the **First** tab (with `preventNativeSelection: true`), tap **Toggle preventNativeSelection**.

- [ ] Expected: The label updates back to `preventNativeSelection: false`.

7. Navigate to a different tab and then tap the **First** tab item in the tab bar.

- [ ] Expected: Tab switches normally. No toast appears.

---

### Multiple tabs

8. Navigate to the **Third** tab and tap **Toggle preventNativeSelection**.

- [ ] Expected: Third tab label shows `preventNativeSelection: true`.

9. Navigate to a different tab, then tap the **Third** tab item in the tab bar.

- [ ] Expected: Tab does not switch. Toast appears with `onTabSelectionPrevented: Third`.

10. Navigate to the **First** tab and confirm its `preventNativeSelection` is still `false`.

- [ ] Expected: First tab label shows `preventNativeSelection: false`. Tapping it from another tab works normally.

---

### iOS only — More navigation controller

11. Navigate to the **Fifth** tab via the **Select Fifth** button (programmatic).

- [ ] Expected: **Fifth** tab is displayed normally.

12. Tap **Toggle preventNativeSelection** on the **Fifth** tab.

- [ ] Expected: Label updates to `preventNativeSelection: true`.

13. Tap **Select Sixth**, then tap **Toggle preventNativeSelection**.

- [ ] Expected: Label updates to `preventNativeSelection: true`.

14. Tap **Select First**, then tap **More** in the tab bar

- [ ] Expected: Navigation to **Sixth** is blocked. Toast appears with `onTabSelectionPrevented: Sixth`. The More list is displayed.

15. Tap **Fifth** in the More list.

- [ ] Expected: Navigation to **Fifth** is blocked. Toast appears with `onTabSelectionPrevented: Fifth`. The More list remains displayed.

16. Tap **Fifth** in the More list.

- [ ] Expected: Navigation to **Fifth** is blocked. Toast appears with `onTabSelectionPrevented: Fifth`. The More list remains displayed.

17.  Tap **Fourth** tab and navigate to **Fifth** via **Select Fifth**, tap **Toggle preventNativeSelection** to disable it.

- [ ] Expected: Fifth tab label shows `preventNativeSelection: false`.

18.  Navigate away, then tap **More**.

- [ ] Expected: Navigation to **Fifth** proceeds normally. No toast appears.

19. Tap **More** again and tap **Fifth** from list.

- [ ] Expected: Navigation to **Fifth** proceeds normally. No toast appears.

### iPad only — More navigation controller
