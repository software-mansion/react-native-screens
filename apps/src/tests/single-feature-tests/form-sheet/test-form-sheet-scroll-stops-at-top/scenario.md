# Test Scenario: Scroll Stops At Top

## Details

**Description:** Verify how a `FormSheet` with a nested `ScrollView` splits a downward drag between the list and the sheet. The rule under test is decided once, when the gesture starts: a drag that starts on a list scrolled away from its top scrolls the list and stops at its top, without moving the sheet, even when the gesture continues past the top; a drag that starts with the list already at its top moves the sheet, at a single detent dismissing it and at two detents stepping down through the detents. Dragging the non-scrollable header always moves the sheet, whatever the list offset.

The sheet is tested with a single detent `[1]` and with two detents `[0.5, 1]`, opened at the large detent. The list has 40 rows, so it can be scrolled by less than the length of one drag as well as by much more.

**OS test creation version:** iOS: 27.1, Android: API Level 37.

## E2E test

TBD

## Prerequisites

- Android: emulator or device.
- iOS: iPhone device or simulator.

## Note

- At the lower detent, an upward drag on the list expands the sheet instead of scrolling the list (on Android whatever the list offset, on iOS when the list is at its top). This is why the "Scrolled list at the lower detent" section scrolls the list at the large detent first and then moves the sheet down with the header.
- "Scroll the list a little" means 2 or 3 rows, clearly less than the length of one drag across the screen. "Scroll the list far" means 10 rows or more.

## Steps

### Baseline

1. Launch the app and navigate to the **Scroll Stops At Top** screen.

    - [ ] The host shows the instruction and two buttons: "Open sheet (detents: [1])" and "Open sheet (detents: [0.5, 1])".

---

### Single detent, drag that starts on a scrolled list

1. Tap "Open sheet (detents: [1])".

    - [ ] The sheet opens up to the top of the screen. The "Drag here" header, "Top of the list", the "Close" button and the first rows are visible.

2. Scroll the list a little and lift the finger. Then start a new drag down on the list and continue it past the list's top without lifting the finger.

    - [ ] The list scrolls back and stops with "Top of the list" fully visible. The sheet does not move and stays open.

3. Scroll the list a little again and lift the finger. Then fling the list down fast, past its top.

    - [ ] Same as above: the list stops at its top, the sheet stays open.

4. With the list at its top, drag down on the list.

    - [ ] The sheet follows the finger and is dismissed.

---

### Single detent, drags that are not affected

1. Tap "Open sheet (detents: [1])", then drag down on the list right away.

    - [ ] The sheet follows the finger and is dismissed.

2. Tap "Open sheet (detents: [1])", scroll the list far and lift the finger. Then drag down on the list once.

    - [ ] The list scrolls back by the length of the drag and stays scrolled. The sheet stays open.

3. Drag the "Drag here" header down.

    - [ ] The sheet is dismissed, although the list is still scrolled.

---

### Two detents at the large detent

1. Tap "Open sheet (detents: [0.5, 1])".

    - [ ] The sheet opens at the large detent.

2. Scroll the list a little and lift the finger. Then start a new drag down on the list and continue it past the list's top without lifting the finger.

    - [ ] The list stops at its top. The sheet stays at the large detent.

3. With the list at its top, drag down on the list.

    - [ ] The sheet settles at the lower detent. The list stays at its top.

4. Drag down on the list again.

    - [ ] The sheet is dismissed.

---

### Two detents, scrolled list at the lower detent

1. Tap "Open sheet (detents: [0.5, 1])", scroll the list a little and lift the finger. Then drag the "Drag here" header down.

    - [ ] The sheet settles at the lower detent with the list still scrolled.

2. Drag down on the list and continue past the list's top without lifting the finger.

    - [ ] The list stops at its top. The sheet stays at the lower detent.

3. Dismiss the sheet by dragging the header down.

    - [ ] The sheet is dismissed.
