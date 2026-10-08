# Test Scenario: SafeAreaView below stack header (iOS)

## Details

**Description:** Tests `SafeAreaView` on a Stack v5 screen with a header.
The `SafeAreaView` (top and bottom edges enabled) has a red border around
its whole area.

**OS test creation version:** 27.2

## E2E test

TBD.

## Prerequisites

- iOS simulator

## Steps

1. Navigate to **CIT → SAV → SafeAreaView below stack header (iOS)**.

   - [ ] The header "Safe Area View" is visible.
   - [ ] The top edge of the red border starts right below the header and is
         not covered by it.
   - [ ] The bottom edge of the border ends right above the home indicator.
   - [ ] The left and right edges of the border touch the screen edges.
   - [ ] The bottom corners of the border may be clipped by the rounded
         display corners. This is expected.
