# Test Scenario: Stack Header Subview onPress (iOS)

## Details

**Description:** This test focuses on the onPress callback on header items, its interaction with menus, and overflow behavior.

**OS test creation version:** iOS 26.4

## E2E test

TBD

## Prerequisites

- iOS simulator

## Steps on iPhone (iOS 18 + 26)

1. Tap on Item 0
  - [ ] A toast "onPress Item 0" is displayed
2. Tap on Menu 1
  - [ ] A menu with two items (Action 1-1, Action 1-2) is displayed
3. Long-press on Item 0
  - [ ] A menu with two items (Action 0-1, Action 0-2) is displayed
4. Dismiss the menu

## Steps on iPhone (iOS 26)

5. Click "Toggle items count (2/5)" three times to reach 5 items
  - [ ] Item 0 and Menu 1 are no longer visible in the header — they have been moved to the overflow menu
6. Tap the overflow menu button (three dots)
  - [ ] Item 0 and Item 1 appear as entries in the overflow menu
7. Tap on Item 0 in the overflow menu
  - [ ] A submenu with three items (Item 0, Action 0-1, Action 0-2) is displayed
  - [ ] Tapping on Item 0 displays "onPress Item 0" toast
8. Tap on Menu 1 in the overflow menu
  - [ ] A submenu with two items (Action 0-1, Action 0-2) is displayed
