# Test Scenario: Stack Header Item Identifier (iOS)

## Details

**Description:** Three screens hold the same three trailing header items. Each item
keeps a stable `identifier` across screens, but its SF Symbol and position change per
screen. With identifiers on, iOS matches items by `identifier` and animates them
between positions instead of falling back to a crossfade. Look for the item that counts
1, 2, 3 and that it moves from left to right when pushing screens, and the others
stay put, only changing their appearance.

**OS test creation version:** iOS 26 (feature requires iOS 26)

## E2E test

TBD.

## Prerequisites

- iOS simulator or device running iOS 26 or higher

## Note

- LTR layout is assumed when describing position

## Steps on iPhone

1. Inspect the trailing header items
  - [ ] Three items are visible: "1", "fish", "carrot"
2. Tap "Next"
  - [ ] The numbered item swaps position with center item and now shows "2"
  - [ ] The two food items change their symbols and don't flash
3. Tap "Next"
  - [ ] The numbered item swaps position with right item and now shows "3"
  - [ ] The two food items change their symbols and don't flash
4. Go back to screen One, toggle "Identifiers" OFF, then repeat steps 2–3
  - [ ] Without `identifier`, matching falls back to the heuristic: items crossfade /
        mis-match on transition instead of the numbered item cleanly moving

## Steps with separators

5. Go back to screen One, toggle "Identifiers" back ON and "Separators" ON
  - [ ] Each header item now sits in its own liquid-glass bubble
6. Tap "Next" through the screens (One → Two → Three)
  - [ ] On each transition, the two items that swap positions blur / crossfade
  - [ ] The item that keeps its position does not flash
