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
  - [ ] Clicking on Item 1.1 triggers a Toast "Item 1.1 clicked"
  - [ ] Clicking on Item 1.2 triggers a Toast "Item 1.2 clicked"
4. While the menu is opened, click on the Submenu 1
  - [ ] A nested menu appears, containing two items
  - [ ] Clicking on Nested 1.1 triggers a Toast "Nested 1.1 clicked"
  - [ ] Clicking on Nested 1.2 triggers a Toast "Nested 1.2 clicked"
5. Click on "Toggle trailing items count" 2 times to get 4 items
3. Click on the Menu 3 item
  - [ ] The bubble morphs into a menu with two items and a submenu
  - [ ] Clicking on Item 3.1 triggers a Toast "Item 3.1 clicked"
  - [ ] Clicking on Item 3.2 triggers a Toast "Item 3.2 clicked"
4. While the menu is opened, click on the Submenu 3
  - [ ] A nested menu appears, containing two items
  - [ ] Clicking on Nested 3.1 triggers a Toast "Nested 3.1 clicked"
  - [ ] Clicking on Nested 3.2 triggers a Toast "Nested 3.2 clicked"
