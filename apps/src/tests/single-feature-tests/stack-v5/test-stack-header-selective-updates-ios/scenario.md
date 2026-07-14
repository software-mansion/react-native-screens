# Test Scenario: Stack Header Selective Updates (iOS)

## Details

**Description:** This test verifies that updating a single header item does not cause other items to rebuild.

**OS test creation version:** iOS 26.4

## E2E test

TBD

## Prerequisites

- iOS emulator running iOS 26

## Steps on iPhone with iOS 26

1. Observe two items in the trailing area: "Foo 1" and "Foo 2"
2. Change Title picker for Item 1 from "foo" to "bar"
  - [ ] Item 1 flashes and changes to "Bar 1"
  - [ ] Item 2 does NOT flash
3. Change Menu picker for Item 1 to "single"
  - [ ] Neither items flash
4. Open Item 1 menu by long press and select Option-0-B
  - [ ] A toast `Item 1 [single]: "Option-0-B"` selected appears
  - [ ] When opened again, only Option-0-B is checked
5. Change Menu picker for Item 1 to "multi"
  - [ ] Menu can be opened and the default first option is selected
6. Select Option-0-B in Item 1 menu
  - [ ] A toast `Item 1 \[multi]: "Option-0-A", "Option-0-B"` selected appears
  - [ ] When opened again, both Option-0-A and Option-0-B are checked
7. Enable "Custom view" for Item 1
  - [ ] Item 1 flashes and shows a purple pressable square
  - [ ] Item 2 aligns with new width and does not flash
8. Change Title picker for Item 1 while custom view is enabled
  - [ ] Neither items flash
9. Press "Add Item 3"
  - [ ] A third item appears
  - [ ] Items 2 and 3 flash
10. Press "Remove Item 3"
  - [ ] Items 2 and 3 flash
  - [ ] Item 3 disappears under Item 2
