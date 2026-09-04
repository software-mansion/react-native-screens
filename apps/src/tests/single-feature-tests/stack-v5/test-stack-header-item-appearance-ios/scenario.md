# Test Scenario: Stack Header Item Appearance (iOS)

## Details

**Description:** This test focuses on the appearance of regular header items:
regular, disabled, prominent and prominent disabled (prominent variants not
implemented yet — items "3" and "4" currently render as regular / disabled).

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

- [ ] Item "3" is displayed as a regular, enabled item (prominent style not implemented yet)

- [ ] Item "4" is grayed out (disabled; prominent style not implemented yet)

2. Tap items "2" and "4"

- [ ] Disabled items do not react to touches (no highlight)
