# Test Scenario: Presentation State

## Details

**Description:** Verify the presentation state machine of the `FormSheet` component with detents `[0.6, 1.0]`. When `isOpen` rapidly toggles from `true` to `false` and back to `true` (within one frame or two), the native layer must queue the transitions – finish the dismissal, then present again – and end up in sync with the JS state, without a stuck or duplicated sheet.

**OS test creation version:** iOS: 18.6 and 26.5, iPadOS: 26.5, Android: API Level 36.

## E2E test

TBD: Planned, but will be implemented separately.

## Prerequisites

- iPhone: device or simulator.
- iPad: device or simulator, app in full-screen mode (regular width and regular height size classes).
- Android: phone device or emulator.

## Note

- "Quickly dismiss & present" sets `isOpen` to `false` and back to `true` after ~32 ms, i.e. while the dismissal animation is still running.
- **iPad:** the sheet is presented as a centered floating panel with a fixed width, not as a full-width bottom sheet.

## Steps - iPhone

### Baseline

1. Launch the app and navigate to the **Presentation State** screen.

- [ ] The host screen shows the "Open FormSheet" button.

---

### Presentation

2. Tap "Open FormSheet".

- [ ] The sheet presents at the lower detent (0.6) with the "FormSheet content" title and the "Quickly dismiss & present" button.

---

### Rapid toggling (stress test)

3. Tap "Quickly dismiss & present".

- [ ] The sheet starts its dismissal animation and, as soon as it finishes, presents again automatically. The final state is a single presented sheet at 0.6; no flicker, no leftover dimming, no second sheet.

4. Tap "Quickly dismiss & present" three more times in a row, waiting for the sheet to come back each time.

- [ ] Every cycle ends with exactly one presented sheet.

---

### Final dismissal

5. Swipe the sheet down past the lower detent.

- [ ] The sheet dismisses and the host screen is undimmed.

6. Tap "Open FormSheet".

- [ ] The sheet presents again normally – the native state stayed in sync with JS.

## Steps - iPad

### Baseline

1. Launch the app and navigate to the **Presentation State** screen.

- [ ] The host screen shows the "Open FormSheet" button.

---

### Presentation

2. Tap "Open FormSheet".

- [ ] The sheet presents as a centered floating panel at the lower detent (0.6) with the "FormSheet content" title and the "Quickly dismiss & present" button.

---

### Rapid toggling (stress test)

3. Tap "Quickly dismiss & present".

- [ ] The panel starts its dismissal animation and, as soon as it finishes, presents again automatically. The final state is a single presented panel at 0.6; no flicker, no leftover dimming, no second panel.

4. Tap "Quickly dismiss & present" three more times in a row, waiting for the panel to come back each time.

- [ ] Every cycle ends with exactly one presented panel.

---

### Final dismissal

5. Swipe the panel down past the lower detent.

- [ ] The panel dismisses and the host screen is undimmed.

6. Tap "Open FormSheet".

- [ ] The panel presents again normally – the native state stayed in sync with JS.

## Steps - Android

### Baseline

1. Launch the app and navigate to the **Presentation State** screen.

- [ ] The host screen shows the "Open FormSheet" button.

---

### Presentation

2. Tap "Open FormSheet".

- [ ] The sheet presents at the lower detent (0.6) and the host screen is dimmed; the "FormSheet content" title and the "Quickly dismiss & present" button are anchored to the top of the sheet.

---

### Rapid toggling (stress test)

3. Tap "Quickly dismiss & present".

- [ ] The sheet starts its dismissal animation and, as soon as it finishes, presents again automatically. The final state is a single presented sheet at 0.6; no flicker, no leftover dimming, no second sheet.

4. Tap "Quickly dismiss & present" three more times in a row, waiting for the sheet to come back each time.

- [ ] Every cycle ends with exactly one presented sheet.

---

### Final dismissal

5. Swipe the sheet down past the lower detent (or use the system back gesture).

- [ ] The sheet dismisses and the host screen is undimmed.

6. Tap "Open FormSheet".

- [ ] The sheet presents again normally – the native state stayed in sync with JS.
