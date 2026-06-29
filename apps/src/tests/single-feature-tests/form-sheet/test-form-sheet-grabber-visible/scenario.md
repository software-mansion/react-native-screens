# Test Scenario: Sheet Grabber Visibility

## Details

**Description:** Verify that the `prefersGrabberVisible` prop of the `FormSheet` component correctly controls the visibility of the grabber indicator at the top of the sheet. This test covers toggling the prop both before the sheet is presented (from the underlying screen) and while the sheet is already presented (from inside the sheet).

**OS test creation version:** iOS: 18.6 and 26.4, Android: API Level 36.

## E2E test

TBD: Planned, but will be implemented separately.

## Prerequisites

- iOS device or simulator: iPhone
- Android emulator

## Steps

### Baseline

1. Launch the app and navigate to the **Grabber visibility** screen.

- [ ] Content with the "prefersGrabberVisible" toggle (switched off by default) and the "Open FormSheet" button is shown.

---

### Initial state - grabber hidden

2. Without flipping the toggle, tap the "Open FormSheet" button.

- [ ] The FormSheet opens at the initial lower detent (0.6). No grabber indicator is shown at the top of the sheet.

3. Dismiss the FormSheet by swiping it down.

- [ ] The FormSheet dismisses smoothly and returns the user to the underlying main screen.

---

### Toggling visibility from outside the FormSheet

4. Flip the "prefersGrabberVisible" toggle on the main screen to **on**.

5. Tap the "Open FormSheet" button.

- [ ] The FormSheet opens at the initial lower detent (0.6). A grabber indicator is visible at the top of the sheet.

6. Dismiss the FormSheet by swiping it down.

7. Flip the "prefersGrabberVisible" toggle on the main screen back to **off**.

8. Tap the "Open FormSheet" button.

- [ ] The FormSheet opens with no grabber indicator visible at the top of the sheet.

9. Dismiss the FormSheet by swiping it down.

---

### Toggling visibility from inside the FormSheet

10. Tap the "Open FormSheet" button.

- [ ] The FormSheet opens with no grabber indicator visible at the top of the sheet. The "prefersGrabberVisible" toggle inside the sheet is switched off and reflects the same state as the toggle on the main screen.

11. Flip the "prefersGrabberVisible" toggle inside the FormSheet to **on**.

- [ ] The grabber indicator appears at the top of the sheet without dismissing or re-presenting the sheet.

12. Flip the "prefersGrabberVisible" toggle inside the FormSheet back to **off**.

- [ ] The grabber indicator disappears from the top of the sheet without dismissing or re-presenting the sheet.

13. Tap the "Dismiss from JS" button.

- [ ] The FormSheet dismisses smoothly and returns the user to the underlying main screen. The "prefersGrabberVisible" toggle on the main screen reflects the last value set inside the sheet (off).
