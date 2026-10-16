# Test Scenario: swap tabs

## Details

**Description:** `Tabs.Host` renders `Home` and one more tab, which is swapped between `TabA` and `TabB` at runtime (the old `TabsScreen` is removed and a new one is added). The swap also requests `Home` to be selected. Validates that a tab added after the first selection shows its content, and that removing the selected tab doesn't crash.

**OS test creation version:** Android: API Level 33.

## E2E test

TBD.

## Prerequisites

- iOS device or simulator
- Android device or emulator

## Steps

1. Launch the app and navigate to the screen Swap Tabs.

- [ ] Tab bar with Home and TabA should be displayed.

2. On Home, press `Swap TabA / TabB`, then select TabB in the tab bar.

- [ ] TabB's content (the `TabB` label and the button) should be displayed.

3. On TabB, press `Swap TabA / TabB`.

- [ ] The app should not crash. Home should be selected and the tab bar should show Home and TabA.

4. Select TabA.

- [ ] TabA's content should be displayed.

5. Repeat steps 3-4 a few times.

- [ ] The tab bar should always show exactly two tabs, and the selected tab's content should always be displayed.
