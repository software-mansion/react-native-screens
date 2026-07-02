# Test Scenario: tabBarControllerMode

## Details

**Description:** Validates the tabBarControllerMode property across different iOS device types and window sizes. The test ensures that the navigation UI correctly toggles between a bottom tab bar, a top tab bar, and a sidebar (on iPad) based on the selected mode (automatic, tabBar, or tabSidebar) and the current display environment.

**OS test creation version:** iOS: 18.6 and 26.2

## E2E test

Incomplete: iPhone steps fully automated, iPad partially: steps 1, 2, 4, and 7.
For iPad e2e verifies: the initial `automatic` default state, `tabBar` mode keeping the floating tab bar
visible without a sidebar toggle, and `tabSidebar` mode toggling the sidebar
open/closed (via the "Toggle sidebar" button).

Not automated:

- Steps 3, 5, 8 (Split View window resizing),
- Step 6 (landscape orientation),
- Step 9 (mode-cycling crash check),
- Step 10 (tab switching),

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
