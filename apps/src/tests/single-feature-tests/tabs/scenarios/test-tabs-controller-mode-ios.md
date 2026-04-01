## tabBarControllerMode — Manual Test Scenarios

**File:** `test-tabs-controller-mode-ios`
**Platform:** iOS only

### Prerequisites
- iPhone simulator or device
- iPad simulator or device (required for `tabSidebar` mode)
- iOS 18+

Assumption: default iPadOS and iPhone behavior is working correctly. Here only the `tabBarControllerMode` prop on TabsHost is tested, verified against different device types.

---

### Steps

**Baseline**

1. 

**iPad**

1. Launch the app and navigate to the scenario
   Expected: Tab bar displayed at the bottom with Tab1 and Tab2. Picker defaults to `automatic`
2. Set tabBarControllerMode = `automatic`
   
   Expected: Tab bar displayed according to iPadOS default behavior for current orientation
3. Change app window size to correspond to iPhone view. 
   
   Expected: Tab bar displayed at the **bottom**
4. Resize app to full screen.
   Set tabBarControllerMode = `tabBar`

   Expected: Tab bar displayed without sidebar option - even if iPadOS would default do it

5. Change app window size to correspond to iPhone view.
   
   Expected: Tab bar displayed at the **bottom**
6. Resize app to full screen.
   Set TabsHost tabBarControllerMode = `tabSidebar`,test on **iPad landscape** orientation
   
   Expected: Navigation displayed as a **sidebar** on the leading edge
7. Keep TabsHost tabBarControllerMode = `tabSidebar`, test on **iPad portrait**
   
   Expected: Sidebar adapts or collapses — tab items still accessible
8. Change app window size to correspond to iPhone view.

   Expected: Tab bar displayed without sidebar option.

9. Resize app to full screen.
   Cycle through `automatic` → `tabBar` → `tabSidebar` → `automatic` on iPad
   
   Expected: UI transitions immediately with each change, no crash or layout freeze

10.  Switch tabs (Tab1 ↔ Tab2) while cycling through all modes
    
    Expected: Tab switching works correctly in all three modes

**Smoke on iPhone**
1.  Set TabsHost tabBarControllerMode = `automatic`
   
   Expected: Tab bar displayed at the **bottom**
   
2.  Set TabsHost tabBarControllerMode = `tabBar`
   
   Expected: Tab bar displayed at the **bottom**
3.  Set TabsHost tabBarControllerMode = `tabSidebar`
   
   Expected: Tab bar displayed at the **bottom**
