# Test Scenario: experimental_userInterfaceStyle

**E2E test:** Not autmated - can't check visual behavior in a meaningful way

## Prerequisites

- iOS device/simulator (use Cmd+Shift+A to toggle appearance on simulator)

## Steps

1. Launch the app and navigate to the **Tab Bar Experimental UIStyle: dark** screen. Ensure system appearance is set to **light**.

- [ ] Expected: First screen is shown with a black background. A single button to push the screen with dark style is visible.

2. With system appearance set to **light**, tap **"Push screen with style: dark"** and observe tab bar.

- [ ] Expected: `DarkScreen` is pushed. The tab bar appears **dark** without flash, flicker, or reversion to light style.

3. Pop back to `Screen1`. Set system appearance to **dark**. Push **"Push screen with style: dark"** again and observe back button in navigation bar.

- [ ] Expected: The navigation bar with back button also reflects a dark style and appear without flash, flicker, or reversion to light style.

4. Switch between **Tab1** and **Tab2** on the pushed screen.

- [ ] Expected: Both tabs maintain the dark interface style. No flash, flicker, or reversion to light style on tab switch.