# Test Scenario: Stack Header Menu (iOS)

## Details

**Description:** This test focuses on handling menus attached to items in the header on iOS.

**OS test creation version:** iOS 26.4, iPadOS 26.4

## E2E test

Partial: Covers all manual scenario steps except the **Menu representation** section.

## Prerequisites

- iOS / iPadOS emulator

## Note

- For now, menus don't appear on items with custom views
- Menu representation section requires iOS >= 16
- On iOS 18, items don't go into overflow by default, UIKit attempts to pack them all into header, test `menuRepresentation` on iOS 26+

## Steps on iPhone

### Menu interactions

1. Launch the app and navigate to the **Stack Header Menu (iOS)** screen.
2. Click on the Menu 1 item
  - [ ] The bubble morphs into a menu with four items and a submenu
3. Click on Action 1-1
  - [ ] A toast "Clicked Action 1-1" is displayed
4. Click on Toggle 1-1 inside Menu
  - [ ] Menu is hidden
  - [ ] A toast "Selected "toggle 1-1"" is displayed
  - [ ] When Menu 1 is reopened, a checkmark is displayed next to Toggle 1-1
5. Click on Toggle 1-3 inside Menu
  - [ ] Menu is hidden
  - [ ] A toast "Selected "toggle 1-1", "toggle 1-3"" is displayed
  - [ ] When Menu 1 is reopened, a checkmark is displayed next to Toggle 1-1 and Toggle 1-3
6. Click on Toggle 1-1 inside Menu again
  - [ ] Menu is hidden
  - [ ] A toast "Selected "toggle 1-3"" is displayed
  - [ ] When Menu 1 is reopened, a checkmark is displayed only next to Toggle 1-3
7. Click on Submenu with Radio
  - [ ] Radio 1-1 is selected by default
8. Click on Radio 1-1 again
  - [ ] No toast is displayed
9.  Click on SubSubmenu with Radio, click on Radio 1-2
  - [ ] Whole menu is hidden
  - [ ] A toast "Selected unique "radio 1-2"" is displayed
  - [ ] When Menu 1 > Submenu with Radio is reopened, Radio 1-1 is no longer checked
  - [ ] When Menu 1 > Submenu with Radio > SubSubmenu with Radio is reopened, Radio 1-2 is checked
10. Click on screen title
  - [ ] The title should transform into a menu with two actions
  - [ ] Clicking either actions should display a toast

### Menu representation (iOS 26+)

1. Relaunch the app and navigate to the **Stack Header Menu (iOS)** screen.
2. Toggle `menuRepresentation`
3. Click `Toggle trailing items count` to get 4 items present
  - [ ] Two items moved to overflow menu
4. Open the overflow menu
  - [ ] Overflowed items appear as **Repr #** submenus
  - [ ] Custom items are represented in the same way
5. Open Repr 1
  - [ ] It contains three radio items, Repr 1 Radio 1 is selected by default
6. Click Repr 1 Radio 2
  - [ ] A toast "Repr 1 selected "repr-radio-1-2"" is displayed
  - [ ] When reopened, Repr 1 Radio 2 is checked and Radio 1 is not
7. Open Repr 2
  - [ ] It contains three radio items, Repr 2 Radio 1 is selected by default

### setMenuItemOptions view command

1. Relaunch the app and navigate to the **Stack Header Menu (iOS)** screen.
2. In `setMenuItemOptions`, select `title` to be "New Title" and click `Send setMenuItemOptions`
  - [ ] When Menu 1 is opened, first item is New Title
3. Close the menu. Select `title` to be "no change", `icon` to be "star.fill" and click `Send setMenuItemOptions`
  - [ ] When Menu 1 is opened, first item is New Title and has star icon
4. Close the menu. Select `target id` to be "toggle-1-1", `toggleState` to be "true" and click `Send setMenuItemOptions`
  - [ ] When Menu 1 is opened, Toggle 1-1 is checked
  - [ ] A toast "Selected "toggle 1-1"" is displayed
5. Close the menu. Select `target id` to be "radio-1-1", `toggleState` to be "false" and click `Send setMenuItemOptions`
  - [ ] When Menu 1 > Submenu with Radio is opened, Radio 1-1 is still selected (no change)
6. Close the menu. Select `target id` to be "radio-1-2", `toggleState` to be "true" and click `Send setMenuItemOptions`
  - [ ] When Menu 1 > Submenu with Radio > SubSubMenu with Radio is opened, Radio 1-1 is deselected and Radio 1-2 is selected instead
  - [ ] A toast "Selected unique "radio 1-2"" is displayed

  ### setMenuOptions view command

1. Relaunch the app and navigate to the **Stack Header Menu (iOS)** screen.
2. In `setMenuOptions`, select `title` to be "New Title" and click `Send setMenuOptions`
  - [ ] When Menu 1 is opened, the submenu is named "New Title"
3. Close the menu. Select `title` to be "no change", `icon` to be "bell.fill" and click `Send setMenuOptions`
  - [ ] When Menu 1 is opened, the submenu is still named "New Title" and has bell icon
