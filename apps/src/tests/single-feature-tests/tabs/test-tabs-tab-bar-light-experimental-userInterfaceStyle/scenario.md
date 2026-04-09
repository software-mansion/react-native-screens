# Test Scenario: experimental_userInterfaceStyle: light

**E2E test:** Not autmated - can't check visual behavior in a meaningful way

## Prerequisites

- iOS device/simulator (use Cmd+Shift+A to toggle appearance on simulator)

## Steps

1. Launch the app and set system appearance to **dark**.

- [ ] Expected: App is displayed in dark mode.

2. Navigate to the **Tab Bar Experimental UIStyle: light** screen.

- [ ] Expected: First screen is shown with a white background. A single button to push the screen with light style is visible.

3. Tap **"Push screen with style: light"** and observe tab bar.

- [ ] Expected: `LightScreen` is pushed. The tab bar reflects a **light** style and appear without flash, flicker, or reversion to dark style.

1. Pop back to `Screen1`. Push **"Push screen with style: light"** again and observe navigation bar.

- [ ] Expected: The navigation bar with back button also reflects a **light** style and appear without flash, flicker, or reversion to dark style.

5. Switch between **Tab1** and **Tab2** on the pushed screen.

- [ ] Expected: Both tabs maintain the light interface style. No flash, flicker, or reversion to dark style on tab switch.