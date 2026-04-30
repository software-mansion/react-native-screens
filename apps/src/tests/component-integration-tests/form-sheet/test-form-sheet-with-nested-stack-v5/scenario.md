# Test Scenario: FormSheet with Nested Stack v5

## Details

**Description:** Verify the layout and state persistence of a `StackContainer` nested within a `FormSheet`. This test ensures that the Stack layout correctly fills the `FormSheet` container, that content remains properly centered, that the layout smoothly adapts when the FormSheet height changes, and that the Stack's navigation state is preserved when the sheet is dismissed and reopened.

**OS test creation version:** iOS: 18.6 and 26.4

## E2E test

Other: Planned, but will be implemented separately.

## Prerequisites

- iOS device/simulator

## Steps

### Baseline

1. Launch the app and navigate to the **FormSheet with Nested Stack v5** screen.

- [ ] Expected: Content with the button "Open FormSheet" is shown

---

### Initialization & Layout Verification

2. Tap the "Open FormSheet" button.

- [ ] Expected: The FormSheet opens at the initial lower detent (0.6). The "Home Screen" text is visible and centered within the sheet. The light blue background completely covers the FormSheet content area.


3. Tap the "Push A" button to push Screen A.

- [ ] Expected: The stack navigates to "Screen A". The "Screen A" text is centered. The light yellow background completely covers the FormSheet content area.

---

### Detent Adaptation

4. Grab the top edge of the FormSheet and swipe up to expand it to the maximum detent (1.0).

- [ ] Expected: The FormSheet expands to take up the maximum available height. The layout adapts dynamically - the light yellow background stretches to cover the new full height, and the "Screen A" text dynamically re-centers itself within the newly expanded view area.

---

### State Persistence

5. Swipe down on the FormSheet to dismiss it, then tap the "Open FormSheet" button again.

- [ ] Expected: The FormSheet re-opens at the initial lower detent (0.6). The stack's navigation state has been kept - the sheet immediately displays "Screen A" (with the yellow background and centered text) rather than resetting back to the Home Screen.
