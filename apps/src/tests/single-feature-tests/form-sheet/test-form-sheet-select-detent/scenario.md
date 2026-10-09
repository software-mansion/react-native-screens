# Test Scenario: Select Detent

## Details

**Description:** Verify the `selectDetent` command exposed through the `ref` of the `FormSheet` component. This test ensures that an already presented sheet animates to the detent requested from JS (index `0`, `1` or `'last'`), that the user can still drag the sheet between all detents afterwards, that `onDetentChanged` reports every programmatic change exactly once, and that calls made while the sheet is closed are ignored.

**OS test creation version:** iOS: 26.5, Android: API Level 36.

## E2E test

TBD: Planned, but will be implemented separately.

## Prerequisites

- iPhone: device or simulator.
- Android: phone device or emulator.

## Note

- `selectDetent` takes the index within the `detents` array or `'last'`. With detents `[0.3, 0.6, 1.0]`: `0` → 0.3, `1` → 0.6, `'last'` → 1.0. With detents `[0.4, 1.0]`: `0` → 0.4, `1` and `'last'` → 1.0.
- The "Active Index" card shows the index reported by the last `onDetentChanged` event and "onDetentChanged calls" counts the events since the sheet was opened. Opening the sheet resets both to `0`. The counter verifies that every programmatic change emits exactly one event; after the drag steps only the reported index is checked.
- Selecting the detent the sheet already rests at neither moves the sheet nor emits `onDetentChanged`.
- Calls made while the sheet is closed are ignored and the `'selectDetent' was called while the FormSheet is closed` warning is logged.
- **Android:** the content box is laid out to the largest detent and anchored to the top, so the card and the buttons stay at the top of the sheet at every detent.

## Steps

### Baseline

1. Launch the app and navigate to the **Select Detent** screen.

- [ ] The host screen shows "Detents: [0.3,0.6,1]" with the switch on, "Select 'last' in onWillAppear: OFF", and the "Open FormSheet" and "Select 'last' while closed" buttons.

---

### Closed sheet

2. Tap "Select 'last' while closed".

- [ ] No sheet is presented and the `'selectDetent' was called while the FormSheet is closed` warning is logged.

---

### Select detents from JS

3. Tap "Open FormSheet".

- [ ] The sheet presents at the lowest detent (0.3). The card shows Active Index `0` and "onDetentChanged calls: 0".

4. Tap "Select 'last'".

- [ ] The sheet animates to the maximum detent (1.0). The card shows `2` and "onDetentChanged calls: 1".

5. Tap "Select 1".

- [ ] The sheet animates to the middle detent (0.6). The card shows `1` and "onDetentChanged calls: 2".

6. Tap "Select 1" again.

- [ ] The sheet stays at 0.6. The card still shows `1` and "onDetentChanged calls: 2".

7. Tap "Select 0".

- [ ] The sheet animates to the lowest detent (0.3). The card shows `0` and "onDetentChanged calls: 3".

---

### Dragging after programmatic changes

8. Drag the sheet up until it settles at the middle detent (0.6).

- [ ] The sheet settles at 0.6 and the card shows `1`.

9. Drag the sheet up to the maximum detent (1.0).

- [ ] The sheet fills the available height and the card shows `2`.

10. Tap "Select 0".

- [ ] The sheet animates to the lowest detent (0.3). The card shows `0` and "onDetentChanged calls" increases by exactly one.

11. Tap "Dismiss from JS".

- [ ] The sheet dismisses.

---

### Selecting a detent while the sheet appears

12. Turn on "Select 'last' in onWillAppear", then tap "Open FormSheet".

- [ ] The sheet presents and ends up at the maximum detent (1.0). The card shows `2` and "onDetentChanged calls: 1".

13. Drag the sheet down until it settles at the lowest detent (0.3).

- [ ] The sheet settles at 0.3 and the card shows `0`.

14. Tap "Dismiss from JS" and turn off "Select 'last' in onWillAppear".

---

### Two detents

15. Turn off the detents switch, so that "Detents: [0.4,1]" is shown, then tap "Open FormSheet".

- [ ] The sheet presents at the lowest detent (0.4). The card shows `0` and "onDetentChanged calls: 0".

16. Tap "Select 1".

- [ ] The sheet animates to the maximum detent (1.0). The card shows `1` and "onDetentChanged calls: 1".

17. Tap "Select 'last'".

- [ ] The sheet stays at 1.0. The card still shows `1` and "onDetentChanged calls: 1".

18. Tap "Select 0".

- [ ] The sheet animates to the lowest detent (0.4). The card shows `0` and "onDetentChanged calls: 2".

---

### Dismissal

19. Tap "Dismiss from JS" (or swipe the sheet down past the lowest detent).

- [ ] The sheet dismisses and the host screen is undimmed; "Open FormSheet" is pressable again.
