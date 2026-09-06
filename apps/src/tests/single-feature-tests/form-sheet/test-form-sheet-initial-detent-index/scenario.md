# Test Scenario: Initial Detent Index

## Details

**Description:** Verify the `initialDetentIndex` property of the `FormSheet` component with detents `[0.3, 0.6, 1.0]`. This test ensures that the FormSheet opens at the requested detent (index `0`, `1` or `'last'`) and does not snap back to the initial detent when the component re-renders while already presented.

**OS test creation version:** iOS: 18.6 and 26.5, iPadOS: 26.5, Android: API Level 36.

## E2E test

TBD: Planned, but will be implemented separately.

## Prerequisites

- iPhone: device or simulator.
- iPad: device or simulator, app in full-screen mode (regular width and regular height size classes).
- Android: phone device or emulator.

## Note

- `initialDetentIndex` is applied only when the sheet transitions from closed to open; changing it while the sheet is presented has no effect until the next presentation.
- **Android:** the content box is laid out to the largest detent and anchored to the top, so the "Opened at Initial Index" title and the buttons stay at the top of the sheet at every detent.
- **iPad:** the sheet is presented as a centered floating panel with a fixed width, not as a full-width bottom sheet.

## Steps

### Baseline & default (index 0)

1. Launch the app and navigate to the **Initial Detent Index** screen.

- [ ] The host screen shows "Selected Initial Detent: 0", the three "Set Initial to …" buttons and the "Open FormSheet" button.

2. Tap "Open FormSheet".

- [ ] The sheet presents directly at the lowest detent (0.3). The title inside reads "Opened at Initial Index: 0"; the "Force Re-render (0)" and "Dismiss from JS" buttons are fully visible (centered on iOS, anchored to the top on Android).

---

### Re-render validation

3. Drag the sheet up to the middle detent (0.6).

- [ ] The sheet settles at 0.6.

4. Tap "Force Re-render (0)" inside the sheet.

- [ ] The button's counter increments.
- [ ] The sheet stays at 0.6 – it does not snap back to the initial detent.

5. Tap "Dismiss from JS" (or swipe the sheet down).

- [ ] The sheet dismisses.

---

### Middle detent (index 1)

6. Tap "Set Initial to 1 (0.6)", then "Open FormSheet".

- [ ] "Selected Initial Detent: 1" is shown before opening. The sheet presents directly at the middle detent (0.6) and the title reads "Opened at Initial Index: 1".

7. Dismiss the sheet.

---

### 'last' detent (index N-1)

8. Tap "Set Initial to 'last' (1.0)", then "Open FormSheet".

- [ ] "Selected Initial Detent: last" is shown before opening. The sheet presents directly at the maximum height (1.0) and the title reads "Opened at Initial Index: last".

9. Dismiss the sheet (tap "Dismiss from JS", swipe down).

- [ ] The host screen is undimmed and "Open FormSheet" is pressable again.
