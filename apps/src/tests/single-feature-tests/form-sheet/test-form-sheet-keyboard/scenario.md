# Test Scenario: Keyboard Integration

## Details

**Description:** Verify how a `FormSheet` reacts to the system keyboard when a TextInput inside it gets focused. Two sheets are covered: one with two detents (`[0.6, 1.0]`) and one with `detents="fitToContents"`. Each has a text input at the top and at the bottom of its content.

**OS test creation version:** iOS: 26.5, Android: API Level 36.

## E2E test

TBD: Planned, but will be implemented separately.

## Prerequisites

- iPhone: device or simulator. On the simulator make sure the software keyboard is shown.
- Android: phone device or emulator. The emulator has to use the on-screen keyboard.

## Note

- Keyboard handling differs between platforms and both behaviors are expected:
  - **iOS:** UIKit handles it. A sheet resting at a detent smaller than the largest one grows to the largest detent while the keyboard is shown. A sheet resting at its largest detent (including `fitToContents`) is pushed up so that it sits above the keyboard; its view becomes taller by the keyboard height, the extra area is hidden behind the keyboard. Content laid out at the bottom of a sheet resting at the largest detent might end up under the keyboard.
  - **Android:** the sheet reacts to the keyboard insets. At a lower detent the sheet moves up by the keyboard height, at the largest detent the content box shrinks so that it stays above the keyboard, a `fitToContents` sheet moves up as a whole. The sheet moves together with the keyboard animation.

## Steps - iPhone

### Baseline

1. Launch the app and navigate to the **Keyboard Integration** screen.

- [ ] The host screen shows the "FormSheet Test" title, the "Open FormSheet (detents)" and "Open FormSheet (fitToContents)" buttons.

---

### Detents – keyboard at the lower detent

2. Tap "Open FormSheet (detents)".

- [ ] The sheet presents at the lower detent (0.6). "Top input" is at the top of the sheet, "Bottom input" and "Dismiss from JS" at its bottom.

3. Tap "Top input".

- [ ] The keyboard slides in and the sheet grows to the largest detent (1.0) at the same time. "Top input" is focused and visible. The content is laid out for the taller sheet, "Bottom input" ends up under the keyboard.

4. Press the Return key on the keyboard.

- [ ] The keyboard hides and the sheet returns to the lower detent (0.6). The content is laid out for the smaller sheet again, nothing is clipped and no empty space is left.

---

### Detents – keyboard at the largest detent

5. Drag the sheet up to the largest detent (1.0), then tap "Bottom input".

- [ ] The keyboard slides in, the sheet stays at 1.0. "Bottom input" is focused but covered by the keyboard – this matches the native sheet behavior.

6. With the keyboard shown, swipe the sheet down past the lower detent.

- [ ] Both the keyboard and the sheet are dismissed. The host screen is undimmed and both "Open FormSheet" buttons are pressable again.

---

### fitToContents

7. Tap "Open FormSheet (fitToContents)".

- [ ] The sheet presents with a height matching its content.

8. Tap "Bottom input".

- [ ] The keyboard slides in and the sheet moves up so that its whole content sits above the keyboard. "Bottom input" is focused and visible.

9. Press the Return key on the keyboard.

- [ ] The keyboard hides and the sheet returns to its resting position at the bottom of the screen.

10. Tap "Dismiss from JS".

- [ ] The sheet dismisses and the host screen is undimmed.

## Steps - Android

### Baseline

1. Launch the app and navigate to the **Keyboard Integration** screen.

- [ ] The host screen shows the "FormSheet Test" title, the "Open FormSheet (detents)" and "Open FormSheet (fitToContents)" buttons.

---

### Detents – keyboard at the lower detent

2. Tap "Open FormSheet (detents)".

- [ ] The sheet presents at the lower detent (0.6). "Top input" is visible at the top of the sheet; "Bottom input" and "Dismiss from JS" are not visible yet (the content box is laid out to the largest detent).

3. Tap "Top input".

- [ ] The keyboard slides in and the sheet moves up by the keyboard height, following the keyboard animation – no jump before or after it. "Top input" is focused and visible.

4. Press the system back button (or use the back gesture).

- [ ] The keyboard hides and the sheet moves back down together with it, settling at the lower detent (0.6). The sheet stays presented.

---

### Detents – keyboard at the largest detent

5. Drag the sheet up to the largest detent (1.0), then tap "Bottom input".

- [ ] The keyboard slides in and the content box shrinks to the area above the keyboard. "Bottom input" is focused and visible right above the keyboard, together with "Dismiss from JS".

6. Press the system back button.

- [ ] The keyboard hides, the content box grows back to the full sheet height and "Bottom input" moves back to the bottom of the sheet. The sheet stays at 1.0.

7. Tap "Top input", then – with the keyboard shown – swipe the sheet down past the lower detent.

- [ ] Both the keyboard and the sheet are dismissed. The host screen is undimmed and both "Open FormSheet" buttons are pressable again.

---

### fitToContents

8. Tap "Open FormSheet (fitToContents)".

- [ ] The sheet presents with a height matching its content.

9. Tap "Bottom input".

- [ ] The keyboard slides in and the whole sheet moves up above the keyboard, following the keyboard animation. "Bottom input" is focused and visible.

10. Press the system back button.

- [ ] The keyboard hides and the sheet moves back down to its resting position at the bottom of the screen.

11. Tap "Dismiss from JS".

- [ ] The sheet dismisses and the host screen is undimmed.
