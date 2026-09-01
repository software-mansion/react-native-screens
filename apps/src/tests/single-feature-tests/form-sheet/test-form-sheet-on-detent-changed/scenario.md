# Test Scenario: Detent Changed Event

## Details

**Description:** Verify the `onDetentChanged` event of the `FormSheet` component with detents `[0.4, 0.7, 1.0]`. This test ensures that when the user drags the sheet between the configured detents, the event is fired once the sheet settles and reports the array index of the new detent, which the sheet displays in its "Active Index" card.

**OS test creation version:** iOS: 18.6 and 26.5, iPadOS: 26.5, Android: API Level 36.

## E2E test

TBD: Planned, but will be implemented separately.

## Prerequisites

- iPhone: device or simulator.
- iPad: device or simulator, app in full-screen mode (regular width and regular height size classes).
- Android: phone device or emulator.

## Note

- The event reports the index within the `detents` array: `0` for 0.4, `1` for 0.7, `2` for 1.0. Opening the sheet resets the displayed value to `0`.
- **Android:** the event is emitted when the Material sheet settles in a state (collapsed → `0`, half-expanded → `1`, expanded → `2`), not while dragging. The content box is laid out to the largest detent and anchored to the top, so the card moves together with the sheet.
- **iPad:** the sheet is presented as a centered floating panel with a fixed width, not as a full-width bottom sheet.

## Steps - iOS

### Baseline

1. Launch the app and navigate to the **Detent Changed Event** screen.

- [ ] The host screen shows the "Open FormSheet" button.

---

### Track detent changes

2. Tap "Open FormSheet".

- [ ] The sheet presents at the lowest detent (0.4). The "Active Index" card inside the sheet shows `0`.

3. Drag the sheet up until it settles at the middle detent (0.7).

- [ ] The sheet settles at 0.7 and the card updates to `1`.

4. Drag the sheet up to the maximum detent (1.0).

- [ ] The sheet fills the available height and the card updates to `2`.

5. Drag the sheet down until it settles at the lowest detent (0.4).

- [ ] The sheet settles at 0.4 and the card updates back to `0`.

6. Drag the sheet up until it settles at the middle detent (0.7) again.

- [ ] The sheet settles at 0.7 and the card updates to `1`.

7. Drag the sheet a short way up towards the maximum detent (1.0) and release it before it passes the halfway point.

- [ ] The sheet settles back at 0.7 and the card still shows `1` – an aborted drag that settles at the current detent does not produce a new index.

---

### Dismissal

8. Tap "Dismiss from JS" (or swipe the sheet down past the lowest detent).

- [ ] The sheet dismisses and the host screen is undimmed; "Open FormSheet" is pressable again.

## Steps - Android

### Baseline

1. Launch the app and navigate to the **Detent Changed Event** screen.

- [ ] The host screen shows the "Open FormSheet" button.

---

### Track detent changes

2. Tap "Open FormSheet".

- [ ] The sheet presents at the lowest detent (0.4) and the host screen is dimmed. The "Active Index" card is anchored to the top of the sheet and shows `0`.

3. Drag the sheet up until it settles at the middle detent (0.7).

- [ ] The sheet settles at 0.7 and the card updates to `1` only after the sheet stops moving.

4. Drag the sheet up to the maximum detent (1.0).

- [ ] The sheet expands to the maximum available height (below the status bar) and the card updates to `2`.

5. Drag the sheet down until it settles at the lowest detent (0.4).

- [ ] The sheet settles at 0.4 and the card updates back to `0`.

6. Drag the sheet up until it settles at the middle detent (0.7) again.

- [ ] The sheet settles at 0.7 and the card updates to `1`.

7. Drag the sheet a short way up towards the maximum detent (1.0) and release it before it passes the halfway point.

- [ ] The sheet settles back at 0.7 and the card still shows `1` – an aborted drag that settles at the current detent does not produce a new index.

---

### Dismissal

8. Tap "Dismiss from JS" (or swipe the sheet down past the lowest detent, or use the system back gesture).

- [ ] The sheet dismisses and the host screen is undimmed; "Open FormSheet" is pressable again.
