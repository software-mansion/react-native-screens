# Test Scenario: Background component

## Details

**Description:** Verify the `backgroundComponent` functionality of the `FormSheet` component. This test ensures that the custom background component correctly renders beneath the content layer and fully extends to cover the entire native bounds of the sheet, including the un-collapsible bottom safe area injected by UIKit.

**OS test creation version:** iOS: 18.6 and 26.4

## E2E test

Other: Planned, but will be implemented separately.

## Prerequisites

- iOS device or simulator

## Steps

### Baseline

1. Launch the app and navigate to the **Background component** screen.

- [ ] Expected: Content with the button "Open FormSheet" and background selection controls is shown.

---

### Verification: "NONE" Background

2. Select the "NONE" background type and tap the "Open FormSheet" button.

- [ ] Expected: The FormSheet opens smoothly.
- [ ] Expected: The background is the default system color (e.g., white or dark depending on the theme).

3. Tap the "Dismiss from JS" button.

- [ ] Expected: The FormSheet dismisses smoothly.

---

### Verification: "SOLID" Background

4. Select the "SOLID" background type and tap the "Open FormSheet" button.

- [ ] Expected: The FormSheet opens smoothly.
- [ ] Expected: A solid purple background is visible behind the text content.
- [ ] Expected: The purple background extends all the way to the absolute bottom edge of the screen.

5. Tap the "Dismiss from JS" button.

- [ ] Expected: The FormSheet dismisses smoothly.

---

### Verification: "COMPOSED" Background

6. Select the "COMPOSED" background type and tap the "Open FormSheet" button.

- [ ] Expected: The FormSheet opens smoothly.
- [ ] Expected: A navy background is visible behind the text content. 
- [ ] Expected: A thin green bar is visible at the top edge.
- [ ] Expected: A red bar is visible at the very bottom edge of the screen, successfully rendering underneath the navigation bar.

7. Tap the "Dismiss from JS" button.

- [ ] Expected: The FormSheet dismisses smoothly.

---

### Verification: "IMAGE" Background

8. Select the "IMAGE" background type and tap the "Open FormSheet" button.

- [ ] Expected: The FormSheet opens smoothly.
- [ ] Expected: An image background is visible behind the text content.
- [ ] Expected: The image fully covers the native sheet bounds, extending completely under the navigation bar.

9. Tap the "Dismiss from JS" button.

- [ ] Expected: The FormSheet dismisses smoothly and returns the user to the underlying main screen.
