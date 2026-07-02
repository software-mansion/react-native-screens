# Test Scenario: test-stack-toolbar-menu-a11y-android

## Details

**Description:** Verifies that `accessibilityLabel` correctly sets
`contentDescription` on toolbar menu items across all display
contexts: toolbar action buttons, overflow menu items, and submenu
items. Also tests runtime updates via the
`updateToolbarMenuElements` view command, including
reset-to-default behavior.

**OS test creation version:** Android 15

## E2E test

Full

## Prerequisites

Android emulator or physical device.

## Note

To verify `contentDescription` values, use e.g.:
- **Layout Inspector** (Android Studio) — select a view and check the
  `contentDescription` property,
- **TalkBack** — enable it in the settings, use keyboard navigation with
  hardware input enabled.

The steps below say "verify contentDescription" — use whichever
tool you chose.

## Steps

### Baseline

1. Open the scenario.

- [ ] The toolbar shows an action item (search icon) in the
      toolbar.
- [ ] The overflow menu button (three dots) is visible.

### Action item accessibility

2. Verify contentDescription of the action item in the toolbar.

- [ ] The content description is "Accessibility for Alpha"
      (not the title "Alpha").

### Overflow item accessibility

3. Tap the overflow menu button (three dots).

- [ ] The overflow menu opens showing "Beta" and "Gamma".

4. Verify contentDescription of the "Beta" and "Gamma" entries.

- [ ] The content description is "Accessibility for Beta" and
      "Accessibility for Gamma" respectively.

### Submenu item accessibility

5. Tap "Gamma" (the overflow menu is still open from step 3).

- [ ] The submenu popup opens showing "Delta".

6. Verify contentDescription of the "Delta" entry.

- [ ] The content description is "Accessibility for Delta".

7. Dismiss all menus.

### View command — update action item

8. Set "target id" to "action-item", set "accessibilityLabel"
   to "Updated label", then tap "Send Command".

- [ ] The action item contentDescription is now
      "Updated label".

### View command — reset action item

9. Set "accessibilityLabel" to "undefined", then tap
   "Send Command".

- [ ] The action item falls back to using the title "Alpha"
      as content description (default behavior for icon-only
      toolbar buttons).

### View command — update overflow item

10. Set "target id" to "overflow-item", set
    "accessibilityLabel" to "Updated label", then tap
    "Send Command".

11. Tap the overflow menu button.

- [ ] Verify contentDescription of "Beta" is now
      "Updated label".

12. Dismiss the overflow menu.

### View command — reset overflow item

13. Set "accessibilityLabel" to "undefined", then tap
    "Send Command".

14. Tap the overflow menu button.

- [ ] "Beta" has no custom content description (the default
      for overflow items is no content description).
