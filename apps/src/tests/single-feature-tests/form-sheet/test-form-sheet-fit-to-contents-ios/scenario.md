# Test Scenario: Fit to contents

## Details

**Description:** Verify the `fitToContents` for the `FormSheet` component. This test ensures that the FormSheet calculates its initial height to wrap its content upon opening, and dynamically animates to a new height when the internal content size changes.

**OS test creation version:** iOS: 18.6 and 26.4, iPadOS 26.4

## E2E test

TBD: Planned, but will be implemented separately.

## Prerequisites

- iOS device or simulator: iPhone and iPad
- On iPad: Ensure the device is in full-screen mode, regular width, regular height size class

## Note

- On iPad: The FormSheet is presented as a **centered floating panel**. The `fitToContents` behavior still applies to the height of this panel seamlessly, while its width remains fixed. Therefore, explicit separate steps for iPad are omitted.

## Steps

### Baseline

1. Launch the app and navigate to the **Fit to contents** screen.

- [ ] Content with the button "Open FormSheet" is shown.

---

### Initialization & `fitToContents` Verification

2. Tap the "Open FormSheet" button.

- [ ] The FormSheet opens smoothly. Its height is matched to its internal content (on iPhone, it will have an extra empty space on the bottom which is originating from native inset application). There are no visual jumps during the initial presentation animation.

---

### Dynamic Height Adaptation

3. Tap the "Expand Content" button inside the FormSheet.

- [ ] The extra text box appears. The native FormSheet smoothly animates and grows in height to fully accommodate the newly added content without any visual glitches.

---

### Dynamic Height Adaptation

4. Tap the "Collapse Content" button.

- [ ] The extra text box disappears. The native FormSheet smoothly animates and shrinks back to its original, smaller height.

---

### Dismissal Verification

5. Tap the "Dismiss from JS" button (or swipe down completely).

- [ ] The FormSheet dismisses smoothly and returns the user to the underlying main screen.
