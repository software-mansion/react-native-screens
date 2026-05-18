# Test Scenario: direction

## Details

**Description:** This test scenario validates the layout directionality of
the TabBar component across iOS and Android. It specifically verifies that
the component correctly handles Right-to-Left (RTL) and Left-to-Right (LTR)
rendering by testing the precedence between system-level settings, React
Native's I18nManager, and the explicit direction prop from
react-native-screens.

The test is organized as a matrix of system direction × React Native (RN)
direction, because on iOS `direction = inherit` falls back to the **native**
app direction (i.e. the system setting), potentially ignoring React Native's
`forceRTL` override. On Android, `direction = inherit` propagates via
`style.direction` through the view hierarchy, so it follows the RN setting.
Each matrix section exercises `inherit`, `ltr`, and `rtl` prop values.

**OS test creation version:** iOS: 18.6 and 26.2, Android: API Level 36.

## E2E test

Incomplet: Covers all manual scenario steps for LTR/RTL configured:

- iOS: The system RTL direction is set by app configuration setting
  `AppleTextDirection`, `NSForceRightToLeftWritingDirection` and `I18NIsRTL`
  to `YES` during the app launch sequence.
- Android: Via React Native — RTL direction must be triggered using the
  `forceRTL` toggle located within the Layout Direction screen.

Scenarios where RTL is enabled at the device level by setting a system-wide
RTL language are NOT covered by e2e tests.

## Prerequisites

- iOS device or simulator with at least one RTL language localization
  configured in Xcode (e.g. empty `ar.lproj/InfoPlist.strings`), or system
  language set to Arabic/Hebrew.
- Android emulator with `supportRtl` enabled in app manifest.

## Note

- Assumption: System and RN settings are working correctly. Here only the
  `direction` prop on `TabsHost` is tested.
- **Tab order reference:** Tab1 is the first-defined tab, Tab2 is the
  second. In LTR order Tab1 is the leftmost item; in RTL order Tab2 is the
  leftmost item.
- For iOS below scenarios (except last one) should be executed twice: once for
System direction and once for React Native settings.
- For Android check only React Native settings as it overrides system settings.
- After toggling `forceRTL` or `allowRTL`, **restart the app** for the
  change to take effect (the screen shows a reminder).
- The `I18nManager.isRTL` readout on the config screen reflects the current
  effective RN direction after restart.
- Last scenario is egde case scenario for iOS where after changing TabHost value
and then setting it back to inherit, `direction = inherit` defers to the
**native** app layout direction (system), not to RN's `forceRTL`.

---

## Steps

### Baseline

1. Launch the app and navigate to the **Layout Direction** scenario.

- [ ] Expected: Tab1 and Tab2 are shown in LTR order. Tab1 is the leftmost
  item. Controls default to `forceRTL = false`, `allowRTL = true`, and
  `TabsHost direction = inherit`. The `I18nManager.isRTL == false` label
  is shown.

---

### System LTR / RN LTR

> Setup: iOS system: System language is LTR (e.g. English). RN: `forceRTL = false` (default).
> `I18nManager.isRTL == false`.

2. Set `TabsHost direction = inherit`.

- [ ] Expected: Tab bar is in LTR order. Tab1 is the leftmost item.

3. Set `TabsHost direction = ltr`.

- [ ] Expected: Tab bar remains in LTR order. Tab1 is the leftmost item.

4. Set `TabsHost direction = rtl`.

- [ ] Expected: Tab bar switches to RTL order. Tab2 becomes the leftmost
  item.

---

### System RTL / RN RTL

> Setup: iOS system: System language is RTL (e.g. Arabic or Hebrew). RN: Enable
> `forceRTL = true` and restart the app. `I18nManager.isRTL == true`.

5. Set `TabsHost direction = inherit`.

- [ ] Expected: Tab bar is in RTL order. Tab2 is the leftmost item.

6. Set `TabsHost direction = ltr`.

- [ ] Expected: Tab bar displays in LTR order on both platforms. Tab1 is
  the leftmost item.

7. Set `TabsHost direction = rtl`.

- [ ] Expected: Tab bar displays in RTL order on both platforms. Tab2 is
  the leftmost item.

8. Cycle `TabsHost direction` through
   `inherit` → `ltr` → `rtl` → `ltr` → `inherit` rapidly.

- [ ] Expected: Tab bar direction updates immediately with each change with
result described as expected above.

---

### iOS only: System LTR and RN RTL

> Setup: System language is LTR (e.g. English). Enable `forceRTL = true`
> and restart the app. `I18nManager.isRTL == true`.

9. Set `TabsHost direction = inherit`.

- [ ] Expected: Tab bar is in RTL order. Tab2 is the leftmost item.

10.  Set `TabsHost direction = ltr`.

- [ ] Expected: Tab bar displays in LTR order on both platforms. Tab1 is
  the leftmost item. Explicit `ltr` overrides RN's RTL setting.

11. Set `TabsHost direction = rtl`.

- [ ] Expected: Tab bar displays in RTL order on both platforms. Tab2 is
  the leftmost item.

12.  Set `TabsHost direction = inherit`.

- [ ] Expected: Tab bar is in LTR order. Tab1 is the leftmost item.
