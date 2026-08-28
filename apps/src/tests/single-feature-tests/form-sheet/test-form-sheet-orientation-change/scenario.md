# Test Scenario: Sheet orientation change

## Details

**Description:** Verify that a presented `FormSheet` keeps a correct size and position, and that its React content is laid out to the sheet's surface, after the device orientation changes.

**OS test creation version:** iOS: 26.5; Android: API Level 36.

## E2E test

TBD: Planned, but will be implemented separately.

## Prerequisites

- iOS device or simulator (iPhone).
- Android emulator or device with auto-rotate enabled.

## Steps

1. Launch the app and navigate to the **Sheet orientation change** screen.
2. Tap "Open FormSheet".

- [ ] The sheet opens at the 0.3 detent.

3. Rotate the device to landscape.

- [ ] The sheet still rests at the 0.3 detent, relative to the landscape height.
- [ ] The content is adapted to the bounds.

4. Drag the sheet up to the 1.0 detent.

- [ ] The sheet expands to the top of the screen and the content stays framed.

5. Rotate the device back to portrait.

- [ ] The sheet stays expanded to the top of the screen (1.0 detent of the portrait height).
- [ ] The content is fully visible and adapted to portrait dimensions.

6. Drag the sheet down to dismiss it.

### Opening in landscape

7. Rotate the device to landscape and open the sheet.

- [ ] The sheet opens at the 0.3 detent of the landscape height, with the content framed.

8. Rotate to portrait.

- [ ] The sheet rests at the 0.3 detent of the portrait height, with the content framed.

9. Dismiss the sheet.

### Rotating while dismissed

10. In portrait, open the sheet and dismiss it.
11. Rotate the device to landscape and open the sheet again.

- [ ] The sheet is horizontally centered and rests at the 0.3 detent of the landscape height.

12. Dismiss the sheet with a swipe down, rotate to portrait and open it again.

- [ ] The sheet spans the full width and rests at the 0.3 detent of the portrait height.

13. Dismiss the sheet.
