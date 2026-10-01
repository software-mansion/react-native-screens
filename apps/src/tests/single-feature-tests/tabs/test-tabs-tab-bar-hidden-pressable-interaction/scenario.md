# Test Scenario: tabBarHidden Pressable interaction

## Details

**Description:** On Android, the tab bar is hidden by setting its visibility to `GONE`,
which leaves the bounds it was last laid out with in place. React Native hit-tests the
native view tree without looking at visibility, so those retained bounds used to swallow
every touch aimed at the strip the tab bar had occupied (see #4132). This scenario ensures
that a hidden tab bar does not interfere with React Native's Pressables laid out underneath it.

**OS test creation version:** Android: API Level 36.

## E2E test

Full: All manual steps are covered by an E2E test.

## Prerequisites

- Android emulator

## Note

- The tab bar has to be visible first and hidden at runtime. A tab bar that starts hidden
  is never laid out, so it keeps no bounds and does not reproduce the issue.

## Steps

1. Launch the app and navigate to the screen Tab Bar Hidden Pressable Interaction.

- [ ] Screen with one Tab in tab bar should be displayed.
- [ ] A green "Bottom Pressable" should be anchored to the bottom of the screen, behind the tab bar.
- [ ] `Bottom presses: 0` should be displayed.

2. Toggle `tabBarHidden` to `true`.

- [ ] Tab bar should disappear immediately.

3. Tap the green "Bottom Pressable" in the strip the tab bar occupied, just above the system navigation bar.

- [ ] `Bottom presses` should increment. Hidden tab bar should not block Pressable interaction.
