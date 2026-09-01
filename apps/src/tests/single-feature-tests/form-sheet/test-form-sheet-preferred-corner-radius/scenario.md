# Test Scenario: Corner Radius

## Details

**Description:** Verify the `preferredCornerRadius` property of the `FormSheet` component with detents `[0.6, 1.0]`. This test ensures that `'systemDefault'` maps to the system's automatic corner radius, that explicit values (`0`, `10`, `50`) change the rounding, and that the radius updates while the sheet is presented.

**OS test creation version:** iOS: 18.6 and 26.5, iPadOS: 26.5, Android: API Level 36.

## E2E test

TBD: Planned, but will be implemented separately.

## Prerequisites

- iPhone: device or simulator.
- iPad: device or simulator, app in full-screen mode (regular width and regular height size classes).
- Android: phone device or emulator running API level 33 or higher.

## Note

- **iOS 18:** the radius affects the **top** corners of the sheet. **iOS 26:** the radius affects **all** corners.
- **iPad:** the sheet is presented as a floating panel, so the radius affects **all four** corners.
- **Android:** rounded-corner clipping is applied only on API level 33+; the radius affects the **top** corners. Known limitation: updating the radius while the sheet is fully expanded to the top of the screen (1.0) makes the corners flat, change the radius at the 0.6 detent.

## Steps

### Baseline

1. Launch the app and navigate to the **Corner Radius** screen.

- [ ] The host screen shows "Current Radius: systemDefault" and the "Open FormSheet" button.

---

### System default

2. Tap "Open FormSheet".

- [ ] The sheet presents at the lower detent (0.6). The affected corners (see Note: top corners on iOS 18 and Android, all corners on iOS 26 and iPad) have the platform-default rounding. The title inside reads "Current Radius: systemDefault".

---

### Dynamic updates

3. Tap "Sharp (0)" inside the sheet.

- [ ] The corners become sharp immediately, without re-presenting the sheet. The title reads "Current Radius: 0".

4. Tap "Small (10)".

- [ ] The corners get a slight rounding; the title reads "Current Radius: 10".

5. Tap "Large (50)".

- [ ] The corners get a deep rounding; the title reads "Current Radius: 50".

6. Tap "System default".

- [ ] The corners return to the system-default rounding; the title reads "Current Radius: systemDefault".

---

### Dismissal

7. Tap "Dismiss from JS" (or swipe the sheet down).

- [ ] The sheet dismisses and the host screen shows the last selected radius; "Open FormSheet" is pressable again.

## Steps - Android only

### Known limitation at 1.0

8. Tap "Open FormSheet", drag the sheet up to the largest detent (1.0), then tap "Large (50)".

- [ ] The corners become flat instead of rounded (see Note) – this is the documented Material limitation, not a regression.

9. Tap "Dismiss from JS".

- [ ] The sheet dismisses.
