# Test Scenario: experimental_userInterfaceStyle

## Details

**Description:** This test validates the experimental_userInterfaceStyle prop by ensuring screens correctly override the system's global appearance. It specifically monitors tab bar UI behavior during pushes, pops, and tab switches to ensure that forced styles (e.g., Dark mode on a Light system) remain stable. The goal is to eliminate visual glitches like flickering, flashing, or momentary reverts to the system theme.

**OS test creation version:** iOS 26.2

## E2E test

Not automated. Verification requires observing UI transitions (Tab Bar appearance and flicker detection) which are not reliably detectable by Detox snapshot or view-hierarchy testing.

## Prerequisites

- iOS device/simulator (use Cmd+Shift+A to toggle appearance on simulator)

## Note

Occasional flashes of the back button in the header are expected behavior and are unrelated to the experimental_userInterfaceStyle prop being tested in this scenario.

## Steps

### Baseline

1. Launch the app and set system appearance to **light**.

- [ ] Expected: App is displayed in light mode.

2. Navigate to the **Tab Bar Experimental UIStyle** screen.

- [ ] Expected: `Home` screen is shown with two buttons `Dark` and `Light`.

### Light system mode & dark screen style

3. On `Home` screen click `Dark` button.

  - [ ] Expected: Screen is shown with a black background. A single button to push the screen with dark style is visible.
 
4. Tap **"Push screen with style: dark"** and observe tab bar.

- [ ] Expected: The dark-styled tab screen is pushed, showing **Tab1** and **Tab2**. The tab bar reflects a **dark** style and appears without flash, flicker, or reversion to light style.

5. Switch between **Tab1** and **Tab2** on the pushed screen.

- [ ] Expected: Both tabs maintain the dark interface style. No flash, flicker, or reversion to light style on tab switch.

1. Pop back to previous `Dark` screen and then pop back to the `Home` screen.

- [ ] Expected: `Home` screen is shown with two buttons `Dark` and `Light`.

### Dark system mode & light screen style

7. Set system appearance to **dark**. Click `Light` button.

  - [ ] Expected: Screen is shown with a white background. A single button to push the screen with light style is visible.

8. Push **"Push screen with style: light"** and observe tab bar.

- [ ] Expected: `LightScreen` is pushed. The tab bar reflects a **light** style and appears without flash, flicker, or reversion to light style.

9. Switch between **Tab1** and **Tab2** on the pushed screen.

- [ ] Expected: Both tabs maintain the light interface style. No flash, flicker, or reversion to dark style on tab switch.
