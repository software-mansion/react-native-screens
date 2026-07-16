# Test Scenario: Stack Header Icons (iOS)

## Details

**Description:** This test focuses on handling icons and images in header with runtime updates.

**OS test creation version:** iOS 26.4, iPadOS 26.4

## E2E test

Incomplete: scenario is partially covered. Only the `sfSymbol` variant can be verified, via its native label
(`favorite`); `xcasset`, `imageSource` and `templateSource` render as plain
images with no id/label/text, so their appearance can't be asserted. Icon
cycling is therefore checked indirectly — `favorite` must be absent while a
non-`sfSymbol` variant is selected, and the on-screen "current" text / menu
action title changing confirms the cycle advanced. Opening the menu on long
press and its items becoming visible is also covered. Not covered: the actual
rendered image of non-SF-Symbol icons, crossfade, per-item icon positioning,
nested submenu icons, and menu layout shifts.

## Prerequisites

- iOS / iPadOS simulator

## Note

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
