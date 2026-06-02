# Test Scenario: Sheet corner radius

## Details

**Description:** Verify the `preferredCornerRadius` property of the `FormSheet` component. This test ensures that negative values successfully map to the system's automatic dimension, specific positive values correctly alter the corner rounding, and the sheet dynamically updates its radius when the prop changes while presented.

**OS test creation version:** iOS: 18.6 and 26.4, iPadOS 26.4

## E2E test

TBD: Planned, but will be implemented separately.

## Prerequisites

- iOS device or simulator: iPhone and iPad
- On iPad: Ensure the device is in full-screen mode, regular width, regular height size class

## Note

- On iOS 18, the corner radius primarily affects the **top** corners of the bottom sheet.
- On iOS 26, the corner radius primarily affects **all** corners of the bottom sheet.
- On iPad, because the FormSheet is presented as a floating panel, the corner radius will affect **all four** corners.

## Steps - iPhone

### Baseline

1. Launch the app and navigate to the **Sheet preferred corner radius** screen.

- [ ] Expected: Content with the button "Open FormSheet" and current radius text ("systemDefault") is shown.

---

### Initialization & Default Value Verification

2. Tap the "Open FormSheet" button.

- [ ] Expected: The FormSheet opens. The top corners (iOS 18) or all corners (iOS 26) of the sheet display the standard, system-default rounded appearance.

---

### Dynamic Updates Validation

3. Tap the "Sharp (0)" button.

- [ ] Expected: The top corners (iOS 18) or all corners (iOS 26) of the sheet update dynamically, becoming sharp.

4. Tap the "Small (10)" button.

- [ ] Expected: The top corners (iOS 18) or all corners (iOS 26) update to a slightly rounded curve.

5. Tap the "Large (50)" button.

- [ ] Expected: The top corners (iOS 18) or all corners (iOS 26) of the sheet update dynamically, displaying deeply rounded curve.

---

### Dismissal Verification

6. Tap the "Dismiss from JS" button (or swipe down completely).

- [ ] Expected: The FormSheet dismisses smoothly. Pressables on the main screen remain active.

## Steps - iPad

### Baseline

1. Launch the app and navigate to the **Sheet preferred corner radius** screen.

- [ ] Expected: Content with the button "Open FormSheet" and current radius text ("systemDefault") is shown.

---

### Initialization & Default Value Verification

2. Tap the "Open FormSheet" button.

- [ ] Expected: The FormSheet opens as a centered floating panel. All four corners of the panel display the standard, system-default rounded appearance.

---

### Dynamic Updates Validation

3. Tap the "Sharp (0)" button.

- [ ] Expected: All four corners of the sheet update dynamically, becoming sharp.

4. Tap the "Small (10)" button.

- [ ] Expected: All four corners update to a slightly rounded curve.

5. Tap the "Large (50)" button.

- [ ] Expected: All four corners of the sheet update dynamically, displaying deeply rounded curve.

---

### Dismissal Verification

6. Tap the "Dismiss from JS" button (or swipe down completely).

- [ ] Expected: The FormSheet dismisses smoothly. Pressables on the main screen remain active.
