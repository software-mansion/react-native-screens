# Test Scenario: onDetentChanged

## Details

**Description:** Verify the `onDetentChanged` event of the `FormSheet` component. This test ensures that when the user manually drags the sheet between multiple configured detents, the event is fired and accurately reports the array index of the newly settled detent.

**OS test creation version:** iOS: 18.6 and 26.4

## E2E test

Other: Planned, but will be implemented separately.

## Prerequisites

- iOS device or simulator (iPhone)

## Steps

### Baseline

1. Launch the app and navigate to the **OnDetentChanged** screen.

- [ ] Expected: A status text "Current Detent Index: 0" and an "Open FormSheet" button are shown.

### Track Detent Changes

2. Tap the "Open FormSheet" button.

- [ ] Expected: The FormSheet opens at the smallest initial detent (0.4). The textbox inside the sheet displays `0`.

3. Grab the drag indicator and swipe up until the sheet snaps to the middle detent (0.7).

- [ ] Expected: The sheet settles in the middle of the screen. The textbox inside the sheet updates to `1`.

4. Swipe up again to expand the sheet to the maximum detent (1.0).

- [ ] Expected: The sheet expands to fill the available screen height. The textbox inside the sheet updates to `2`.

5. Swipe down to collapse the sheet back to the smallest detent (0.4).

- [ ] Expected: The sheet shrinks back to the smallest size. The textbox inside the sheet updates back to `0`.

6. Tap the "Dismiss from JS" button or swipe the sheet all the way down to dismiss it.

- [ ] Expected: The FormSheet dismisses successfully.
