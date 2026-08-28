# Test Scenario: Sheet orientation change

## Details

**Description:** Verify that a presented `FormSheet` keeps a correct size and position, and that its React content is laid out to the sheet's surface, after the device orientation changes.

**OS test creation version:** iOS: 26.5; Android: API Level 36.

## E2E test

TBD: Planned, but will be implemented separately.

## Prerequisites

- iOS device or simulator: iPhone and iPad
- On iPad: Ensure the device is in full-screen mode, regular width, regular height size class
- Android emulator or device with auto-rotate enabled.

## Note

- On iPhone, landscape is a **compact height** size class. `UISheetPresentationController` presents sheets **full screen** there and the detents are inactive (the system `medium` detent is documented as "inactive in compact height", custom detents behave the same). Expect the sheet to cover the whole screen in landscape.
- On iPad, both orientations are regular height, so the detents apply in both. The sheet is presented as a **centered floating panel**, so the checks below about the sheet spanning the full width do not apply.
- On Android, the detents are always resolved against the current window height, so the sheet rests at the same fraction in both orientations.

## Steps

1. Launch the app and navigate to the **Sheet orientation change** screen.
2. Tap "Open FormSheet".

- [ ] The sheet opens at the 0.3 detent.

3. Rotate the device to landscape.

- [ ] Android, iPad: The sheet rests at the 0.3 detent of the landscape height.
- [ ] iPhone: The sheet covers the full screen.
- [ ] The content is laid out to the sheet's surface (no gaps, nothing cut off).

4. Android, iPad: Drag the sheet up to the 1.0 detent.

- [ ] The sheet expands to the top of the screen and the content follows.

5. Rotate the device back to portrait.

- [ ] Android, iPad: The sheet stays expanded to the top of the screen (1.0 detent of the portrait height).
- [ ] iPhone: The sheet returns to the 0.3 detent of the portrait height.
- [ ] The content is fully visible and laid out to the portrait dimensions.

6. Drag the sheet down to dismiss it.

### Opening in landscape

7. Rotate the device to landscape and open the sheet.

- [ ] Android, iPad: The sheet opens at the 0.3 detent of the landscape height.
- [ ] iPhone: The sheet covers the full screen.
- [ ] The content is laid out to the sheet's surface.

8. Rotate to portrait.

- [ ] The sheet rests at the 0.3 detent of the portrait height, with the content laid out to the sheet's surface.

9. Dismiss the sheet.

### Rotating while dismissed

10. In portrait, open the sheet and dismiss it.
11. Rotate the device to landscape and open the sheet again.

- [ ] Android: The sheet is horizontally centered and rests at the 0.3 detent of the landscape height.
- [ ] iPad: The sheet rests at the 0.3 detent of the landscape height.
- [ ] iPhone: The sheet covers the full screen.

12. Dismiss the sheet with a swipe down, rotate to portrait and open it again.

- [ ] Android, iPhone: The sheet spans the full width and rests at the 0.3 detent of the portrait height.
- [ ] iPad: The sheet rests at the 0.3 detent of the portrait height.
- [ ] The bottom of the sheet looks the same as after the first presentation (no growing strip below the content).

13. Dismiss the sheet.
