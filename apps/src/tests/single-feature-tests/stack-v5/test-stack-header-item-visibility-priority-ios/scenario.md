# Test Scenario: Stack Header Item Visibility Priority (iOS)

## Details

**Description:** Three trailing header items — the rightmost one is a custom
view that grows when pressed, the other two are plain SF Symbol items. The
button on screen cycles the `visibilityPriority` of the growing item through
`standard`, `high`, `low` and a raw `1000`, while the two icons keep the
default priority.

**OS test creation version:** iOS 27.0

## E2E test

TBD.

## Prerequisites

- iOS simulator

## Steps on iPhone (iOS 27)

1. Navigate to **Stack v5 → Stack Header Item Visibility Priority (iOS)**.
    - [ ] The header shows the title and, on its right, the resizing item
        (rightmost), the video icon and the search icon
    - [ ] The button reads `visibilityPriority: standard`
2. Press the resizing item
    - [ ] It disappears from the header and a "..." button takes its place — it
        grew wider than the header can fit and was moved into the overflow menu
    - [ ] The title disappears as well
3. Press the "..." button
    - [ ] Nothing happens — the item moved there is a custom view, which has
        nothing to show inside a menu
4. Press 'visibilityPriority' button to reach `high`
    - [ ] The resizing item is back in the header, at its full width, and both
        icons are in the overflow menu instead
5. Press the "..." button
    - [ ] The two icons are listed in the menu
6. Press the "search" to hide the menu
    - [ ] The resizing item is in the header, at its full width, and both
        icons are in the overflow menu
7. Press the button to reach `low`
    - [ ] The resizing item disappears, both icons stay in the header
8. Press the button to reach `1000`
    - [ ] Same as `high`
9. Press the resizing item in the header
    - [ ] Same as 1, except the button still reads `visibilityPriority: 1000`
10. Press the button to reach `standard`
    - [ ] Same as 1

## Steps on iPhone (iOS 26)

11. Repeat steps 1-8
    - [ ] The priority is ignored (the property does not exist before iOS 27)
        and the header behaves the same for every value
