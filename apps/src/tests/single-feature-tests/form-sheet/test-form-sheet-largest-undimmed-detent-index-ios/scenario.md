# Test Scenario: Sheet largest undimmed detent index

## Details

**Description:** Verify the `largestUndimmedDetentIndex` property of the `FormSheet` component. This test ensures that the background dimming view is correctly applied or removed based on the current detent index, and that the underlying screen is interactive, when the sheet is undimmed. 

**OS test creation version:** iOS: 18.6 and 26.4

## E2E test

TBD: Planned, but will be implemented separately.

## Prerequisites

- iOS device or simulator (iPhone).

## Steps

### Baseline

1. Launch the app and navigate to the **Sheet largest undimmed detent index** screen.
2. Tap the "Increment Background Counter" button at the top of the screen a few times.

- [ ] Expected: The counter increases successfully.

---

### Initialization & Default 'none' Behavior

3. Tap the "Open FormSheet" button.

- [ ] Expected: The FormSheet opens at the first detent (0.3). The background behind the sheet immediately becomes dimmed. 
- [ ] Expected: Tapping the "Increment Background Counter" button does **not** work (the tap is intercepted by the dimming view and it dismisses the sheet).

---

### Dynamic Updates: Index 0 Validation

4. Inside the sheet, tap the "Set 0 (0.3 height)" button.

- [ ] Expected: The background is undimmed immediately.
- [ ] Expected: Tapping the "Increment Background Counter" button successfully increases the counter while the sheet remains open at 0.3.

5. Grab the top of the sheet and drag it up to the middle detent (0.6).

- [ ] Expected: As the sheet transitions to index 1 (0.6), the background is dimmed again. The background counter button is no longer pressable.

---

### Dynamic Updates: 'last' Validation

6. Inside the sheet, tap the "Set 'last'" button.

- [ ] Expected: The background is undimmed for lower detents (0.3 and 0.6).
- [ ] Expected: Dragging the sheet to its maximum height (0.8) keeps the background undimmed. 
- [ ] Expected: Tapping the background counter button at the top of the screen successfully increments the count regardless of which detent the sheet is resting at.

---

### Fallback to 'none'

7. Inside the sheet, tap the "Set 'none'" button.

- [ ] Expected: The background dims immediately. Interaction with the background counter is blocked.

---

### Dismissal Verification

8. Tap the "Dismiss from JS" button (or swipe down completely).

- [ ] Expected: The FormSheet dismisses smoothly. The background counter button becomes pressable again.
