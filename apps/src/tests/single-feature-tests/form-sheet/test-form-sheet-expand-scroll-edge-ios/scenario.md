# Test Scenario: shouldExpandWhenScrolledToEdge

## Details

**Description:** Verify the `shouldExpandWhenScrolledToEdge` property of the `FormSheet` component. This test ensures that when the property is set to `true`, scrolling a child `ScrollView` at a lower detent expands the sheet to a larger detent first. When set to `false`, the same scrolling action should not expand the sheet, and the scroll view should scroll normally. It also verifies that manual dragging still works when scroll expansion is disabled.

**OS test creation version:** iOS: 18.6 and 26.4

## E2E test

Other: Planned, but will be implemented separately.

## Prerequisites

- iOS device or simulator: iPhone

## Note

- The default value of `shouldExpandWhenScrolledToEdge` in UIKit is `true`.

## Steps - iPhone

### Baseline

1. Launch the app and navigate to the **Expand when scrolled to edge** screen.

- [ ] Expected: A status text indicating the current prop value ("Expands on edge scroll: ON"), a toggle button, and an "Open FormSheet" button are shown.

### Expansion enabled (Default)

2. Ensure the toggle is set to `ON`. Tap the "Open FormSheet" button.

- [ ] Expected: The FormSheet opens at the initial lower detent (0.5). The "Drag Here to Expand" header and a scrollable list of items are visible.

3. Swipe up on the scrollable list content.

- [ ] Expected: The FormSheet expands to the maximum detent (1.0). The list content does not scroll until the sheet has finished expanding to the maximum detent.

4. Dismiss the sheet by tapping "Dismiss from JS" or swiping down on the drag indicator.

### Expansion disabled

5. Tap the toggle button so the status reads "Expands on edge scroll: OFF".

6. Tap the "Open FormSheet" button.

- [ ] Expected: The FormSheet opens at the initial lower detent (0.5).

7. Swipe up on the scrollable list content.

- [ ] Expected: The list scrolls normally to reveal lower items. The FormSheet **does not** expand to the maximum detent and remains at 0.5. 

8. Grab the "Drag Here to Expand" header area above the list and drag it up.

- [ ] Expected: The FormSheet expands to the maximum detent (1.0), verifying that manual sheet expansion is still possible outside the ScrollView area.
