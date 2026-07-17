# Test Scenario: Stack Header Menu Options (iOS)

## Details

**Description:** This test verifies the menu options in nested submenus.

**OS test creation version:** iOS 26.4, iPadOS 26.4

## E2E test

Incomplete:

## Prerequisites

- iOS / iPadOS simulator

## Steps on iPhone

### displayInline

1. Ensure both toggles are set to `false`
2. Tap the overflow menu button (three dots) in the header
  - [ ] Menu shows: Copy, Paste, Share, Sort By as a collapsed submenu, Delete
3. Tap Sort By
  - [ ] A nested submenu shows: Name, Date, Size and Rating as a collapsed submenu
4. Tap Rating
  - [ ] A nested submenu opens with: Best Reviews, Most Reviews, Highest Rated
5. Dismiss the menu
6. Toggle "displayInline (Rating)" to `true`
7. Open the menu
  - [ ] Menu shows: Copy, Paste, Share, Sort By as a collapsed submenu, Delete
8. Tap Sort By
  - [ ] Submenu opens with: Name, Date, Size, menu separator, Best Reviews, Most Reviews, Highest Rated (all inline)
9. Dismiss the menu
10. Toggle "displayInline (Rating)" back to `false` and "displayInline (Sort By): false" to `true`
11. Open the menu
  - [ ] Menu shows: Copy, Paste, Share, menu separator, Name, Date, Size, Rating as a collapsed submenu, menu separator, Delete
12. Tap Rating
  - [ ] A nested submenu opens with: Best Reviews, Most Reviews, Highest Rated
13. Dismiss the menu
14. Toggle "displayInline (Rating)" to `true` again
15. Tap the ellipsis button
  - [ ] Menu shows: Copy, Paste, Share, menu separator, Name, Date, Size, menu separator, Best Reviews, Most Reviews, Highest Rated, menu separator, Delete, all inline

### displayAsPalette

1. Ensure both toggles are set to `false`
2. Tap the Palette button in the header
  - [ ] Menu shows: Text Style as a collapsed submenu, Reset Formatting
3. Tap Text Style
  - [ ] A nested submenu opens with: Bold, Italic, Underline, Strikethrough as a (regular) vertical list
4. Dismiss the menu
5. Toggle "displayAsPalette (Text Style)" to `true`
6. Tap the Palette button
  - [ ] Menu still shows: Text Style as a collapsed submenu, Reset Formatting
7. Tap Text Style
  - [ ] Menu shows a horizontal palette row with Bold, Italic, Underline, Strikethrough icons
8. Dismiss the menu
9. Toggle "displayInline (Text Style)" to `true`
10. Tap the Palette button
  - [ ] Menu shows: Text Style as a horizontal palette row with Bold, Italic, Underline, Strikethrough icons, and Reset Formatting below
