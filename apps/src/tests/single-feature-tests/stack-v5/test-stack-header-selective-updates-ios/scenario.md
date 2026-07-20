# Test Scenario: Stack Header Selective Updates (iOS)

## Details

**Description:** This test verifies that updating a single header item does not cause other items to rebuild.

**OS test creation version:** iOS 26.4

## E2E test

Incomplete: `test-stack-header-selective-updates-ios.e2e.ts` automates the
*scoped-update* and menu-selection mechanics — Step 1 (initial titles), Step 2
(Title picker updates only Item 1, Item 2 untouched), Step 3 (Menu picker
attaches a native menu to Item 1), Step 4 (long-press opens the menu,
singleSelection semantics, checkmark persists on reopen), Step 5 (multi mode
defaults to the first option selected), Step 6 (multi-selection toast and both
checkmarks persist), the state-change halves of Step 7 (custom view replaces
the text button, Item 2 untouched) and Step 8 (custom view survives a title
change instead of reverting to text), and Step 9/10 (Add/Remove Item 3 changes
the item count).

Not automated:

- The core claim of Steps 2, 3, 7, 8, 9, 10 — that the affected item(s) do or
  do not show the native iOS 26+ rebuild flash/blur. This is a transient
  visual render effect with no observable JS-side signal, so Detox cannot
  assert it; it requires manual verification on iOS 26+.

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
  - [ ] A toast `Item 1 \[multi]: "Option-0-A", "Option-0-B"` appears
  - [ ] When opened again, both Option-0-A and Option-0-B are checked
7. Enable "Custom view" for Item 1
  - [ ] Item 1 flashes and shows a purple pressable square
  - [ ] Item 2 aligns with new width and does not flash
8. Change Title picker for Item 1 while custom view is enabled
  - [ ] Neither items flash
9. Press "Add Item 3"
  - [ ] A third item appears
  - [ ] All items flash
10. Press "Remove Item 3"
  - [ ] All items flash
  - [ ] Item 3 disappears under Item 2
