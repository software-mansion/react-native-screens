# Test Scenario: Stack Header Icons (iOS)

## Details

**Description:** This test focuses on handling icons and images in header with runtime updates.

**OS test creation version:** iOS 26.4, iPadOS 26.4

## E2E test

TBD

## Prerequisites

- iOS / iPadOS emulator

## Note (Optional)

- Crossfade doesn't work when changing between async images.
- Changing items in menu while it is presented (default for this test) results in visible layout shifts.
This is native behavior, we can't do much here

## Steps on iPhone

1. Inspect the header right item
  - [ ] A "star" sfSymbol is visible
2. Repeatedly click on "Cycle item icon"
  - [ ] First, "star" changes to filled "3"
  - [ ] Second, filled "3" changes to search icon
  - [ ] Third, search icon changes to "3"
  - [ ] Lastly, "3" changes again to "star"
3. Inspect the menu
  - [ ] Long press on the header item shows the menu
  - [ ] both menu items and submenu items have "star" visible on the left side
4. Repeatedly click on "Cycle icons" action inside the menu
  - [ ] First, "star" changes to filled "3"
  - [ ] Second, filled "3" changes to search icon
  - [ ] Third, search icon changes to "3"
  - [ ] Lastly, "3" changes again to "star"
