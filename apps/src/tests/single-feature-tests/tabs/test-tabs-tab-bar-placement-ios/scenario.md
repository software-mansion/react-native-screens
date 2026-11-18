# Test Scenario: tabBarPlacement

## Details

**Description:** Validates that `tabBarPlacement` set to `bottom` keeps the tab bar at the bottom of the screen in a regular horizontal size class, where iPadOS moves it to the top by default, and that `automatic` restores the default.

**OS test creation version:** iOS: 27.2

## E2E test

None.

## Prerequisites

- iOS simulator or device: iPad.

## Steps

### iPad

1. Launch the app and navigate to the **Tab Bar Placement** screen.

    - [ ] Tab bar displayed at the top with Tab1 and Tab2. Picker defaults to `automatic`

2. Set tabBarPlacement = `bottom`

    - [ ] Tab bar displayed at the bottom of the screen

3. Rotate the device to landscape.

    - [ ] Tab bar stays at the bottom

4. Change app window size to correspond to iPhone view and back to full screen.

    - [ ] Tab bar stays at the bottom in both sizes

5. Switch to Tab2 and scroll to the end of the list.

    - [ ] The last row is visible above the tab bar

6. Go back to Tab1 and set tabBarPlacement = `automatic`

    - [ ] Tab bar moves back to the top

### iPhone

1. Launch the app and navigate to the **Tab Bar Placement** screen.

2. Switch tabBarPlacement between `automatic` and `bottom`

    - [ ] Tab bar stays at the bottom with both values
