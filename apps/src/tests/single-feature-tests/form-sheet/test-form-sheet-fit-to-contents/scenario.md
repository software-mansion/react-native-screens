# Test Scenario: Fit To Contents

## Details

**Description:** Verify `detents="fitToContents"` of the `FormSheet` component. This test ensures that the FormSheet calculates its initial height to wrap its content upon opening and follows changes of the content height while presented. On iOS the height change is animated; on Android the sheet snaps to the new height immediately.

**OS test creation version:** iOS: 18.6 and 26.5, iPadOS: 26.5, Android: API Level 36.

## E2E test

TBD: Planned, but will be implemented separately.

## Prerequisites

- iPhone: device or simulator.
- iPad: device or simulator, app in full-screen mode (regular width and regular height size classes).
- Android: phone device or emulator.

## Note

- **iOS:** the sheet has extra empty space at the bottom – the native bottom inset (home indicator area) is added below the content.
- **Android:** when content is mounted/unmounted, the sheet updates its height immediately, without animation. Animating dynamic content size changes should be investigated separately.
- **iPad:** the sheet is presented as a centered floating panel with a fixed width; `fitToContents` applies to the panel height.

## Steps - iPhone

### Baseline

1. Launch the app and navigate to the **Fit To Contents** screen.

- [ ] The host screen shows the "Open FormSheet" button.

---

### Presentation

2. Tap "Open FormSheet".

- [ ] The sheet presents with a height matching its content ("FormSheet content" title, description text, "Expand Content" and "Dismiss from JS" buttons) plus the empty bottom inset area. No visual jumps during the presentation animation.

---

### Dynamic height

3. Tap "Expand Content" inside the sheet.

- [ ] The extra text box appears and the sheet grows to fully accommodate it, with a smooth animation and no visual glitches. The button now reads "Collapse Content".

4. Tap "Collapse Content".

- [ ] The extra text box disappears and the sheet shrinks back to its original height, with a smooth animation.

---

### Dismissal

5. Tap "Dismiss from JS" (or swipe the sheet down).

- [ ] The sheet dismisses and the host screen is undimmed; "Open FormSheet" is pressable again.

## Steps - iPad

### Baseline

1. Launch the app and navigate to the **Fit To Contents** screen.

- [ ] The host screen shows the "Open FormSheet" button.

---

### Presentation

2. Tap "Open FormSheet".

- [ ] The sheet presents as a centered floating panel with a fixed width and a height matching its content ("FormSheet content" title, description text, "Expand Content" and "Dismiss from JS" buttons).

---

### Dynamic height

3. Tap "Expand Content" inside the panel.

- [ ] The extra text box appears and the panel grows vertically to fully accommodate it, with a smooth animation and no visual glitches; the width stays fixed. The button now reads "Collapse Content".

4. Tap "Collapse Content".

- [ ] The extra text box disappears and the panel shrinks back to its original height, with a smooth animation.

---

### Dismissal

5. Tap "Dismiss from JS" (or swipe the panel down).

- [ ] The panel dismisses and the host screen is undimmed; "Open FormSheet" is pressable again.

## Steps - Android

### Baseline

1. Launch the app and navigate to the **Fit To Contents** screen.

- [ ] The host screen shows the "Open FormSheet" button.

---

### Presentation

2. Tap "Open FormSheet".

- [ ] The sheet presents with a height matching its content ("FormSheet content" title, description text, "Expand Content" and "Dismiss from JS" buttons). The sheet surface extends behind the navigation bar while the content sits above it.

---

### Dynamic height

3. Tap "Expand Content" inside the sheet.

- [ ] The extra text box appears and the sheet snaps to the new, taller height immediately (no animation). The whole extra text box is visible; the button now reads "Collapse Content".

4. Tap "Collapse Content".

- [ ] The extra text box disappears and the sheet snaps back to its original height immediately (no animation).

---

### Dismissal

5. Tap "Dismiss from JS" (or swipe the sheet down, or use the system back gesture).

- [ ] The sheet dismisses and the host screen is undimmed; "Open FormSheet" is pressable again.
