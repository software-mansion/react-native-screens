
# direction — Manual Test Scenarios

**File:** `test-tabs-layout-direction`  
**Platform:** iOS + Android

## Prerequisites

- iOS 18+ device or simulator
with at least one RTL language localization configured in Xcode (e.g. empty ar.lproj/InfoPlist.strings), or system language set to Arabic/Hebrew
- Android emulator
Android emulator with supportRtl enabled in app manifest

Note:

- App restart is required after changing forceRTL / allowRTL
- Assumption: system and RN settings are working correctly. Here only react-native-screens prop is tested.

---

## Steps

### Baseline
1. Launch the app and navigate to the scenario
    Expected: Config and Tab2 are shown in LTR order (Config on left, Tab2 to its right). All controls default to forceRTL=false, allowRTL=true, TabsHost direction = inherit


### TabsHost inherit — follows RN/system

2. Ensure system/RN is LTR (I18nManager.isRTL == false), set TabsHost direction = inherit
    Expected: Tab bar displays in LTR order (Config on left, Tab2 to its right)
3. Set system/RN to RTL (I18nManager.isRTL == true), keep TabsHost direction = inherit
    Expected: Tab bar displays in RTL order — (Config on right, Tab2 to its left)

### TabsHost ltr

4. Set system/RN to RTL, set TabsHost direction = ltr
    Expected: Tab bar displays in LTR order — TabsHost overrides RTL from RN/system
5. Set system/RN to LTR, keep TabsHost direction = ltr
    Expected: Tab bar stays LTR
6. Cycle through inherit → rtl → ltr → rtl → inherit
    Expected: Tab bar direction updates immediately with each change, no crash or layout freeze

### TabsHost rtl

7. Set system/RN to LTR, set TabsHost direction = rtl
    Expected: Tab bar displays in RTL order — TabsHost overrides LTR from RN/system
8. Set system/RN to RTL, keep TabsHost direction = rtl
    Expected: Tab bar stays RTL
9. Cycle through inherit → ltr → rtl → ltr → inherit
    Expected: Tab bar direction updates immediately with each change, no crash or layout freeze

### Precedence chain verification

15. System = RTL, forceRTL=false, allowRTL=false, TabsHost = inherit
    Expected: Tab bar is LTR (allowRTL=false blocks system RTL)
16. System = LTR, forceRTL=true (restart), TabsHost = inherit
    Expected: Tab bar is RTL (forceRTL overrides system)
17. System = LTR, forceRTL=true (restart), TabsHost = ltr
    Expected: Tab bar is LTR (TabsHost wins over forceRTL)
