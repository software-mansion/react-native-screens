# Test Scenario: Layout Direction

## Details

**Description:** This test scenario validates the layout directionality of
the TabBar component across iOS and Android. It specifically verifies that
the component correctly handles Right-to-Left (RTL) and Left-to-Right (LTR)
rendering by testing the precedence between system-level settings, React
Native's I18nManager, and the explicit direction prop from
react-native-screens.

On iOS, all scenarios follow a system direction × RN direction matrix,
because `direction = inherit` falls back to the **native** app direction
(i.e. the system setting), potentially overriding React Native's `forceRTL`.
On Android, scenarios only set the RN direction, because `direction =
inherit` propagates via `style.direction` through the view hierarchy and
therefore follows the RN setting - no system-direction dimension is needed.
Each section exercises `inherit`, `ltr`, and `rtl` prop values.

**OS test creation version:** iOS: 18.6 and 26.5, Android: API Level 36.

## E2E test

Other: Covers first two manual scenarios for LTR/RTL configurations:

- iOS: The system RTL direction is set by app configuration setting
  `AppleTextDirection`, `NSForceRightToLeftWritingDirection` and `I18NIsRTL`
  to `YES` during the app launch sequence.
- Android: Via React Native - RTL direction must be triggered using the
  `forceRTL` toggle located within the Layout Direction screen.

E2E tests for iOS specific scenarios have to be implemented.

Scenarios where RTL is enabled at the device level by setting a system-wide
RTL language are NOT covered by E2E tests.

## Prerequisites

- iOS device or simulator with at least one RTL language localization
  configured in Xcode (e.g., an empty `ar.lproj/InfoPlist.strings`) and system
  language set to Arabic/Hebrew.
- Android emulator with `supportsRtl` enabled in app manifest.

## Note

- Assumption: System and RN settings are working correctly. Here only the
  `direction` prop on `TabsHost` is tested.
- **Tab order reference:** Tab1 is the first-defined tab, Tab2 is the
  second. In LTR order Tab1 is the leftmost item; in RTL order Tab2 is the
  leftmost item.
- For iOS, scenarios labeled e.g. `System LTR / RN LTR` require configuring
  **both** the system direction and the RN direction to match the label
  before running the steps.
- For Android, only the RN direction needs to be set - the system direction
  is ignored because RN's setting overrides it.
- After toggling `forceRTL` or `allowRTL`, **restart the app** for the
  change to take effect (the screen shows a reminder).
- The `I18nManager.isRTL` readout on the config screen reflects the current
  effective RN direction after restart.
- The last two iOS scenarios are a consequence of the behavior described
  above: when `direction` is switched to `inherit` after being set to
  another value, the tab bar follows the native (system) layout direction
  rather than RN's `forceRTL`. The initial value of `TabsHost direction`
  is not fixed - it reflects whatever direction is actually displayed on
  mount, which depends on the system and RN settings. When the two
  disagree, the displayed direction at startup is the resolved one (e.g.
  RN RTL with LTR system can display as RTL initially).

---

## Steps

### Baseline

1. Launch the app and navigate to the **Layout Direction** scenario.

- [ ] Expected: Tab1 and Tab2 are shown in LTR order. Tab1 is the leftmost
  item. Controls default to `forceRTL = false`, `allowRTL = true`, and
  `TabsHost direction = ltr`. The `I18nManager.isRTL == false` label
  is shown.

---

### System LTR / RN LTR

> Setup: System language is LTR (e.g. English). RN: `forceRTL = false` (default).
> `I18nManager.isRTL == false`.

2. Set `TabsHost direction = inherit`.

- [ ] Expected: Tab bar is in LTR order. Tab1 is the leftmost item.

3. Set `TabsHost direction = ltr`.

- [ ] Expected: Tab bar remains in LTR order. Tab1 is the leftmost item.

4. Set `TabsHost direction = rtl`.

- [ ] Expected: Tab bar switches to RTL order. Tab2 becomes the leftmost
  item.

5. Cycle `TabsHost direction` through
   `inherit` → `rtl` → `ltr` → `rtl` → `inherit` rapidly.

- [ ] Expected: Tab bar direction updates immediately with each change with
result described as expected above.

---

### System RTL / RN RTL

> Setup: System language is RTL (e.g. Arabic or Hebrew). RN: Enable
> `forceRTL = true` and restart the app. `I18nManager.isRTL == true` and `TabsHost direction = rtl`.

6. Set `TabsHost direction = inherit`.

- [ ] Expected: Tab bar is in RTL order. Tab2 is the leftmost item.

7. Set `TabsHost direction = ltr`.

- [ ] Expected: Tab bar displays in LTR order on both platforms. Tab1 is
  the leftmost item.

8. Set `TabsHost direction = rtl`.

- [ ] Expected: Tab bar displays in RTL order on both platforms. Tab2 is
  the leftmost item.

9. Cycle `TabsHost direction` through
   `inherit` → `ltr` → `rtl` → `ltr` → `inherit` rapidly.

- [ ] Expected: Tab bar direction updates immediately with each change with
result described as expected above.

---

### iOS only: System RTL / RN LTR

> Setup: iOS system: System language is RTL (e.g. Arabic or Hebrew). Disable RN RTL `forceRTL = false`, 
> `allowRTL = false` and restart the app. `I18nManager.isRTL == false` and `TabsHost direction = ltr`.

10. Set `TabsHost direction = inherit`.

- [ ] Expected: Tab bar is in RTL order. Tab2 is the leftmost item.

11. Set `TabsHost direction = ltr`.

- [ ] Expected: Tab bar displays in LTR order. Tab1 is
  the leftmost item.

12. Set `TabsHost direction = rtl`.

- [ ] Expected: Tab bar displays in RTL order. Tab2 is
  the leftmost item.

13. Cycle `TabsHost direction` through
   `inherit` → `ltr` → `rtl` → `ltr` → `inherit` rapidly.

- [ ] Expected: Tab bar direction updates immediately with each change with
result described as expected above.

---

### iOS only: System LTR / RN RTL

> Setup: System language is LTR (e.g. English). Enable `forceRTL = true`
> and restart the app. `I18nManager.isRTL == true` and `TabsHost direction = rtl`

14. Set `TabsHost direction = inherit`.

- [ ] Expected: Tab bar is in LTR order. Tab1 is the leftmost item.

15. Set `TabsHost direction = ltr`.

- [ ] Expected: Tab bar displays in LTR order. Tab1 is
  the leftmost item.

16. Set `TabsHost direction = rtl`.

- [ ] Expected: Tab bar displays in RTL order. Tab2 is
  the leftmost item.

17. Cycle `TabsHost direction` through
`inherit` → `rtl` → `ltr` → `rtl` → `inherit` rapidly.

- [ ] Expected: Tab bar direction updates immediately with each change with
result described as expected above.
