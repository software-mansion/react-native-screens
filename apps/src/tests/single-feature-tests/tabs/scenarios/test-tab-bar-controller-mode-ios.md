## tabBarControllerMode — Manual Test Scenarios

**File:** `test-tab-bar-controller-mode-ios`
**Platform:** iOS only

### Prerequisites
- iPhone simulator or device
- iPad simulator or device (required for `tabSidebar` mode)
- iOS 18+

Assumption: default iPadOS and iPhone behavior is working correctly. Here only the `tabBarControllerMode` prop on TabsHost is tested, verified against different device types.

---

### Steps

**1. Baseline**

1. Launch the app and navigate to the scenario
   Expected: Tab bar displayed at the bottom with Tab1 and Tab2. Picker defaults to `automatic`

---

**2. TabsHost `automatic` — follows device defaults**

2. Set TabsHost tabBarControllerMode = `automatic`, test on **iPhone**
   Expected: Tab bar displayed at the **bottom**
3. Keep TabsHost tabBarControllerMode = `automatic`, test on **iPad**
   Expected: Tab bar displayed according to iPadOS default behavior for current orientation

---

**3. TabsHost `tabBar` — forces bottom bar**

4. Set TabsHost tabBarControllerMode = `tabBar`, test on **iPhone**
   Expected: Tab bar displayed at the **bottom**
5. Keep TabsHost tabBarControllerMode = `tabBar`, test on **iPad**
   Expected: Tab bar forced to display at the **bottom** — sidebar not shown even if iPadOS would default to it

---

**4. TabsHost `tabSidebar` — forces sidebar**

6. Set TabsHost tabBarControllerMode = `tabSidebar`, test on **iPhone**
   Expected: Collapses back to a **bottom tab bar** — sidebar not supported on iPhone
7. Keep TabsHost tabBarControllerMode = `tabSidebar`, test on **iPad landscape**
   Expected: Navigation displayed as a **sidebar** on the leading edge
8. Keep TabsHost tabBarControllerMode = `tabSidebar`, test on **iPad portrait**
   Expected: Sidebar adapts or collapses — tab items still accessible

---

**5. Switching between values**

9. Cycle through `automatic` → `tabBar` → `tabSidebar` → `automatic` on iPad
   Expected: UI transitions immediately with each change, no crash or layout freeze
10. Switch tabs (Tab1 ↔ Tab2) while cycling through all modes
    Expected: Tab switching works correctly in all three modes