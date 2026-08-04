# Test Scenario: Native container style

## Details

**Description:** Verify the `nativeContainerStyle` functionality of the `FormSheet` component. This test ensures that styling properties applied to the native container (e.g. `backgroundColor`) correctly map to the underlying `UIView`, seamlessly filling the entire modal bounds including the bottom safe area.

**OS test creation version:** iOS: 18.6 and 26.4, iPadOS 26.4, Android: API Level 36.

## E2E test

TBD: Planned, but will be implemented separately.

## Prerequisites

- iOS device or simulator: iPhone with a Home Indicator (e.g., iPhone 13/14/15) to properly verify the bottom safe area coverage.
- Android emulator

## Steps

### Baseline

1. Launch the app and navigate to the **Native container style** screen.

- [ ] Content with the button "Open FormSheet" and color selection controls is shown. The default selected color is "NAVY".

---

### Applying Default Native Background Color

2. Tap the "Open FormSheet" button.

- [ ] The FormSheet opens smoothly.
- [ ] The navy background extends completely to the bottom edge of the screen, rendering underneath the system Home Indicator without leaving any default-colored gaps in the safe area.

---

### Layout Stability

3. Tap the "Expand Content" button.

- [ ] The FormSheet animates and expands in height to accommodate the new content. The native background seamlessly covers the new bounds without any visual flashes or white gaps during the transition.

4. Tap the "Dismiss from JS" button.

- [ ] The FormSheet dismisses smoothly and returns the user to the underlying main screen.

---

### Dynamic Native Background Color

5. In the color selection controls, tap the **"PURPLE"** option.

- [ ] The PURPLE option becomes visually active.

6. Tap the "Open FormSheet" button.

- [ ] The FormSheet opens smoothly.
- [ ] The background color is now purple, extending to the bottom edge of the screen just as it did with the navy color.

7. Swipe down to dismiss the FormSheet.

- [ ] The FormSheet dismisses smoothly.
