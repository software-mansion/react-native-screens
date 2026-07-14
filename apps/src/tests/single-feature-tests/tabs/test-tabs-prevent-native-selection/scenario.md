# Test Scenario: preventNativeSelection

## Details

**Description:** Verifies the `preventNativeSelection` prop on `TabsScreen`, which
blocks the native tab selection gesture for a given tab. When enabled, tapping
the tab in the tab bar — or selecting it from the "More" list on iOS — will be
blocked. The `TabsHost` fires an `onTabSelectionPrevented` event with the key
of the prevented screen, allowing JS to handle the attempt (e.g. show a toast
or dialog). The test validates that the prop can be toggled at runtime, that
the callback is called correctly, that programmatic navigation via `selectTab`
is not affected, and that the "More" navigation controller on iOS is also
subject to prevention.

**OS test creation version:** iOS: 18.6 and 26.2, Android: API Level 36.

## E2E test

Incomplete: The E2E test covers most steps for iPhone and Android phone.
The iPad E2E test covers steps 1-11 and additionally verifies that all six tabs exist in the sidebar.

Not covered:

- iPad specific steps are not automated, as the resize interactions required to
trigger the More tab (Split View / window resizing between compact and regular
size classes) are not feasible with Detox. Also selecting tab from sidebar is not possible
with Detox.
- Testing repeated selection of an already active
More tab is not currently automated (Step 19 from the scenario). When the More tab content is already active
and displayed, Detox is unable to re-select the "More" tab bar item because it
becomes invisible for Detox.

## Prerequisites

- iOS device or simulator: iPhone and iPad
- Android emulator

## Note

- For iOS each of the below steps (except iPad only) must be executed twice:
once on iPhone and once on iPad.
- On iOS with 6 tabs, the tab bar shows only the first 4 tabs plus a
  **More** item. The **Fifth** and **Sixth** tabs are accessible via the More
  list.
- On Android all 6 tabs are visible in the tab bar directly.
- On iPad: The More tab only appears when the window is resized to a compact width
size class. For iOS 18 and older, a Split View must be triggered to achieve this.
- A toast message `onTabSelectionPrevented: <key>` appears whenever a native selection
is blocked.

## Steps

### Baseline

1. Launch the app and navigate to **Prevent native selection**.

- [ ] On Android — six tabs visible in the tab bar. On iOS — four tabs
and a **More** item visible.The **First** tab is selected
and displays `preventNativeSelection: false` under its name on the screen.

---

### Enabling preventNativeSelection

2. While on the **First** tab, tap **Toggle preventNativeSelection**.

- [ ] The label updates to `preventNativeSelection: true`.

3. Tap the **Second** tab item in the tab bar.

- [ ] **Second** tab is selected normally. `preventNativeSelection` is
`false` on Second.

4. Tap the **First** tab item in the tab bar.

- [ ] The tab does not change. A toast appears with
`onTabSelectionPrevented: First`.

5. Tap **Select First** button (programmatic navigation).

- [ ] Navigation switches to the **First** tab normally — programmatic
navigation is not blocked by `preventNativeSelection`.

---

### Disabling preventNativeSelection

6. While on the **First** tab (with `preventNativeSelection: true`), tap
**Toggle preventNativeSelection**.

- [ ] The label updates back to `preventNativeSelection: false`.

7. Navigate to a different tab and then tap the **First** tab item in the tab bar.

- [ ] Tab switches normally. No toast appears.

---

### Multiple tabs

8. Navigate to the **Third** tab and tap **Toggle preventNativeSelection**.

- [ ] Third tab label shows `preventNativeSelection: true`.

9. Navigate to  the **Fourth** tab and tap **Toggle preventNativeSelection**.

- [ ] Fourth tab label shows `preventNativeSelection: true`.

10. Tap the **Third** tab item in the tab bar.

- [ ] Tab does not switch. Toast appears with
`onTabSelectionPrevented: Third`.

11. Navigate to the **First** tab and confirm its `preventNativeSelection` is
still `false`.

- [ ] First tab label shows `preventNativeSelection: false`. Tapping it
from another tab works normally.

---

### iOS only — More navigation controller (for iPad resize app)

12. Navigate to the **Fifth** tab via the **Select Fifth** button (programmatic).

- [ ] **Fifth** tab is displayed normally.

13. Tap **Toggle preventNativeSelection** on the **Fifth** tab.

- [ ] Label updates to `preventNativeSelection: true`.

14. Tap **Select Sixth**, then tap **Toggle preventNativeSelection**.

- [ ] Label updates to `preventNativeSelection: true`.

15. Tap **Select First**, then tap **More** in the tab bar.

- [ ] Navigation to **Sixth** is blocked. Toast appears with
`onTabSelectionPrevented: Sixth`. The More list is displayed.

16. Tap **Fifth** in the More list.

- [ ] Navigation to **Fifth** is blocked. Toast appears with `onTabSelectionPrevented: Fifth`. The More list remains displayed.

17. Tap **Fourth** tab and navigate to **Fifth** via **Select Fifth**, tap
**Toggle preventNativeSelection** to disable it.

- [ ] Fifth tab label shows `preventNativeSelection: false`.

18. Navigate away, then tap **More**.

- [ ] Navigation to **Fifth** proceeds normally. No toast appears.

19. Tap **More** again and tap **Fifth** from list.

- [ ] Navigation to **Fifth** proceeds normally. No toast appears.

### iPad only - Sidebar behavior

20. Resize app to full screen width.

- [ ] More tab disappear. **Fifth** tab is selected.

21. Open Sidebar and select **Sixth** from the list.

- [ ] Navigation to **Sixth** is blocked. Toast appears with
`onTabSelectionPrevented: Sixth`.
The **Fifth** tab is selected and its content remains displayed.

22. Open Sidebar.

- [ ] **Fifth** tab is selected.

23. Tap **Second** from Sidebar list and tap **Toggle preventNativeSelection**.

- [ ] Label updates to `preventNativeSelection: true`.

24. Tap **Select Sixth** and tap **Toggle preventNativeSelection**.

- [ ] Label updates to `preventNativeSelection: false`.

25. Tap **Fourth** and then from the Sidebar tap **Sixth**.

- [ ] Tab switches normally. No toast appears.

26. Tap **Second** from tab bar.

- [ ] Navigation to **Second** is blocked. Toast appears with
`onTabSelectionPrevented: Second`.
The **Sixth** tab is selected and its content remains displayed.
