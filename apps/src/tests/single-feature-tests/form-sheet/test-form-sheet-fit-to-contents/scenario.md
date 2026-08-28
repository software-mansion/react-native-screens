# Test Scenario: Fit To Contents

## Details

**Description:** Verify `detents="fitToContents"` of the `FormSheet` component. This test ensures that the FormSheet calculates its initial height to wrap its content upon opening and follows changes of the content height while presented. On iOS the height change is animated; on Android the sheet snaps to the new height immediately (no animation yet).

**OS test creation version:** iOS: 18.6 and 26.4, iPadOS 26.4, Android: API Level 36.

## E2E test

TBD: Planned, but will be implemented separately.

## Prerequisites

- iOS device or simulator: iPhone and iPad
- On iPad: Ensure the device is in full-screen mode, regular width, regular height size class
- Android emulator

## Note

- On iPad: The FormSheet is presented as a **centered floating panel**. The `fitToContents` behavior still applies to the height of this panel seamlessly, while its width remains fixed. Therefore, explicit separate steps for iPad are omitted.
- On Android: when content is mounted/unmounted, the sheet updates its height immediately, without animation. Animating dynamic content size changes is planned separately.

## Steps

### Baseline

1. Launch the app and navigate to the **Fit To Contents** screen.

- [ ] Content with the button "Open FormSheet" is shown.

---

### Initialization & `fitToContents` Verification

2. Tap the "Open FormSheet" button.

- [ ] The FormSheet opens smoothly. Its height is matched to its internal content (on iPhone, it will have an extra empty space on the bottom which is originating from native inset application). There are no visual jumps during the initial presentation animation.

---

### Dynamic Height Adaptation

3. Tap the "Expand Content" button inside the FormSheet.

- [ ] The extra text box appears and the sheet grows in height to fully accommodate the newly added content, without visual glitches.
- [ ] iOS: the height change is animated smoothly.
- [ ] Android: the sheet snaps to the new height immediately (no animation).

---

### Dynamic Height Adaptation

4. Tap the "Collapse Content" button.

- [ ] The extra text box disappears and the sheet shrinks back to its original, smaller height.
- [ ] iOS: the height change is animated smoothly.
- [ ] Android: the sheet snaps to the smaller height immediately (no animation).

---

### Dismissal Verification

5. Tap the "Dismiss from JS" button (or swipe down completely).

- [ ] The FormSheet dismisses smoothly and returns the user to the underlying main screen.
