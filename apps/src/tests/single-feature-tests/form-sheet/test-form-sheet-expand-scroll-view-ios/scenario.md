# Test Scenario: Expand On Scroll To Edge (iOS)

## Details

**Description:** Verify the `prefersScrollingExpandsWhenScrolledToEdge` property of the `FormSheet` component with detents `[0.5, 1.0]` and a `ScrollView` inside the sheet. When the property is `true` (the UIKit default), scrolling the list up from its top edge at the lower detent expands the sheet first; when it is `false`, the list scrolls normally and the sheet stays at its detent. Manual dragging of the non-scrollable area expands the sheet in both cases.

**OS test creation version:** iOS: 18.6 and 26.5, iPadOS: 26.5.

## E2E test

TBD: Planned, but will be implemented separately.

## Prerequisites

- iPhone: device or simulator.
- iPad: device or simulator, app in full-screen mode (regular width and regular height size classes).

## Note

- iOS only
- The property only takes effect when scrolling starts exactly at the top edge of the `ScrollView` (content offset 0).
- The list keeps its scroll position across dismiss/present – scroll back to the top before testing the edge behavior again.
- **iPad:** the sheet is presented as a centered floating panel with a fixed width, not as a full-width bottom sheet.

## Steps - iPhone

### Baseline

1. Launch the app and navigate to the **Expand On Scroll To Edge (iOS)** screen.

- [ ] The host screen shows "Expands on scroll: ON", a switch (on) and the "Open FormSheet" button.

---

### Expansion enabled (default)

2. Tap "Open FormSheet".

- [ ] The sheet presents at the lower detent (0.5). The "Drag Here to Expand" header and the scrollable list ("List Item 1", "List Item 2", …) are visible.

3. Swipe up on the list.

- [ ] The sheet expands to the largest detent (1.0) first; the list does not scroll until the sheet has finished expanding.

4. Swipe up on the list again.

- [ ] The list scrolls normally and reveals further items; "Dismiss from JS" is reachable at the end of the list.

5. Tap "Dismiss from JS" (or swipe down on the header).

- [ ] The sheet dismisses.

---

### Expansion disabled

6. Flip the switch so the host screen reads "Expands on scroll: OFF", then tap "Open FormSheet".

- [ ] The sheet presents at the lower detent (0.5).

7. Make sure the list is scrolled to the very top, then swipe up on the list.

- [ ] The list scrolls normally and reveals further items. The sheet **does not** expand – it stays at 0.5.

8. Drag the "Drag Here to Expand" header up.

- [ ] The sheet expands to the largest detent (1.0) – manual dragging outside the list still works.

9. Tap "Dismiss from JS" (or swipe down on the header).

- [ ] The sheet dismisses and "Open FormSheet" is pressable again.

## Steps - iPad

### Baseline

1. Launch the app and navigate to the **Expand On Scroll To Edge (iOS)** screen.

- [ ] The host screen shows "Expands on scroll: ON", a switch (on) and the "Open FormSheet" button.

---

### Expansion enabled (default)

2. Tap "Open FormSheet".

- [ ] The sheet presents as a centered floating panel at the lower detent (0.5). The "Drag Here to Expand" header and the scrollable list ("List Item 1", "List Item 2", …) are visible.

3. Swipe up on the list.

- [ ] The panel grows to the largest detent (1.0) first (width unchanged); the list does not scroll until the panel has finished expanding.

4. Swipe up on the list again.

- [ ] The list scrolls normally and reveals further items; "Dismiss from JS" is reachable at the end of the list.

5. Tap "Dismiss from JS" (or swipe down on the header).

- [ ] The panel dismisses.

---

### Expansion disabled

6. Flip the switch so the host screen reads "Expands on scroll: OFF", then tap "Open FormSheet".

- [ ] The panel presents at the lower detent (0.5).

7. Make sure the list is scrolled to the very top, then swipe up on the list.

- [ ] The list scrolls normally and reveals further items. The panel **does not** grow – it stays at 0.5.

8. Drag the "Drag Here to Expand" header up.

- [ ] The panel grows to the largest detent (1.0) – manual dragging outside the list still works.

9. Tap "Dismiss from JS" (or swipe down on the header).

- [ ] The panel dismisses and "Open FormSheet" is pressable again.
