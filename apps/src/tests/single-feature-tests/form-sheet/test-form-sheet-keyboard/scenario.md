# Test Scenario: Keyboard Integration

## Details

**Description:** Verify how a `FormSheet` reacts to the system keyboard when a TextInput inside it gets focused. Four sheets are covered: a single detent (`[0.4]`), two detents (`[0.6, 1.0]`), three detents (`[0.3, 0.6, 1.0]`), and `detents="fitToContents"`. Each has a text input at the top and at the bottom of its content.

**OS test creation version:** iOS: 26.5, Android: API Level 36.

## E2E test

TBD: Planned, but will be implemented separately.

## Prerequisites

- iPhone: device or simulator. On the simulator make sure the software keyboard is shown.
- Android: phone device or emulator. The emulator has to use the on-screen keyboard.

## Note

- Keyboard handling differs between platforms and both behaviors are expected:
  - **iOS:** UIKit handles it. A sheet resting at a detent smaller than the largest one grows to the largest detent while the keyboard is shown. A sheet resting at its largest detent (including `fitToContents`) is pushed up so that it sits above the keyboard; its view becomes taller by the keyboard height, the extra area is hidden behind the keyboard. Content laid out at the bottom of a sheet resting at the largest detent might end up under the keyboard.
  - **Android:** the sheet reacts to the keyboard insets. Whichever detent it rests at, the sheet is pushed up by the keyboard height as far as the screen allows, so its detent-sized part stays above the keyboard (the extra area is hidden behind the keyboard, like on iOS). Only the part that can't be pushed above the keyboard shrinks the content box - a sheet resting at the full-height detent stays in place and its content box shrinks by the keyboard height. A `fitToContents` sheet moves up as a whole. The sheet moves together with the keyboard animation.

## Steps - iPhone

### Baseline

1. Launch the app and navigate to the **Keyboard Integration** screen.

- [ ] The host screen shows the "FormSheet Test" title and the four "Open FormSheet" buttons: single detent, two detents, three detents, fitToContents.

---

### Two detents – keyboard at the lower detent

2. Tap "Open FormSheet (two detents)".

- [ ] The sheet presents at the lower detent (0.6). "Top input" is at the top of the sheet, "Bottom input" and "Dismiss from JS" at its bottom.

3. Tap "Top input".

- [ ] The keyboard slides in and the sheet grows to the largest detent (1.0) at the same time. "Top input" is focused and visible. The content is laid out for the taller sheet, "Bottom input" ends up under the keyboard.

4. Press the Return key on the keyboard.

- [ ] The keyboard hides and the sheet returns to the lower detent (0.6). The content is laid out for the smaller sheet again, nothing is clipped and no empty space is left.

---

### Two detents – keyboard at the largest detent

5. Drag the sheet up to the largest detent (1.0), then tap "Bottom input".

- [ ] The keyboard slides in, the sheet stays at 1.0. "Bottom input" is focused but covered by the keyboard – this matches the native sheet behavior.

6. With the keyboard shown, swipe the sheet down past the lower detent.

- [ ] Both the keyboard and the sheet are dismissed. The host screen is undimmed and all "Open FormSheet" buttons are pressable again.

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

---

### Three detents – keyboard at the middle detent

11. Tap "Open FormSheet (three detents)", drag the sheet up to the middle detent (0.6), then tap "Top input".

- [ ] The keyboard slides in and the sheet grows to the largest detent (1.0). "Top input" is focused and visible.

12. Press the Return key on the keyboard.

- [ ] The keyboard hides and the sheet returns to the middle detent (0.6).

13. Tap "Dismiss from JS".

- [ ] The sheet dismisses and the host screen is undimmed.

---

### Single detent

14. Tap "Open FormSheet (single detent)", then tap "Top input".

- [ ] The keyboard slides in and the sheet is pushed up so that it sits above the keyboard; its content keeps its height. "Top input" is focused and visible.

15. Press the Return key on the keyboard.

- [ ] The keyboard hides and the sheet returns to its resting position at the bottom of the screen.

16. Tap "Dismiss from JS".

- [ ] The sheet dismisses and the host screen is undimmed.

## Steps - Android

### Baseline

1. Launch the app and navigate to the **Keyboard Integration** screen.

- [ ] The host screen shows the "FormSheet Test" title and the four "Open FormSheet" buttons: single detent, two detents, three detents, fitToContents.

---

### Two detents – keyboard at the lower detent

2. Tap "Open FormSheet (two detents)".

- [ ] The sheet presents at the lower detent (0.6). "Top input" is visible at the top of the sheet; "Bottom input" and "Dismiss from JS" are not visible yet (the content box is laid out to the largest detent).

3. Tap "Top input".

- [ ] The keyboard slides in and the sheet moves up by the keyboard height, following the keyboard animation – no jump before or after it. "Top input" is focused and visible. On Android, the "Bottom input" and "Dismiss from JS" are moved to the visible area.

4. Press the system back button (or use the back gesture).

- [ ] The keyboard hides and the sheet moves back down together with it, settling at the lower detent (0.6). The sheet stays presented. On Android, the "Bottom input" and "Dismiss from JS" are moved outside the visible area.

---

### Two detents – keyboard at the largest detent

5. Drag the sheet up to the largest detent (1.0), then tap "Bottom input".

- [ ] The keyboard slides in and the content box shrinks to the area above the keyboard. "Bottom input" is focused and visible right above the keyboard, together with "Dismiss from JS".

6. Press the system back button.

- [ ] The keyboard hides, the content box grows back to the full sheet height and "Bottom input" moves back to the bottom of the sheet. The sheet stays at 1.0.

7. Tap "Top input", then – with the keyboard shown – swipe the sheet down past the lower detent.

- [ ] Both the keyboard and the sheet are dismissed. The host screen is undimmed and all "Open FormSheet" buttons are pressable again.

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

---

### Three detents – keyboard at the middle detent

12. Tap "Open FormSheet (three detents)", drag the sheet up to the middle detent (0.6), then tap "Top input".

- [ ] The keyboard slides in and the sheet moves up by the keyboard height, following the keyboard animation. "Top input" is focused and visible.

13. Press the system back button.

- [ ] The keyboard hides and the sheet moves back down together with it, settling at the middle detent (0.6).

14. Drag the sheet up to the largest detent (1.0), then tap "Dismiss from JS".

- [ ] The sheet dismisses and the host screen is undimmed.

---

### Single detent

15. Tap "Open FormSheet (single detent)", then tap "Top input".

- [ ] The keyboard slides in and the sheet moves up by the keyboard height, following the keyboard animation. The content box keeps its height, "Top input" is focused and visible.

16. Press the system back button.

- [ ] The keyboard hides and the sheet moves back down together with it, settling at 0.4.

17. Tap "Dismiss from JS".

- [ ] The sheet dismisses and the host screen is undimmed.
