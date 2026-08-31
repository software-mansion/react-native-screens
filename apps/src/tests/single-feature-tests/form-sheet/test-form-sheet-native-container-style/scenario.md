# Test Scenario: Native Container Style

## Details

**Description:** Verify `nativeContainerStyle.backgroundColor` of the `FormSheet` component with `detents="fitToContents"`. This test ensures that the color is applied to the native container of the sheet – filling the whole sheet bounds, including the bottom safe area that React content does not cover – and that it can be changed between presentations.

**OS test creation version:** iOS: 18.6 and 26.5, iPadOS: 26.5, Android: API Level 36.

## E2E test

TBD: Planned, but will be implemented separately.

## Prerequisites

- iPhone: device or simulator.
- iPad: device or simulator, app in full-screen mode (regular width and regular height size classes).
- Android: phone device or emulator.

## Note

- The React content of the sheet has no background of its own, so the background is sampled from the native container background color.
- **iPad:** the sheet is presented as a centered floating panel with a fixed width; there is no bottom safe area to cover, so the color simply fills the panel.
- **Android:** the sheet container is laid out behind the navigation bar, so the native color extends to the bottom edge of the screen while the React content stays above the bar. Content height changes are applied immediately, without animation.

## Steps - iPhone

### Baseline

1. Launch the app and navigate to the **Native Container Style** screen.

- [ ] The host screen shows the "Select Native Background Color:" chips with "NAVY" selected, and the "Open FormSheet" button.

---

### Default color

2. Tap "Open FormSheet".

- [ ] The sheet presents with a height matching its content. The navy background fills the whole sheet, including the area under the home indicator – no default-colored gap in the bottom safe area.

---

### Layout stability

3. Tap "Expand Content" inside the sheet.

- [ ] The sheet grows to accommodate the extra text box with a smooth animation. The navy background covers the new bounds throughout – no flashes or white gaps.

4. Tap "Dismiss from JS".

- [ ] The sheet dismisses.

---

### Changing the color

5. Tap the "PURPLE" chip, then "Open FormSheet".

- [ ] "PURPLE" is highlighted before opening. The sheet presents with a purple background that fills the whole sheet, including the bottom safe area, exactly like navy did.

6. Swipe the sheet down.

- [ ] The sheet dismisses and "Open FormSheet" is pressable again.

## Steps - iPad

### Baseline

1. Launch the app and navigate to the **Native Container Style** screen.

- [ ] The host screen shows the "Select Native Background Color:" chips with "NAVY" selected, and the "Open FormSheet" button.

---

### Default color

2. Tap "Open FormSheet".

- [ ] The sheet presents as a centered floating panel with a height matching its content. The navy background fills the whole panel up to its rounded corners.

---

### Layout stability

3. Tap "Expand Content" inside the panel.

- [ ] The panel grows vertically to accommodate the extra text box with a smooth animation; the width stays fixed. The navy background covers the new bounds throughout – no flashes or white gaps.

4. Tap "Dismiss from JS".

- [ ] The panel dismisses.

---

### Changing the color

5. Tap the "PURPLE" chip, then "Open FormSheet".

- [ ] "PURPLE" is highlighted before opening. The panel presents with a purple background that fills the whole panel, exactly like navy did.

6. Swipe the panel down.

- [ ] The panel dismisses and "Open FormSheet" is pressable again.

## Steps - Android

### Baseline

1. Launch the app and navigate to the **Native Container Style** screen.

- [ ] The host screen shows the "Select Native Background Color:" chips with "NAVY" selected, and the "Open FormSheet" button.

---

### Default color

2. Tap "Open FormSheet".

- [ ] The sheet presents with a height matching its content and the host screen is dimmed. The navy background fills the whole sheet and extends behind the navigation bar to the bottom edge of the screen – no default-colored gap.

---

### Layout stability

3. Tap "Expand Content" inside the sheet.

- [ ] The sheet snaps to the taller height immediately (no animation). The navy background covers the new bounds – no flashes or white gaps.

4. Tap "Dismiss from JS".

- [ ] The sheet dismisses.

---

### Changing the color

5. Tap the "PURPLE" chip, then "Open FormSheet".

- [ ] "PURPLE" is highlighted before opening. The sheet presents with a purple background that fills the whole sheet down to the bottom edge of the screen, exactly like navy did.

6. Swipe the sheet down (or use the system back gesture).

- [ ] The sheet dismisses and "Open FormSheet" is pressable again.
