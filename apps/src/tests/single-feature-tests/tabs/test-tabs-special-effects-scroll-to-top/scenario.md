# Test Scenario: specialEffects - scrollToTop

## Details

**Description:** This test scenario validates the `specialEffects.repeatedTabSelection.scrollToTop`
property on tab routes. It verifies that re-tapping an already-active
tab scrolls a scrollable screen back to the top when the property is enabled, and
that there is no scroll-to-top behavior when it is disabled or absent.

**OS test creation version:** iOS: 18.4 and 26.2, Android: 16.0 (Baklava).

## E2E test

Yes: Covers all manual scenario steps on **Android only**. Re-tapping an
already-selected tab does not trigger the reselect event on iOS 26.2+, making
`scrollToTop` untestable via Detox on iOS.

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

- [ ] Expected: Three tabs (Tab1, Tab2, Tab3) are visible in the tab bar.
Tab1 is active and displays a scrollable list of items.

2. Scroll down several items in Tab1.

- [ ] Expected: The list scrolls down; items above the fold are no longer visible.

3. Re-tap Tab1 (the already-active tab).

- [ ] Expected: The list animates back to the top of the scroll position
(item 1 is visible).

### scrollToTop: false

4. Tap Tab2.

- [ ] Expected: Tab2 becomes active and displays a scrollable list of items.

5. Scroll down several items in Tab2.

- [ ] Expected: The list scrolls down; items above the fold are no longer visible.

6. Re-tap Tab2 (the already-active tab).

- [ ] Expected: The list does **not** scroll back to the top; scroll position is
preserved.

### no specialEffects (default)

7. Tap Tab3.

- [ ] Expected: Tab3 becomes active and displays a scrollable list of items.

8. Scroll down several items in Tab3.

- [ ] Expected: The list scrolls down; items above the fold are no longer visible.

9. Re-tap Tab3 (the already-active tab).

- [ ] Expected: Observe and note the default behavior - back to the top of the
scroll position (item 1 is visible).

### scrollToTop: true — switching away and back (not a repeated tap)

10. Tap Tab1 and scroll down several items.

- [ ] Expected: Tab1 becomes active. The list scrolls down;
items above the fold are no longer visible.

11. Tap Tab3 to switch away from Tab1.

- [ ] Expected: Tab3 becomes active and displays its scrollable list.

12. Tap Tab1 again.

- [ ] Expected: Tab1 becomes active and the scroll position is **preserved** -
the list does not scroll back to the top.
