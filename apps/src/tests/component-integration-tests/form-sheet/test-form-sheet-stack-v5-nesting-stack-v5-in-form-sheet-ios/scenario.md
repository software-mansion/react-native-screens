# Test Scenario: Nested Stack v5 In FormSheet (iOS)

## Details

**Description:** Verify the layout and state persistence of a `StackContainer` nested within a `FormSheet`. This test ensures that the Stack layout correctly fills the `FormSheet` container, that content remains properly centered, that the layout smoothly adapts when the FormSheet height changes, and that the Stack's navigation state is preserved when the sheet is dismissed and reopened.

**OS test creation version:** iOS: 18.6 and 26.5, iPadOS: 26.5.

## E2E test

TBD: Planned, but will be implemented separately.

## Prerequisites

- iPhone: device or simulator.
- iPad: device or simulator, app in full-screen mode (regular width and regular height size classes).

## Note

- iOS only – the scenario covers the iOS layout of a nested Stack v5; the Android counterpart will be added separately.
- The nested stack fills the sheet with `flex: 1`; each screen paints its own background (Home – light blue, A – light yellow), so the covered area is what shows how the sheet sizes its content.
- **iPad:** the sheet is presented as a centered floating panel with a fixed width, not as a full-width bottom sheet.

## Steps

### Baseline

1. Launch the app and navigate to the **Nested Stack v5 In FormSheet (iOS)** screen.

- [ ] The host screen shows the "Open FormSheet" button.

---

### Initialization & Layout Verification

2. Tap the "Open FormSheet" button.

- [ ] The FormSheet opens at the initial lower detent (0.6). The "Home Screen" text is visible and centered within the sheet. The light blue background completely covers the FormSheet content area.

3. Tap the "Push A" button to push Screen A.

- [ ] The stack navigates to "Screen A". The "Screen A" text is centered. The light yellow background completely covers the FormSheet content area.

---

### Detent Adaptation

4. Grab the top edge of the FormSheet and swipe up to expand it to the maximum detent (1.0).

- [ ] The FormSheet expands to take up the maximum available height (respecting the top inset). The layout adapts dynamically - the light yellow background stretches to cover the new full height, and the "Screen A" text dynamically re-centers itself within the newly expanded view area.

---

### State Persistence

5. Swipe down on the FormSheet to dismiss it, then tap the "Open FormSheet" button again.

- [ ] The FormSheet re-opens at the initial lower detent (0.6). The stack's navigation state has been kept - the sheet immediately displays "Screen A" (with the yellow background and centered text) rather than resetting back to the Home Screen.

---

### Pop Action

6. Tap the "Pop" button (or native header back button) to pop Screen A.

- [ ] The stack correctly navigates back to the "Home Screen". The "Home Screen" text is visible and centered, and the light blue background completely covers the FormSheet content area.
