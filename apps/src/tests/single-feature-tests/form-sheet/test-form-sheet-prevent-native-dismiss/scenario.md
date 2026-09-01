# Test Scenario: Prevent Native Dismiss

## Details

**Description:** Verify the `preventNativeDismiss` property and the `onNativeDismissPrevented` event of the `FormSheet` component with detents `[0.5, 1.0]`. When the property is `true`, the sheet cannot be dismissed natively (swipe down, backdrop tap, and on Android the system back gesture); each attempt fires `onNativeDismissPrevented`, which the scenario surfaces as a "Dismissal Prevented" alert. Dragging between detents and dismissing from JS still work. When the property is `false`, native dismissal works and no event is fired.

**OS test creation version:** iOS: 18.6 and 26.5, iPadOS: 26.5, Android: API Level 36.

## E2E test

TBD: Planned, but will be implemented separately.

## Prerequisites

- iPhone: device or simulator.
- iPad: device or simulator, app in full-screen mode (regular width and regular height size classes).
- Android: phone device or emulator.

## Note

- **Android:** a prevented attempt makes the sheet return to its last stable detent; the system back gesture/button is intercepted the same way as the swipe.
- **iPad:** the sheet is presented as a centered floating panel with a fixed width; the backdrop is the dimmed area around the panel.

## Steps

### Baseline

1. Launch the app and navigate to the **Prevent Native Dismiss** screen.

- [ ] The host screen shows "Prevent Native Dismiss: ON", a switch (on) and the "Open FormSheet" button.

---

### Native dismissal prevented

2. Tap "Open FormSheet".

- [ ] The sheet presents at the lower detent (0.5). The text inside asks to try swiping down or tapping the backdrop.

3. Drag the sheet up to 1.0, then back down to 0.5.

- [ ] Both drags work – detent changes are not blocked.

4. Swipe the sheet down past the lower detent.

- [ ] The sheet does **not** dismiss – it bounces back to 0.5 and a "Dismissal Prevented" alert appears.

5. Tap "OK" on the alert.

- [ ] The alert closes; the sheet is still presented.

6. Tap the backdrop (the dimmed area outside the sheet).

- [ ] The sheet does **not** dismiss and the "Dismissal Prevented" alert appears again.

7. Tap "OK", then tap "Dismiss from JS".

- [ ] The sheet dismisses – programmatic dismissal is not affected.

---

### Native dismissal allowed

8. Flip the switch so the host screen reads "Prevent Native Dismiss: OFF", then tap "Open FormSheet".

- [ ] The sheet presents at 0.5. The text inside says the sheet should close without an alert.

9. Swipe the sheet down past the lower detent.

- [ ] The sheet dismisses; no alert is shown.

10. Tap "Open FormSheet", then tap the backdrop.

- [ ] The sheet dismisses; no alert is shown. "Open FormSheet" is pressable again.

## Steps - Android only

### System back

11. Flip the switch back so the host screen reads "Prevent Native Dismiss: ON", tap "Open FormSheet", then use the system back gesture (or the back button).

- [ ] The sheet does **not** dismiss and the "Dismissal Prevented" alert appears.

12. Tap "OK", then tap "Dismiss from JS". Flip the switch so the host screen reads "Prevent Native Dismiss: OFF", tap "Open FormSheet", then use the system back gesture (or the back button) again.

- [ ] The sheet dismisses; no alert is shown. "Open FormSheet" is pressable again.
