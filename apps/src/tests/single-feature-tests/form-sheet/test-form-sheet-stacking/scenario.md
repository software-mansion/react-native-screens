# Test Scenario: Stacked Sheets

## Details

**Description:** Verify the present / dismiss flow of several `FormSheet` components presented on top of each other. The host screen owns three sheets (First – blue, Second – green, Third – yellow), each with detents `[0.4, 1.0]`. Every sheet exposes buttons that dismiss any sheet in the stack, so the scenario covers dismissing the top, the middle and the bottom sheet – dismissing a sheet must also dismiss every sheet presented above it.

**OS test creation version:** iOS: 18.6 and 26.5, iPadOS: 26.5, Android: API Level 36.

## E2E test

TBD: Planned, but will be implemented separately.

## Prerequisites

- iPhone: device or simulator.
- iPad: device or simulator, app in full-screen mode (regular width and regular height size classes).
- Android: phone device or emulator.

## Note

- On Android the content of each sheet is anchored to the top, so the title and the buttons are reachable at the 0.4 detent (the content box is laid out to the largest detent); on iOS the content is centered within the current detent.
- **iPad:** every sheet is presented as a centered floating panel with a fixed width.

## Steps - iOS

### Baseline

1. Launch the app and navigate to the **Stacked Sheets** screen.

- [ ] The host screen shows the "Open First FormSheet" button.

---

### Build the full stack

2. Tap "Open First FormSheet".

- [ ] The blue First sheet presents at 0.4. Its title reads "First FormSheet" and the "Open Second FormSheet" / "Dismiss First FormSheet" buttons are visible.

3. Drag the First sheet up to 1.0.

- [ ] The First sheet expands to the maximum available height.

4. Tap "Open Second FormSheet".

- [ ] The green Second sheet presents over the First one at 0.4. The First sheet stays visible behind it, still at 1.0.

5. Drag the Second sheet up to 1.0.

- [ ] The Second sheet expands to the maximum available height.

6. Tap "Open Third FormSheet".

- [ ] The yellow Third sheet presents over the Second one at 0.4. The Second and First sheets stay behind it at their previous detents.

---

### Top dismissal

7. Tap "Dismiss Third FormSheet" inside the Third sheet.

- [ ] Only the Third sheet dismisses. The Second sheet is on top again, still at 1.0, and its buttons are pressable.
- [ ] The First sheet is still present behind the Second one.

8. Swipe the Second sheet (now the top one) down past its lower detent.

- [ ] The Second sheet dismisses natively. The First sheet is on top again, still at 1.0, and its buttons are pressable.

9. Tap "Dismiss First FormSheet" inside the First sheet.

- [ ] The First sheet dismisses and the host screen is undimmed. "Open First FormSheet" is pressable again.

---

### Middle dismissal

10. Rebuild the stack: tap "Open First FormSheet", then "Open Second FormSheet", then "Open Third FormSheet".

- [ ] All three sheets are stacked, the yellow Third one on top.

11. Tap "Dismiss Second FormSheet" inside the Third sheet.

- [ ] The Second **and** the Third sheet dismiss together. The blue First sheet is on top again and its buttons are pressable.

12. Tap "Open Second FormSheet" inside the First sheet, then "Open Third FormSheet" inside the Second sheet.

- [ ] Both sheets present again, in order, on top of the First one.

---

### Bottom dismissal

13. With all three sheets stacked, tap "Dismiss First FormSheet" inside the Third sheet.

- [ ] All three sheets dismiss together and the host screen is undimmed. "Open First FormSheet" is pressable again.

---

### Bottom dismissal from a two-sheet stack

14. Tap "Open First FormSheet", then "Open Second FormSheet".

- [ ] The First and the Second sheet are stacked, the green Second one on top.

15. Tap "Dismiss First FormSheet" inside the Second sheet.

- [ ] Both sheets dismiss together and the host screen is undimmed. "Open First FormSheet" is pressable again.

## Steps - Android

### Baseline

1. Launch the app and navigate to the **Stacked Sheets** screen.

- [ ] The host screen shows the "Open First FormSheet" button.

---

### Build the full stack

2. Tap "Open First FormSheet".

- [ ] The blue First sheet presents at 0.4 and the host screen is dimmed. Its title reads "First FormSheet" and the "Open Second FormSheet" / "Dismiss First FormSheet" buttons are visible.

3. Drag the First sheet up to 1.0.

- [ ] The First sheet expands to the maximum available height (below the status bar).

4. Tap "Open Second FormSheet".

- [ ] The green Second sheet presents over the First one at 0.4. The First sheet stays visible behind it, still at 1.0, and is dimmed.

5. Drag the Second sheet up to 1.0.

- [ ] The Second sheet expands to the maximum available height.

6. Tap "Open Third FormSheet".

- [ ] The yellow Third sheet presents over the Second one at 0.4. The Second and First sheets stay behind it at their previous detents.

---

### Top dismissal

7. Tap "Dismiss Third FormSheet" inside the Third sheet.

- [ ] Only the Third sheet dismisses. The Second sheet is on top again, still at 1.0, no longer dimmed, and its buttons are pressable.
- [ ] The First sheet is still present behind the Second one.

8. Swipe the Second sheet (now the top one) down past its lower detent.

- [ ] The Second sheet dismisses natively. The First sheet is on top again, still at 1.0, and its buttons are pressable.

9. Tap "Dismiss First FormSheet" inside the First sheet.

- [ ] The First sheet dismisses and the host screen is undimmed. "Open First FormSheet" is pressable again.

---

### Middle dismissal

10. Rebuild the stack: tap "Open First FormSheet", then "Open Second FormSheet", then "Open Third FormSheet".

- [ ] All three sheets are stacked, the yellow Third one on top.

11. Tap "Dismiss Second FormSheet" inside the Third sheet.

- [ ] The Second **and** the Third sheet dismiss together. The blue First sheet is on top again and its buttons are pressable.

12. Tap "Open Second FormSheet" inside the First sheet, then "Open Third FormSheet" inside the Second sheet.

- [ ] Both sheets present again, in order, on top of the First one.

---

### Bottom dismissal

13. With all three sheets stacked, tap "Dismiss First FormSheet" inside the Third sheet.

- [ ] All three sheets dismiss together and the host screen is undimmed. "Open First FormSheet" is pressable again.

---

### Bottom dismissal from a two-sheet stack

14. Tap "Open First FormSheet", then "Open Second FormSheet".

- [ ] The First and the Second sheet are stacked, the green Second one on top.

15. Tap "Dismiss First FormSheet" inside the Second sheet.

- [ ] Both sheets dismiss together and the host screen is undimmed. "Open First FormSheet" is pressable again.

---

### System back

16. Tap "Open First FormSheet", then "Open Second FormSheet", then use the system back gesture (or the back button).

- [ ] Only the Second (top) sheet dismisses; the First sheet stays presented and its buttons are pressable.
