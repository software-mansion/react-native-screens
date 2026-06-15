# Test Scenario: Stacking FormSheets

## Details

**Description:** Verify the present/dismiss flow for stacked `FormSheet` components. The screen presents up to three sheets stacked on top of each other. Every sheet exposes buttons that dismiss any sheet in the stack.

**OS test creation version:** iOS: 18.6 and 26.4

## E2E test

Other: Planned, but will be implemented separately.

## Prerequisites

- iOS device or simulator: iPhone

## Steps - iPhone

### Baseline

1. Launch the app and navigate to the **Stacking FormSheets** screen.

- [ ] Content with the button "Open First FormSheet" is shown.

---

### Build the full stack

2. Tap "Open First FormSheet".

- [ ] The First (blue) FormSheet opens at the initial lower detent (0.4). The "Open Second FormSheet" and "Dismiss First FormSheet" buttons are visible.

3. Grab the top edge of the First FormSheet and swipe up to its maximum detent (1.0).

- [ ] The First FormSheet expands smoothly to the maximum available height.

4. Tap "Open Second FormSheet".

- [ ] The Second (green) FormSheet opens over the first at its initial detent (0.4). The First FormSheet remains visible in the background, keeping its expanded 1.0 detent.

5. Grab the top edge of the Second FormSheet and swipe up to its maximum detent (1.0).

- [ ] The Second FormSheet expands smoothly.

6. Tap "Open Third FormSheet".

- [ ] The Third (yellow) FormSheet opens over the second at its initial detent (0.4). The Second and First FormSheets remain in the background at their previous detents.

---

### Top dismissal

7. Tap "Dismiss Third FormSheet" inside the Third sheet.

- [ ] Only the Third FormSheet dismisses. The Second FormSheet returns and its expanded 1.0 detent. Its buttons are pressable.
- [ ] The First FormSheet is still present behind the Second.

8. Swipe the Second FormSheet (now the top sheet) down to fully dismiss it via native gesture.

- [ ] The Second FormSheet dismisses. The First FormSheet returns and its expanded 1.0 detent. Its buttons are pressable.

9. Tap "Dismiss First FormSheet" inside the First sheet.

- [ ] The First FormSheet dismisses, returning to the underlying main screen. Main-screen pressables work normally.

---

### Middle dismissal

10. Rebuild the stack: tap "Open First FormSheet", then "Open Second FormSheet", then "Open Third FormSheet".

- [ ] All three sheets are stacked, Third on top.

11. Tap "Dismiss Second FormSheet" inside the Third sheet. This dismisses the middle sheet while the Third sheet is still on top of it.

- [ ] The Second **and** Third FormSheets both dismiss. The user is returned to the First FormSheet.
- [ ] The First FormSheet remains present and interactive.

12. Tap "Open Second FormSheet" inside the First sheet, then "Open Third FormSheet" inside the Second sheet.

- [ ] Both sheets re-present correctly.

---

### Bottom dismissal

13. With all three sheets stacked, tap "Dismiss First FormSheet" inside the Third sheet. This dismisses the bottom-most sheet while the entire stack is open.

- [ ] All three FormSheets dismiss together, returning directly to the underlying main screen.
- [ ] Main-screen pressables work normally.

14. Tap "Open First FormSheet" again.

- [ ] The First FormSheet opens.

---

### Mid-stack dismissal from a two-sheet stack

15. With the First FormSheet open, tap "Open Second FormSheet".

- [ ] First and Second are stacked, Second on top.

16. Tap "Dismiss First FormSheet" inside the Second sheet.

- [ ] Both the First and Second FormSheets dismiss, returning to the underlying main screen.
