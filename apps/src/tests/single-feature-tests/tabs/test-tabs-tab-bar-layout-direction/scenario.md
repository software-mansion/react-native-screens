# Test Scenario: direction

## Details

**Description:** This test scenario validates the layout directionality of
the TabBar component across iOS and Android. It specifically verifies that
the component correctly handles Right-to-Left (RTL) and Left-to-Right (LTR)
rendering by testing the precedence between system-level settings, React
Native's I18nManager, and the explicit direction prop from
react-native-screens.

**OS test creation version:** iOS: 18.6 and 26.2, Android: 16.0 (Baklava)

## E2E test

Yes: Covers all manual scenario steps for LTR/RTL configured via React Native.

Implementation Details:

- iOS: The system RTL direction is set by configuring I18NIsRTL to YES
  during the app launch sequence.
- Android: RTL direction must be triggered using the forceRTL toggle located
  within the Layout Direction screen.

Scenarios where RTL is enabled at the device level by setting a system-wide
RTL language are NOT covered by e2e tests.

## Prerequisites

- iOS device or simulato with at least one RTL language localization
  configured in Xcode (e.g. empty ar.lproj/InfoPlist.strings), or system
  language set to Arabic/Hebrew,
- Android emulator with supportRtl enabled in app manifest.

## Note

- Assumption: System and RN settings are working correctly. Here only
  react-native-screens prop is tested.
- Each of the below steps must be executed twice:once with a system-wide RTL
  language enabled at the device level and once with the RTL direction set
  via React Native. The device-level test is particularly critical, as the
  React Native configuration is already covered by E2E tests.

## Steps

### Baseline

1. Launch the app and navigate to the scenario.

- [ ] Expected: Tab1 and Tab2 are shown in LTR order. Tab1 displayed as the
  leftmost item and Tab2 as second. All controls default to
  forceRTL=false, allowRTL=true, TabsHost direction = inherit.

---

### TabsHost inherit — follows RN/system

2. Ensure system/RN is LTR (I18nManager.isRTL == false), set TabsHost
   direction = inherit.

- [ ] Expected: Tab bar displays in LTR order. Tab1 is displayed as the the
  leftmost item and Tab2 as second.

3. Set system/RN to RTL (I18nManager.isRTL == true), keep TabsHost
   direction = inherit.

- [ ] Expected: Tab bar displays in RTL order. Tab2 displayed as the
  leftmost item and Tab1 as second.

---

### TabsHost ltr

4. Set system/RN to RTL, set TabsHost direction = ltr.

- [ ] Expected: Tab bar displays in LTR order — TabsHost overrides RTL from
  RN/system. Tab1 is displayed as the the leftmost item.

5. Set system/RN to LTR, keep TabsHost direction = ltr.

- [ ] Expected: Tab bar remains in LTR order. Tab1 is displayed as the the
  leftmost item.

6. Cycle through inherit → rtl → ltr → rtl → inherit.

- [ ] Expected: Tab bar direction updates immediately with each change; no
  crashes or layout freezes occur.

---

### TabsHost rtl

7. Set system/RN to LTR, set TabsHost direction = rtl.

- [ ] Expected: Tab bar displays in RTL order — TabsHost overrides LTR from
  RN/system. Tab2 displayed as the leftmost item.

8. Set system/RN to RTL, keep TabsHost direction = rtl.

- [ ] Expected: Tab bar remains RTL. Tab2 displayed as the leftmost item.

9. Cycle through inherit → ltr → rtl → ltr → inherit.

- [ ] Expected: Tab bar direction updates immediately with each change, no
  crashes or layout freezes occur.
