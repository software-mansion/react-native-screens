# Test Scenario: Edge Attached In Compact Height (iOS)

## Details

**Description:** Verify the `prefersEdgeAttachedInCompactHeight` prop, the same
for both styles (`FormSheet` and `PageSheet`). On iPhone in landscape, a sheet
fills the screen when the prop is off and stays attached to the bottom edge, as
wide as the safe area, when it is on, also when the prop changes while the
sheet is open. In portrait the prop has no visible effect.

**OS test creation version:** iOS: 26.1.

## E2E test

TBD: Planned, but will be implemented separately.

## Prerequisites

- iPhone: device or simulator, with rotation not locked.

## Note

- Wait for every animation to finish before the next tap.

## Steps

### Baseline

1. Launch the app and navigate to the **Edge Attached In Compact Height
   (iOS)** screen in portrait.

   - [ ] The screen shows "Edge attached: OFF", a switch (off), "Open
         FormSheet" and "Open PageSheet".

---

### Default (off)

1. Rotate the iPhone to landscape, then tap "Open FormSheet".

   - [ ] The sheet covers the whole screen; the host screen is not visible
         around it.
   - [ ] "FormSheet content", "Edge attached: OFF" and "Dismiss" are visible.

2. Tap "Dismiss", then tap "Open PageSheet".

   - [ ] The sheet covers the whole screen, the same as in step 1.

---

### Edge attached (on)

1. Tap "Dismiss", toggle the switch on, then tap "Open FormSheet".

   - [ ] The sheet is attached to the bottom edge, narrower than the screen,
         with the dimmed host screen visible on both sides.
   - [ ] The sheet does not extend into the areas next to the notch or the
         Dynamic Island on the left and right.

2. Tap "Dismiss", then tap "Open PageSheet".

   - [ ] The sheet looks the same as in step 1.

3. Tap "Dismiss", rotate the iPhone to portrait, then tap "Open FormSheet".

   - [ ] The sheet spans the full width of the screen and is anchored to the
         bottom, the same as with the switch off.

---

### Change while open

1. Rotate the iPhone to landscape.

   - [ ] The sheet is attached to the bottom edge, narrower than the screen,
         with the dimmed host screen visible on both sides.

2. Toggle the switch in the sheet off.

   - [ ] The sheet animates to cover the whole screen and shows "Edge
         attached: OFF".

3. Toggle the switch in the sheet on.

   - [ ] The sheet animates back to the bottom edge, narrower than the
         screen, with the dimmed host screen visible on both sides.
