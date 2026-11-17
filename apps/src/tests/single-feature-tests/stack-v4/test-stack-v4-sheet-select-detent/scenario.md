# Test Scenario: Sheet Select Detent

## Details

**Description:** Verify the `selectDetent` command exposed through the `sheetRef` of a Stack v4 screen presented as `formSheet`. This test ensures that a presented form sheet animates to the detent requested from JS (index `0`, `1` or `'last'`), that the user can still drag the sheet between all detents afterwards, and that every programmatic change is reported with exactly one stable `onSheetDetentChanged` event.

**OS test creation version:** iOS: 26.5, Android: API Level 36.

## E2E test

TBD: Planned, but will be implemented separately.

## Prerequisites

- iPhone: device or simulator.
- Android: phone device or emulator.

## Note

- `selectDetent` takes the index within the `sheetAllowedDetents` array or `'last'`. With detents `[0.3, 0.6, 1.0]`: `0` → 0.3, `1` → 0.6, `'last'` → 1.0. With detents `[0.4, 1.0]`: `0` → 0.4, `1` and `'last'` → 1.0.
- The card shows the index reported by the last `onSheetDetentChanged` event and "Stable onSheetDetentChanged calls" counts the events with `isStable: true` since the sheet was opened. Opening the sheet resets both to `0`. After the drag step only the reported index is checked.
- Selecting the detent the sheet already rests at neither moves the sheet nor emits a stable event.
- **Android:** while the sheet settles, `onSheetDetentChanged` is also emitted with `isStable: false` and the previous index, the same as while dragging. These events aren't counted.

## Steps

### Baseline

1. Launch the app and navigate to the **Sheet Select Detent** screen in the **Stack v4** group.

- [ ] The screen shows the "Sheet selectDetent" header, "Detents: [0.3,0.6,1]" with the switch on, and the "Open form sheet" button.

---

### Select detents from JS

2. Tap "Open form sheet".

- [ ] The sheet presents at the lowest detent (0.3). The card shows `0` and "Stable onSheetDetentChanged calls: 0".

3. Tap "Select 'last'".

- [ ] The sheet animates to the maximum detent (1.0). The card shows `2` and "Stable onSheetDetentChanged calls: 1".

4. Tap "Select 1".

- [ ] The sheet animates to the middle detent (0.6). The card shows `1` and "Stable onSheetDetentChanged calls: 2".

5. Tap "Select 1" again.

- [ ] The sheet stays at 0.6. The card still shows `1` and "Stable onSheetDetentChanged calls: 2".

6. Tap "Select 0".

- [ ] The sheet animates to the lowest detent (0.3). The card shows `0` and "Stable onSheetDetentChanged calls: 3".

---

### Dragging after programmatic changes

7. Drag the sheet up until it settles at the middle detent (0.6).

- [ ] The sheet settles at 0.6 and the card shows `1`.

8. Tap "Select 'last'".

- [ ] The sheet animates to the maximum detent (1.0). The card shows `2` and "Stable onSheetDetentChanged calls" increases by exactly one.

9. Tap "Dismiss from JS".

- [ ] The sheet dismisses.

---

### Two detents

10. Turn off the detents switch, so that "Detents: [0.4,1]" is shown, then tap "Open form sheet".

- [ ] The sheet presents at the lowest detent (0.4). The card shows `0` and "Stable onSheetDetentChanged calls: 0".

11. Tap "Select 1".

- [ ] The sheet animates to the maximum detent (1.0). The card shows `1` and "Stable onSheetDetentChanged calls: 1".

12. Tap "Select 'last'".

- [ ] The sheet stays at 1.0. The card still shows `1` and "Stable onSheetDetentChanged calls: 1".

13. Tap "Select 0".

- [ ] The sheet animates to the lowest detent (0.4). The card shows `0` and "Stable onSheetDetentChanged calls: 2".

---

### Dismissal

14. Tap "Dismiss from JS" (or swipe the sheet down past the lowest detent).

- [ ] The sheet dismisses and the "Open form sheet" button is pressable again.
