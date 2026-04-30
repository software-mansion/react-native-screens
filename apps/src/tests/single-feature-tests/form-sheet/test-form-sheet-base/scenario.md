# Test Scenario: Basic functionality

## Details

**Description:** Verify the core functionality and layout stability of the `FormSheet` component. This test ensures that the FormSheet opens correctly, that its internal content is properly centered, and that the content dynamically maintains its centered alignment when the user manually adjusts the sheet's height between different detents.

**OS test creation version:** iOS: 18.6 and 26.4

## E2E test

Other: Planned, but will be implemented separately.

## Prerequisites

- iOS device/simulator

## Steps

### Baseline

1. Launch the app and navigate to the **Basic functionality** screen.

- [ ] Expected: Content with the button "Open FormSheet" is shown

---

### Initialization & Layout Verification

2. Tap the "Open FormSheet" button.

- [ ] Expected: The FormSheet opens at the initial lower detent (0.6). The "FormSheet content" text and the "Dismiss from JS" button are visible and perfectly centered both vertically and horizontally within the sheet.

---

### Detent Adaptation

3. Grab the top edge of the FormSheet and swipe up to expand it to the maximum detent (1.0).

- [ ] Expected: The FormSheet expands to take up the maximum available height. The internal layout adapts dynamically, and the "FormSheet content" text along with the "Dismiss from JS" button remain perfectly centered within the newly expanded view area.

---

### Dismissal Verification

4. Tap the "Dismiss from JS" button (or swipe down completely).

- [ ] Expected: The FormSheet dismisses smoothly and returns the user to the underlying main screen. Pressables on the main screen are working.
