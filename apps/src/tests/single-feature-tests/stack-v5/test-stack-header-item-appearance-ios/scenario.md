# Test Scenario: Stack Header Item Appearance (iOS)

## Details

**Description:** This test focuses on the appearance of regular header items:
regular, disabled, prominent and prominent disabled.

**OS test creation version:** iOS 26.4, iPadOS 26.4

## E2E test

TBD

## Prerequisites

- iOS / iPadOS simulator

## Steps on iPhone

1. Inspect the header trailing items

- [ ] Four items with "1", "2", "3", "4" circled sfSymbols are visible

- [ ] Item "1" is displayed as a regular, enabled item

- [ ] Item "2" is grayed out (disabled)

- [ ] Item "3" is displayed as a prominent item (tinted background; bold on iOS < 26)

- [ ] Item "4" is displayed as a prominent item and grayed out (disabled)

2. Tap items "1" and "3"

- [ ] A toast appears for each tap

3. Tap items "2" and "4"

- [ ] Disabled items do not react to touches (no highlight, no toast)

4. Tap "Push to overflow", then open the overflow menu

- [ ] Items "1"-"4" are moved to the overflow menu
