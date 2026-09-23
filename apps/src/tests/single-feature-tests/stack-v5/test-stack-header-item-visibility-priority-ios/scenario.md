# Test Scenario: Stack Header Item Visibility Priority (iOS)

## Details

**Description:** Three trailing header items — the rightmost one is a custom
view that grows when pressed, the other two are plain SF Symbol items. The
button on screen cycles the `visibilityPriority` of the growing item through
`standard`, `high` and `low`. A second button cycles the same values for the
native video icon, a third one for the search icon.

**OS test creation version:** iOS 27.0

## E2E test

TBD.

## Prerequisites

- iOS simulator

## Steps

1. Navigate to **Stack v5 → Stack Header Item Visibility Priority (iOS)**.
    - [ ] The header shows the title and, on its right, the resizing item
        (rightmost), the video icon and the search icon
    - [ ] The `square visibilityPriority` button reads `standard`
    - [ ] The `video visibilityPriority` button reads `standard`
    - [ ] The `search visibilityPriority` button reads `standard`
2. Press the resizing item
    - [ ] It disappears from the header and a "..." button takes its place — it
        grew wider than the header can fit and was moved into the overflow menu
    - [ ] The title disappears as well
3. Press the "..." button
    - [ ] Nothing happens — the item moved there is a custom view, which has
        nothing to show inside a menu
4. Press `square visibilityPriority` button to reach `high`
    - [ ] The resizing item is back in the header, at its full width, and both
        icons are in the overflow menu instead
5. Press the "..." button
    - [ ] The two icons are listed in the menu
6. Press the "search" to hide the menu
    - [ ] The resizing item is in the header, at its full width, and both
        icons are in the overflow menu
7. Press the `video visibilityPriority` button to reach `high`
    - [ ] The video icon is back in the header
    - [ ] The resizing item disappears from the header
    - [ ] The search icon is in the overflow menu
