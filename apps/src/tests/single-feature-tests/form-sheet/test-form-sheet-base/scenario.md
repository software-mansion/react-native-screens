# Test Scenario: Basic Functionality

## Details

**Description:** Verify the core present / resize / dismiss flow of `FormSheet` with two detents (`[0.6, 1.0]`) and how its React content is laid out on each platform. The sheet content is a box that fills the sheet; on iOS its children are vertically centered (the box follows the current detent), on Android they are anchored to the top (the box is laid out to the largest detent).

**OS test creation version:** iOS: 18.6 and 26.5, iPadOS: 26.5, Android: API Level 36.

## E2E test

TBD: Planned, but will be implemented separately.

## Prerequisites

- iPhone: device or simulator.
- iPad: device or simulator, app in full-screen mode (regular width and regular height size classes).
- Android: phone device or emulator.

## Note

- Content sizing differs between platforms and both behaviors are expected:
  - **iOS:** the content box is laid out to the _current_ detent, so the centered content re-centers every time the sheet settles at a different detent.
  - **Android:** the content box is laid out once to the _largest_ detent (minus system bars). At lower detents the sheet reveals only the top part of that box, which is why the content is anchored to the top – it stays visible at every detent and moves together with the sheet.
- **iPad:** the sheet is presented as a centered floating panel with a fixed width, not as a full-width bottom sheet.

## Steps - iPhone

### Baseline

1. Launch the app and navigate to the **Basic Functionality** screen.

- [ ] The host screen shows the "FormSheet Test" title and the "Open FormSheet" button.

---

### Presentation & layout

2. Tap "Open FormSheet".

- [ ] The sheet presents at the lower detent (0.6) and the host screen is dimmed.
- [ ] "FormSheet content" and "Dismiss from JS" are centered both vertically and horizontally within the sheet.

---

### Detent adaptation

3. Drag the sheet up to the largest detent (1.0).

- [ ] The sheet expands to the maximum available height (respecting the top inset). The content re-centers within the taller sheet.

4. Drag the sheet back down to the lower detent (0.6).

- [ ] The sheet settles at 0.6 and the content re-centers again. Nothing is clipped.

---

### Dismissal

5. Tap "Dismiss from JS".

- [ ] The sheet dismisses with an animation. The host screen is undimmed and "Open FormSheet" is pressable again.

6. Tap "Open FormSheet", then swipe the sheet down past the lower detent.

- [ ] The sheet dismisses natively. "Open FormSheet" is pressable again and opens the sheet at 0.6 (the JS state was synced by `onNativeDismiss`).

## Steps - iPad

### Baseline

1. Launch the app and navigate to the **Basic Functionality** screen.

- [ ] The host screen shows the "FormSheet Test" title and the "Open FormSheet" button.

---

### Presentation & layout

2. Tap "Open FormSheet".

- [ ] The sheet presents as a centered floating panel at the lower detent (0.6) and the host screen is dimmed. The panel has a fixed width and is horizontally centered.
- [ ] "FormSheet content" and "Dismiss from JS" are centered both vertically and horizontally within the panel.

---

### Detent adaptation

3. Drag the panel up to the largest detent (1.0).

- [ ] The panel grows vertically to the maximum available height (respecting the top inset) while its width stays fixed. The content re-centers within the taller panel.

4. Drag the panel back down to the lower detent (0.6).

- [ ] The panel settles at 0.6 and the content re-centers again. Nothing is clipped.

---

### Dismissal

5. Tap "Dismiss from JS".

- [ ] The panel dismisses with an animation. The host screen is undimmed and "Open FormSheet" is pressable again.

6. Tap "Open FormSheet", then swipe the panel down past the lower detent.

- [ ] The panel dismisses natively. "Open FormSheet" is pressable again and opens the panel at 0.6.

## Steps - Android

### Baseline

1. Launch the app and navigate to the **Basic Functionality** screen.

- [ ] The host screen shows the "FormSheet Test" title and the "Open FormSheet" button.

---

### Presentation & layout

2. Tap "Open FormSheet".

- [ ] The sheet presents at the lower detent (0.6) and the host screen is dimmed.
- [ ] "FormSheet content" and "Dismiss from JS" are horizontally centered and anchored to the top of the sheet.

---

### Detent adaptation

3. Drag the sheet up to the largest detent (1.0).

- [ ] The sheet expands to the maximum available height (below the status bar). The content stays anchored to the top of the sheet and moves together with it – no re-layout, flicker or jumps during the drag.

4. Drag the sheet back down to the lower detent (0.6).

- [ ] The sheet settles at 0.6 and the content moves down with it, still anchored to the top of the sheet.

---

### Dismissal

5. Tap "Dismiss from JS".

- [ ] The sheet dismisses with an animation. The host screen is undimmed and "Open FormSheet" is pressable again.

6. Tap "Open FormSheet", then swipe the sheet down past the lower detent.

- [ ] The sheet dismisses natively. "Open FormSheet" is pressable again and opens the sheet at 0.6.

7. Tap "Open FormSheet", then use the system back gesture (or the back button).

- [ ] The sheet dismisses natively, exactly like after the swipe.
