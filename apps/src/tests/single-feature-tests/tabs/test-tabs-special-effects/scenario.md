# Test Scenario: specialEffects - scrollToTop

## Details

**Description:** This test scenario validates the `specialEffects.repeatedTabSelection.
scrollToTop` property on tab routes. It verifies that re-tapping an already-active
tab scrolls a scrollable screen back to the top when the property is enabled or
absent, and that there is no scroll-to-top behavior when it is disabled.

**OS test creation version:** iOS: 18.4 and 26.2 Android: 16.0 (Baklava).

## E2E test

Other: ongoing research.

## Prerequisites

- iOS device or simulator
- Android emulator

## Note (Optional)

Tab2 has `scrollToTop: true`, Tab3 has `scrollToTop: false`, and Tab4 has no
`specialEffects` configured (default behavior).

## Steps

### ScrollToTop: true

1. Launch the app and navigate to the screen Tabs specialEffects.

- [ ] Expected: Four tabs (Tab1, Tab2, Tab3, Tab4) are visible in the tab bar.
Tab1 is active and shows the welcome message.

2. Tap Tab2.

- [ ] Expected: Tab2 becomes active and displays a scrollable list of items.

1. Scroll down several items in Tab2.

- [ ] Expected: The list scrolls down; items above the fold are no longer visible.

4. Re-tap Tab2 (the already-active tab).

- [ ] Expected: The list animates back to the top of the scroll position
(item 1 is visible).

### scrollToTop: false

5. Tap Tab3.

- [ ] Expected: Tab3 becomes active and displays a scrollable list of 50 items.

6. Scroll down several items in Tab3.

- [ ] Expected: The list scrolls down; items above the fold are no longer visible.

7. Re-tap Tab3 (the already-active tab).

- [ ] Expected: The list does **not** scroll back to the top; scroll position is
preserved.

### no specialEffects (default)

8. Tap Tab4.

- [ ] Expected: Tab4 becomes active and displays a scrollable list of 50 items.

9. Scroll down several items in Tab4.

- [ ] Expected: The list scrolls down; items above the fold are no longer visible.

10. Re-tap Tab4 (the already-active tab).

- [ ] Expected: Observe and note the default platform behavior (scroll-to-top or
not). No crash or visual glitch should occur.

### scrollToTop: true — switching away and back (not a repeated tap)

11. Tap Tab2 and scroll down several items in Tab2.

- [ ] Expected: Tab2 becomes active. The list scrolls down;
items above the fold are no longer visible.

12. Tap Tab1 to switch away from Tab2.

- [ ] Expected: Tab1 becomes active and shows the welcome message.

13. Tap Tab2 again.

- [ ] Expected: Tab2 becomes active and the scroll position is **preserved** -
the list does not scroll back to the top.
