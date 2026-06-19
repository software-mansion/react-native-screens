# Test Scenario: tabBarControllerMode

## Details

**Description:** Validates the tabBarControllerMode property across different iOS device types and window sizes. The test ensures that the navigation UI correctly toggles between a bottom tab bar, a top tab bar, and a sidebar (on iPad) based on the selected mode (automatic, tabBar, or tabSidebar) and the current display environment.

**OS test creation version:** iOS: 18.6 and 26.2

## E2E test

Partially automated (iPad only). The suite
`test-tabs-tab-bar-controller-mode-ios.e2e.ts` verifies that `tabBar` mode keeps
the bottom `UITabBar` visible, that tab switching works in bar mode, and that
`tabSidebar` mode replaces the bottom tab bar with a sidebar (asserted as the
`UITabBar` no longer being visible while the active tab's content remains).

Because `tabSidebar` only diverges on iPad at regular width, the suite is gated
with `describeIfiPad` and self-skips on the default iPhone CI run. Run it with an
iPad target, e.g.:

```bash
RNS_APPLE_SIM_NAME="iPad Pro 13-inch (M4)" yarn test-e2e-ios
```

Not automated: the compact-width fallback steps (resizing to an iPhone-sized
window) require Split View / window resizing, which Detox cannot drive, and the
iPhone "simple check" steps (11–14).

## Prerequisites

- iOS simulator or device: iPhone and iPad (required for `tabSidebar` mode).

## Steps

### iPad

1. Launch the app and navigate to the **Tab Bar Controller Mode** screen.

- [ ] Tab bar displayed at the top with Tab1 and Tab2. Picker defaults to `automatic`

2. Ensure that tabBarControllerMode = `automatic`

- [ ] Tab bar displayed according to iPadOS default behavior for current orientation

3. Change app window size to correspond to iPhone view.

- [ ] Tab bar displayed at the **bottom**

4. Resize app to full screen.
   Set tabBarControllerMode = `tabBar`

- [ ] Tab bar displayed without sidebar option - even if iPadOS would default do it

5. Change app window size to correspond to iPhone view.

- [ ] Tab bar displayed at the **bottom**

6. Resize app to full screen.
   Set tabBarControllerMode = `tabSidebar`, test on **iPad landscape** orientation

- [ ] Navigation displayed as a **sidebar** on the leading edge

7. Keep tabBarControllerMode = `tabSidebar`, test on **iPad portrait**

- [ ] Sidebar adapts or collapses — tab items still accessible

8. Change app window size to correspond to iPhone view.

- [ ] Tab bar displayed at the **bottom** without sidebar option.

9. Resize app to full screen.
   Cycle through `automatic` → `tabBar` → `tabSidebar` → `automatic`

- [ ] UI transitions immediately with each change, no crash or layout freeze

10. Switch tabs (Tab1 ↔ Tab2) while cycling through all modes.

- [ ] Tab switching works correctly in all three modes.

---

### Simple check on iPhone

11. Launch the app and navigate to the **Tab Bar Controller Mode** screen.

- [ ] Tab bar displayed at the bottom with Tab1 and Tab2. Picker defaults to `automatic`

12.   Set tabBarControllerMode = `automatic`

- [ ] Tab bar displayed at the **bottom**

13.  Set tabBarControllerMode = `tabBar`

- [ ] Tab bar displayed at the **bottom**

14.  Set tabBarControllerMode = `tabSidebar`

- [ ] Tab bar displayed at the **bottom**
