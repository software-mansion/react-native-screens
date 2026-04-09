# Test Scenario: experimental_userInterfaceStyle: dark

**E2E test:** Not autmated - can't check visual behavior in a meaningful way

## Prerequisites

- iOS device/simulator (use Cmd+Shift+A to toggle appearance on simulator)

## Steps

1. Launch the app and set system appearance to **light**.

- [ ] Expected: App is displayed in light mode.

2. Navigate to the **Tab Bar Experimental UIStyle: dark** screen.

- [ ] Expected: First screen is shown with a black background. A single button to push the screen with dark style is visible.

3. Tap **"Push screen with style: dark"** and observe tab bar.

- [ ] Expected: `DarkScreen` is pushed. The tab bar reflects a **dark** style and appear without flash, flicker, or reversion to light style.

4. Pop back to `Screen1`. Push **"Push screen with style: dark"** again and observe navigation bar.

- [ ] Expected: The navigation bar with back button also reflects a **dark** style and appear without flash, flicker, or reversion to light style.

5. Switch between **Tab1** and **Tab2** on the pushed screen.

- [ ] Expected: Both tabs maintain the dark interface style. No flash, flicker, or reversion to light style on tab switch.