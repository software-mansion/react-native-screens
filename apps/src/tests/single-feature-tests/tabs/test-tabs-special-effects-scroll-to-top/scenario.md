# Test Scenario: specialEffects - scrollToTop

## Details

**Description:** This test scenario validates the `specialEffects.repeatedTabSelection.scrollToTop`
property on tab routes. It verifies that re-tapping an already-active
tab scrolls a scrollable screen back to the top when the property is enabled, and
that there is no scroll-to-top behavior when it is disabled or absent.

**OS test creation version:** iOS: 18.4 and 26.2, Android: API Level 36.

## E2E test

Full: Covers all manual scenario steps.

## Prerequisites

- iOS device or simulator
- Android emulator

## Note (Optional)

Tab1 has `scrollToTop: true`, Tab2 has `scrollToTop: false`, and Tab3 has no
`specialEffects` configured (default behavior). All three tabs display a scrollable
list of 50 items.

## Steps

### scrollToTop: true

1. Launch the app and navigate to the screen **Tabs special effect scroll to top**.

- [ ] Three tabs (Tab1, Tab2, Tab3) are visible in the tab bar.
Tab1 is active and displays a scrollable list of items.

2. Scroll down several items in Tab1.

- [ ] The list scrolls down; items above the fold are no longer visible.

3. Re-tap Tab1 (the already-active tab).

- [ ] The list animates back to the top of the scroll position
(item 1 is visible).

### scrollToTop: false

4. Tap Tab2.

- [ ] Tab2 becomes active and displays a scrollable list of items.

5. Scroll down several items in Tab2.

- [ ] The list scrolls down; items above the fold are no longer visible.

6. Re-tap Tab2 (the already-active tab).

- [ ] The list does **not** scroll back to the top; scroll position is
preserved.

### no specialEffects (default)

7. Tap Tab3.

- [ ] Tab3 becomes active and displays a scrollable list of items.

8. Scroll down several items in Tab3.

- [ ] The list scrolls down; items above the fold are no longer visible.

9. Re-tap Tab3 (the already-active tab).

- [ ] Observe and note the default behavior - back to the top of the
scroll position (item 1 is visible).

### scrollToTop: true — switching away and back (not a repeated tap)

10. Tap Tab1 and scroll down several items.

- [ ] Tab1 becomes active. The list scrolls down;
items above the fold are no longer visible.

11. Tap Tab3 to switch away from Tab1.

- [ ] Tab3 becomes active and displays its scrollable list.

12. Tap Tab1 again.

- [ ] Tab1 becomes active and the scroll position is **preserved** -
the list does not scroll back to the top.
