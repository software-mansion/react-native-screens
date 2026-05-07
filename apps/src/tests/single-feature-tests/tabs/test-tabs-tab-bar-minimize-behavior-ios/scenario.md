# Test Scenario: tabBarMinimizeBehavior

## Details

**Description:** Validates the adaptive visibility of the tab bar on iOS 26+ based on the tabBarMinimizeBehavior property. This test ensures that the tab bar correctly minimizes or remains static during scroll interactions according to the selected mode (automatic, onScrollDown, onScrollUp, or never), and verifies that the UI remains stable during tab switching.

**OS test creation version:** iOS 26.2

## E2E test

Other: Pending. Standard view-hierarchy testing is insufficient because the tab bar element persists in the hierarchy after being collapsed. A potential workaround for future implementation is to verify the state via getAttributes() by comparing the element's frame/height.

## Prerequisites

- iOS 26+ device or simulator

## Note

- Behavior is only observable on iOS 26+; on older versions the tab bar should remain visible regardless of setting.
- Scrolling **down** means moving content upward (revealing items below); scrolling **up** means moving content downward (revealing items above).
- For test on iPad remember to resize app to state where down tab bar is display.
- Tab bar minimize behavior should be updated immediately after each change with no crash, layout freeze, or visual glitch.

## Steps

### Baseline

1. Launch the app and navigate to the **Tab Bar Minimize Behavior** screen.

- [ ] Expected: **Tab1** is selected. The `tabBarMinimizeBehavior` picker defaults to `automatic`.

---

### `automatic` — system-default minimize behavior

2. Ensure `tabBarMinimizeBehavior` is set to `automatic`. Switch to **Tab2** and scroll **down** through the list.

- [ ] Expected: Tab bar behave according to the system default behavior - typically remains fully visible throughout.

3. Scroll back **up** on **Tab2**.

- [ ] Expected: Tab bar behave according to the system default behavior - typically remains fully visible throughout.

---

### `onScrollDown` — minimizes when scrolling down

4. Switch to **Tab1**, set `tabBarMinimizeBehavior` = `onScrollDown`. Switch to **Tab2** and scroll **down**.

- [ ] Expected: Tab bar minimizes as the user scrolls down.

5. Scroll back **up** on **Tab2**.

- [ ] Expected: Tab bar reappears when scrolling up.

---

### `onScrollUp` — minimizes when scrolling up

6. Switch to **Tab1**, set `tabBarMinimizeBehavior` = `onScrollUp`. Switch to **Tab2** and scroll **up** (toward the top of the list).

- [ ] Expected: Tab bar minimizes/hides as the user scrolls up.

7. Scroll **down** on **Tab2**.

- [ ] Expected: Tab bar reappears when scrolling down.

---

### `never` — tab bar always visible

8. Switch to **Tab1**, set `tabBarMinimizeBehavior` = `never`. Switch to **Tab2** and scroll **down** through the entire list.

- [ ] Expected: Tab bar remains fully visible throughout — it does not minimize or hide at any point.

9. Scroll **up** through the entire list on **Tab2**.

- [ ] Expected: Tab bar remains fully visible — still no minimization.

---

### Tab switching behavior

10.  Set `tabBarMinimizeBehavior` = `onScrollDown`. Switch to **Tab2**, scroll down so the tab bar minimizes. Then tap minimized tab bar.

- [ ] Expected: Tab bar should reappeaer with two tabs.

11.  Navigate to **Tab1** and switch back to **Tab2**.

- [ ] Expected: **Tab2** scroll position is preserved — no crash or blank screen.
