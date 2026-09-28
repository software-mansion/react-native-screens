# Test Scenario: Stack SafeAreaView (iOS)

## Details

**Description:** Tests `SafeAreaView` on a Stack v5 screen with a header.
At the top of the `SafeAreaView` (top and bottom edges enabled) there is a red
rectangle with a green rectangle of the same size below it. At the bottom there
is a blue rectangle with a magenta rectangle of the same size below it.

**OS test creation version:** 27.2

## E2E test

TBD.

## Prerequisites

- iOS simulator

## Steps

1. Navigate to **Stack v5 → Stack SafeAreaView (iOS)**.

   - [ ] The header "Safe Area View" is visible.
   - [ ] At the top, the red rectangle starts right below the header and is
         not covered by it.
   - [ ] At the top, the red and green rectangles are the same size.
   - [ ] At the bottom, the magenta rectangle ends right above the home
         indicator.
   - [ ] At the bottom, the blue and magenta rectangles are the same size.
