# Test Scenario: Dynamic Tab Count

## Details

**Description:** Verify that tabs rendered conditionally can be removed from and
added back to `Tabs.Host` at runtime. Pass means the tab bar always shows exactly
the rendered tabs and the app does not crash.

**OS test creation version:** iOS: 27.2, Android: API Level 36.

## E2E test

TBD: to be automated once adding tabs at runtime is fully supported on Android.

## Prerequisites

- iOS device or simulator
- Android emulator

## Note

- **Known issue:** Android: a tab added back at runtime shows an empty content
  area when selected. Adding tabs at runtime is not fully supported yet.

## Steps

### Baseline

1. Launch the app and navigate to the **Dynamic Tab Count** screen.

   - [ ] The tab bar shows "Tab1", "Tab2", "Tab3" and "Tab4"; "Tab1" is
         selected.
   - [ ] The screen shows "Extra tabs: rendered" and "Toggles: 0".

2. Select the "Tab2" tab.

   - [ ] The screen shows the text "Tab2".

---

### Remove and add back

1. Select the "Tab1" tab, then tap "Remove extra tabs".

   - [ ] The tab bar shows only "Tab1".
   - [ ] The screen shows "Extra tabs: removed" and "Toggles: 1".

2. Tap "Add extra tabs".

   - [ ] The tab bar shows exactly "Tab1", "Tab2", "Tab3" and "Tab4"; "Tab1"
         is selected.
   - [ ] The screen shows "Extra tabs: rendered" and "Toggles: 2".

3. Tap "Remove extra tabs", then "Add extra tabs", 5 times in a row.

   - [ ] The tab bar shows exactly "Tab1", "Tab2", "Tab3" and "Tab4".
   - [ ] The screen shows "Toggles: 12".

4. Select the "Tab2" tab.

   - [ ] "Tab2" is selected in the tab bar.
   - [ ] iOS: the screen shows the text "Tab2".
   - [ ] Android: the content area is empty (see Note).

5. Select the "Tab1" tab.

   - [ ] The screen shows "Extra tabs: rendered" and "Toggles: 12".
