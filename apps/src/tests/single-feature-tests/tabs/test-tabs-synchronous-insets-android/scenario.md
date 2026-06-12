# Test Scenario: Synchronous insets application

## Details

**Description:** Verifies the `tabBarShouldApplyInsetsSynchronously` prop on the Android. When set to `true`, window insets are retrieved from the `DecorView` and applied synchronously during the `onAttachedToWindow` lifecycle phase. This prevents visible layout jumps of the bottom tab bar that occur when insets are applied asynchronously by the system during or after a screen transition.

**OS test creation version:** Android: API Level 36.

## E2E test

No. Visual layout jumps during screen transitions are difficult to capture reliably in automated UI tests like Detox without precise frame-by-frame visual regression tools. Manual visual verification is required.

## Prerequisites

- Android emulator or physical device.


## Steps

### Synchronous insets

1. Launch the app and navigate to **Synchronous insets application**.

- [ ] Expected: The **Setup** screen is visible. The `shouldApplyInsetsSynchronously` button is toggled `true`.

2. Tap the **Push Tabs Screen** button.

- [ ] Expected: A transition to the tabs screen begins. The bottom tab bar renders with the correct height and bottom padding respecting system navigation bars. There is no visible vertical layout jump or resize of the tab bar after the transition completes. 

3. Press the back button to return to the **Setup** screen.

---

### Asynchronous insets

4. On the **Setup** screen, toggle the `shouldApplyInsetsSynchronously` button to `false`.

- [ ] Expected: The switch state updates.

5. Tap the **Push Tabs Screen** button.

- [ ] Expected: A transition to the tabs screen begins. The bottom tab bar may initially render with incorrect height (lacking proper bottom padding). Shortly after or right at the end of the transition, the tab bar visibly "jumps" or resizes as the system asynchronously dispatches the insets.
