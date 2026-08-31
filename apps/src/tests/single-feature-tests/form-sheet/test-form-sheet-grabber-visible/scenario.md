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

## Steps - iPhone

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

- [ ] The sheet presents at 0.6 with a grabber indicator at its top. The switch inside the sheet is on.

5. Swipe the sheet down, flip the host switch back to **off**, then tap "Open FormSheet".

- [ ] The sheet presents with no grabber indicator.

6. Swipe the sheet down.

---

### Toggling from inside the sheet

7. Tap "Open FormSheet", then flip the switch inside the sheet to **on**.

- [ ] The grabber indicator appears at the top of the sheet without the sheet being dismissed or re-presented.

8. Flip the switch inside the sheet back to **off**.

- [ ] The grabber indicator disappears, again without any re-presentation.

9. Flip it to **on** once more and tap "Dismiss from JS".

- [ ] The sheet dismisses. The switch on the host screen reflects the last value set inside the sheet (on).

## Steps - iPad

### Baseline

1. Launch the app and navigate to the **Grabber Visibility** screen.

- [ ] The host screen shows the "prefersGrabberVisible" switch (off) and the "Open FormSheet" button.

---

### Grabber hidden (default)

2. Tap "Open FormSheet" without touching the switch.

- [ ] The sheet presents as a centered floating panel at the lower detent (0.6). No grabber indicator is shown at the top of the panel. The switch inside the panel is off.

3. Swipe the panel down to dismiss it.

- [ ] The panel dismisses; "Open FormSheet" is pressable again.

---

### Toggling from the host screen

4. Flip the switch on the host screen to **on**, then tap "Open FormSheet".

- [ ] The panel presents at 0.6 with a grabber indicator at its top edge. The switch inside the panel is on.

5. Swipe the panel down, flip the host switch back to **off**, then tap "Open FormSheet".

- [ ] The panel presents with no grabber indicator.

6. Swipe the panel down.

---

### Toggling from inside the sheet

7. Tap "Open FormSheet", then flip the switch inside the panel to **on**.

- [ ] The grabber indicator appears at the top edge of the panel without the panel being dismissed or re-presented.

8. Flip the switch inside the panel back to **off**.

- [ ] The grabber indicator disappears, again without any re-presentation.

9. Flip it to **on** once more and tap "Dismiss from JS".

- [ ] The panel dismisses. The switch on the host screen reflects the last value set inside the panel (on).

## Steps - Android

### Baseline

1. Launch the app and navigate to the **Grabber Visibility** screen.

- [ ] The host screen shows the "prefersGrabberVisible" switch (off) and the "Open FormSheet" button.

---

### Grabber hidden (default)

2. Tap "Open FormSheet" without touching the switch.

- [ ] The sheet presents at the lower detent (0.6) and the host screen is dimmed. No drag handle is shown at the top of the sheet; the "FormSheet content" title is anchored to the top of the sheet. The switch inside the sheet is off.

3. Swipe the sheet down to dismiss it.

- [ ] The sheet dismisses; "Open FormSheet" is pressable again.

---

### Toggling from the host screen

4. Flip the switch on the host screen to **on**, then tap "Open FormSheet".

- [ ] The sheet presents at 0.6 with a drag handle at its top; the content sits below the handle. The switch inside the sheet is on.

5. Swipe the sheet down, flip the host switch back to **off**, then tap "Open FormSheet".

- [ ] The sheet presents with no drag handle.

6. Swipe the sheet down.

---

### Toggling from inside the sheet

7. Tap "Open FormSheet", then flip the switch inside the sheet to **on**.

- [ ] The drag handle appears at the top of the sheet without the sheet being dismissed or re-presented; the content shifts down by the handle height.

8. Flip the switch inside the sheet back to **off**.

- [ ] The drag handle disappears and the content shifts back up, again without any re-presentation.

9. Flip it to **on** once more and tap "Dismiss from JS".

- [ ] The sheet dismisses. The switch on the host screen reflects the last value set inside the sheet (on).
