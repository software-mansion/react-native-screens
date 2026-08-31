# Test Scenario: Largest Undimmed Detent Index (iOS)

## Details

**Description:** Verify the `largestUndimmedDetentIndex` property of the `FormSheet` component with detents `[0.5, 0.65, 0.8]`. This test ensures that the dimming view behind the sheet is applied or removed depending on the current detent, that the screen underneath stays interactive while the sheet is undimmed, and that the value can be changed while the sheet is presented.

**OS test creation version:** iOS: 18.6 and 26.5, iPadOS: 26.5.

## E2E test

TBD: Planned, but will be implemented separately.

## Prerequisites

- iPhone: device or simulator.
- iPad: device or simulator, app in full-screen mode (regular width and regular height size classes).

## Note

- iOS only - Android implementation is planned separately.
- The "Increment Background Counter" button stays at the top of the host screen so it remains reachable above the sheet at every detent; the largest detent is 0.8 on purpose.
- With the default `'none'` every detent is dimmed; a tap on the dimmed area dismisses the sheet instead of reaching the button underneath.
- **iPad:** the sheet is presented as a centered floating panel with a fixed width; the host screen stays visible around the panel.

## Steps - iPhone

### Baseline

1. Launch the app and navigate to the **Largest Undimmed Detent Index (iOS)** screen, then tap "Increment Background Counter" a few times.

- [ ] "Background clicks" increases with every tap.

---

### Default `'none'`

2. Tap "Open FormSheet".

- [ ] The sheet presents at the lowest detent (0.5) and the host screen is dimmed immediately. The title inside reads "Undimmed Index: none" and all five buttons are fully visible.

3. Tap "Increment Background Counter".

- [ ] The counter does **not** change – the tap is intercepted by the dimming view and dismisses the sheet.

---

### Index `0`

4. Tap "Open FormSheet", then "Set 0 (0.5 height)" inside the sheet.

- [ ] The host screen becomes undimmed immediately; the title reads "Undimmed Index: 0".

5. Tap "Increment Background Counter".

- [ ] The counter increments while the sheet stays open at 0.5.

6. Drag the sheet up to the middle detent (0.65).

- [ ] As the sheet settles at 0.65 the host screen is dimmed again and "Increment Background Counter" is no longer reachable.

---

### `'last'`

7. Tap "Set 'last'" inside the sheet.

- [ ] The host screen becomes undimmed at 0.65; the title reads "Undimmed Index: last".

8. Drag the sheet up to the largest detent (0.8), then tap "Increment Background Counter".

- [ ] The host screen stays undimmed at 0.8 and the counter increments.

9. Drag the sheet down to 0.5 and tap "Increment Background Counter" again.

- [ ] The counter increments – the host screen is undimmed at every detent.

---

### Back to `'none'`

10. Tap "Set 'none'" inside the sheet.

- [ ] The host screen is dimmed immediately and "Increment Background Counter" is blocked again.

---

### Dismissal

11. Tap "Dismiss from JS".

- [ ] The sheet dismisses and "Increment Background Counter" works again.

## Steps - iPad

### Baseline

1. Launch the app and navigate to the **Largest Undimmed Detent Index (iOS)** screen, then tap "Increment Background Counter" a few times.

- [ ] "Background clicks" increases with every tap.

---

### Default `'none'`

2. Tap "Open FormSheet".

- [ ] The sheet presents as a centered floating panel at the lowest detent (0.5) and the host screen around it is dimmed immediately. The title inside reads "Undimmed Index: none" and all five buttons are fully visible.

3. Tap "Increment Background Counter".

- [ ] The counter does **not** change – the tap is intercepted by the dimming view and dismisses the panel.

---

### Index `0`

4. Tap "Open FormSheet", then "Set 0 (0.5 height)" inside the panel.

- [ ] The host screen becomes undimmed immediately; the title reads "Undimmed Index: 0".

5. Tap "Increment Background Counter".

- [ ] The counter increments while the panel stays open at 0.5.

6. Drag the panel up to the middle detent (0.65).

- [ ] As the panel settles at 0.65 the host screen is dimmed again and "Increment Background Counter" is no longer reachable.

---

### `'last'`

7. Tap "Set 'last'" inside the panel.

- [ ] The host screen becomes undimmed at 0.65; the title reads "Undimmed Index: last".

8. Drag the panel up to the largest detent (0.8), then tap "Increment Background Counter".

- [ ] The host screen stays undimmed at 0.8 and the counter increments.

9. Drag the panel down to 0.5 and tap "Increment Background Counter" again.

- [ ] The counter increments – the host screen is undimmed at every detent.

---

### Back to `'none'`

10. Tap "Set 'none'" inside the panel.

- [ ] The host screen is dimmed immediately and "Increment Background Counter" is blocked again.

---

### Dismissal

11. Tap "Dismiss from JS".

- [ ] The panel dismisses and "Increment Background Counter" works again.
