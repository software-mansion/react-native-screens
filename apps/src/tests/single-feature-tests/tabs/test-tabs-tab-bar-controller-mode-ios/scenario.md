# Test Scenario: tabBarControllerMode

**E2E:** Not automated - test will be added at least for iPad to check sidebar visibility.

## Prerequisites

- iPhone simulator or device
- iPad simulator or device (required for `tabSidebar` mode)
- iOS 18+

## Steps

### iPad

1. Launch the app and navigate to the **Tab Bar Controller Mode** screen.

- [ ] Expected: Tab bar displayed at the top with Tab1 and Tab2. Picker defaults to `automatic`

2. Ensure that tabBarControllerMode = `automatic`

- [ ] Expected: Tab bar displayed according to iPadOS default behavior for current orientation

3. Change app window size to correspond to iPhone view.

- [ ] Expected: Tab bar displayed at the **bottom**

4. Resize app to full screen.
   Set tabBarControllerMode = `tabBar`

- [ ] Expected: Tab bar displayed without sidebar option - even if iPadOS would default do it

5. Change app window size to correspond to iPhone view.

- [ ] Expected: Tab bar displayed at the **bottom**

6. Resize app to full screen.
   Set tabBarControllerMode = `tabSidebar`, test on **iPad landscape** orientation

- [ ] Expected: Navigation displayed as a **sidebar** on the leading edge

7. Keep tabBarControllerMode = `tabSidebar`, test on **iPad portrait**

- [ ] Expected: Sidebar adapts or collapses — tab items still accessible

8. Change app window size to correspond to iPhone view.

- [ ] Expected: Tab bar displayed at the **bottom** without sidebar option.

9. Resize app to full screen.
   Cycle through `automatic` → `tabBar` → `tabSidebar` → `automatic`

- [ ] Expected: UI transitions immediately with each change, no crash or layout freeze

10. Switch tabs (Tab1 ↔ Tab2) while cycling through all modes.

- [ ] Expected: Tab switching works correctly in all three modes.

---

### Simple check on iPhone

11. Launch the app and navigate to the **Tab Bar Controller Mode** screen.

- [ ] Expected: Tab bar displayed at the bottom with Tab1 and Tab2. Picker defaults to `automatic`

12.   Set tabBarControllerMode = `automatic`

- [ ] Expected: Tab bar displayed at the **bottom**

13.  Set tabBarControllerMode = `tabBar`

- [ ] Expected: Tab bar displayed at the **bottom**

14.  Set tabBarControllerMode = `tabSidebar`

- [ ] Expected: Tab bar displayed at the **bottom**