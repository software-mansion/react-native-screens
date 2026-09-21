# Test Scenario: Grabber Visibility

## Details

**Description:** Verify that the `prefersGrabberVisible` property of the `FormSheet` component controls the grabber indicator at the top of the sheet. This test covers toggling the property before the sheet is presented (from the host screen) and while the sheet is presented (from inside the sheet).

**OS test creation version:** iOS: 18.6 and 26.5, iPadOS: 26.5, Android: API Level 36.

## E2E test

TBD: Planned, but will be implemented separately.

## Prerequisites

- iPhone: device or simulator.
- iPad: device or simulator, app in full-screen mode (regular width and regular height size classes).
- Android: phone device or emulator.

## Note

- **iOS:** the grabber is the system indicator the system may still hide it in some presentation contexts.
- **Android:** the grabber is Material's drag handle, rendered above the React content; toggling it changes the content position by the handle height.
- **iPad:** the sheet is presented as a centered floating panel with a fixed width; the grabber is drawn at the top edge of the panel.

## Steps

### Baseline

1. Launch the app and navigate to the **Grabber Visibility** screen.

- [ ] The host screen shows the "prefersGrabberVisible" switch (off) and the "Open FormSheet" button.

---

### Grabber hidden (default)

2. Tap "Open FormSheet" without touching the switch.

- [ ] The sheet presents at the lower detent (0.6). No grabber indicator is shown at the top of the sheet. The switch inside the sheet is off.

3. Swipe the sheet down to dismiss it.

- [ ] The sheet dismisses; "Open FormSheet" is pressable again.

---

### Toggling from the host screen

4. Flip the switch on the host screen to **on**, then tap "Open FormSheet".

- [ ] The sheet presents at 0.6 with a grabber at its top. The switch inside the sheet is on.
- [ ] Android: the content sits below the drag handle.

5. Swipe the sheet down, flip the host switch back to **off**, then tap "Open FormSheet".

- [ ] The sheet presents with no grabber.

6. Swipe the sheet down.

---

### Toggling from inside the sheet

7. Tap "Open FormSheet", then flip the switch inside the sheet to **on**.

- [ ] The grabber appears at the top of the sheet without the sheet being dismissed or re-presented.
- [ ] Android: the content shifts down by the grabber height.

8. Flip the switch inside the sheet back to **off**.

- [ ] The grabber disappears, again without any re-presentation.
- [ ] Android: the content shifts back up.

9. Flip it to **on** once more and tap "Dismiss from JS".

- [ ] The sheet dismisses. The switch on the host screen reflects the last value set inside the sheet (on).
