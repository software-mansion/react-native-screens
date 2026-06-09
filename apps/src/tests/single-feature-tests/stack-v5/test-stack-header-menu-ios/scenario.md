# Test Scenario: Stack Header Menu (iOS)

## Details

**Description:** This test focuses on handling menus attached to items in the header on iOS.

**OS test creation version:** iOS 26.4, iPadOS 26.4

## E2E test

TBD

## Prerequisites

- iOS / iPadOS emulator

## Note (Optional)

- For now, menus don't appear on items with custom views

## Steps on iPhone

1. Open Dev Console
2. Reload the application (dev console causes some layout-related callbacks to trigger which may hide regressions)
3. Click on the Menu 1 item
  - [ ] The bubble morphs into a menu with two items and a submenu
4. While the menu is opened, click on the Submenu 1
  - [ ] A nested menu appears, containing two items
