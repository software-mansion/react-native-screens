# Test Scenario: Stack Header Menu Options (iOS)

## Details

**Description:** This test verifies the menu options in nested submenus.

**OS test creation version:** iOS 26.4, iPadOS 26.4

## E2E test

TBD

## Prerequisites

- iOS / iPadOS emulator

## Steps on iPhone

1. Ensure both toggles for display mode are set to off
2. Tap the ellipsis (Options) button in the header
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
