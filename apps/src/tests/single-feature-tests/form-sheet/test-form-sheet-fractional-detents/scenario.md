# Test Scenario: Fractional Detents

## Details

**Description:** Verify the geometry of `FormSheet` fractional `detents` for different detent counts and for different spreads: narrow (`[0.3, 0.55, 0.8]`), evenly spaced (`[0.25, 0.5, 0.75]`), reaching the top (`[0.3, 0.6, 1.0]`, `[0.2, 0.9, 1.0]`) and a middle detent close to the largest one (`[0.5, 0.65, 0.8]`). For each preset the sheet must rest at the requested fraction of the screen at every detent, every detent must be reachable by dragging in both directions, and the sheet must always end at the bottom edge of the screen.

The sheet is drawn as a translucent white surface without corner radius, and its React content box is transparent with two red strips: one at the top and one at the bottom of the content box. This makes the sheet's edges and the content box boundaries measurable against the host screen.

**OS test creation version:** iOS: 26.5, Android: API Level 36.

## E2E test

TBD: Planned, but will be implemented separately.

## Prerequisites

- iPhone: device or simulator.
- iPad: device or simulator, app in full-screen mode (regular width and regular height size classes).
- Android: phone device or emulator.

## Note

- **Android guides:** the host screen draws a thin horizontal line for every detent of the selected preset, at the detent's fraction of the host height measured from the bottom edge of the screen. A resting sheet must align its top edge – the top edge of the red header strip – with the guide of its current detent. This holds for every detent, including the lowest one. Because the sheet is translucent, the guides of the lower detents stay visible through the sheet body.
- **Android, `1.0` detent:** the sheet itself starts at the very top of the screen, but the top edge of the red header strip starts immediately below the bottom edge of the status bar; it does not overlap or extend behind the status bar. There is no guide for `1.0` (it would be the top edge of the screen).
- **iOS:** Fractions are resolved against the sheet's maximum height (the screen below the status bar), so relative checks apply: the visible height must grow with the detent value, `1.0` reaches the top just below the status bar, and every detent must be distinct and reachable. The content box follows the current detent, so the red footer strip is visible at the bottom of the sheet at every detent.
- The sheet always opens at the lowest detent of the selected preset. There is no dismiss button inside the sheet: dismiss it by swiping it down past the lowest detent or by tapping the dimmed area above it.

## Steps

### Single detent

1. Launch the app and navigate to the **Fractional Detents** screen.

- [ ] The host shows "Detents: [0.5]", the preset buttons and the "Open FormSheet" button. Android: a single guide labeled `0.5` is drawn at half of the screen.

2. Tap "Open FormSheet".

- [ ] The sheet rests at half of the screen; the red header strip is at its top edge and the sheet ends at the bottom edge of the screen. Android: the header's top edge aligns with the `0.5` guide; the footer strip is visible right above the navigation bar.

3. Dismiss the sheet.

- [ ] The host is undimmed and "Open FormSheet" is pressable again.

4. Tap "[1.0]", then "Open FormSheet".

- [ ] The sheet reaches the top of the screen. Android: the sheet slides behind the status bar, the red header strip sits just under the status bar and the footer strip right above the navigation bar. iOS: the sheet's top edge sits just below the status bar.

5. Dismiss the sheet.

---

### Two detents

6. Tap "[0.3, 0.6]", then "Open FormSheet".

- [ ] The sheet rests at the lowest detent. Android: the header's top edge aligns with the `0.3` guide; the `0.6` guide is above the sheet; no footer strip is visible.

7. Drag the sheet up.

- [ ] The sheet settles at the larger detent. Android: the header's top edge aligns with the `0.6` guide, the `0.3` guide is visible through the sheet body, and the footer strip is visible right above the navigation bar.

8. Drag the sheet down.

- [ ] The sheet settles back at the lowest detent, aligned with the `0.3` guide on Android.

9. Dismiss the sheet. Tap "[0.5, 1.0]", then "Open FormSheet".

- [ ] The sheet rests at half of the screen, at exactly the same position as the single `[0.5]` detent from step 2 (Android: header's top edge on the `0.5` guide).

10. Drag the sheet up, then down, then dismiss it.

- [ ] Up: the sheet reaches the top like in step 4. Down: it settles back at `0.5`.

---

### Three detents, reaching the top

11. Tap "[0.3, 0.6, 1.0]", then "Open FormSheet". Drag the sheet up twice, then down twice.

- [ ] The sheet visits the detents in order: `0.3` → `0.6` → `1.0` → `0.6` → `0.3`. Android: the header's top edge aligns with the corresponding guide at every stop (`1.0`: header just under the status bar), the guides of the lower detents show through the sheet body, and the footer strip appears only at `1.0`.

12. Dismiss the sheet. Tap "[0.2, 0.9, 1.0]" and repeat step 11.

- [ ] The lowest detent shows only a small strip of the sheet, the middle detent is close to the top, and the largest reaches the top. All three are distinct stops of the drag.

---

### Three detents, evenly spaced

13. Dismiss the sheet. Tap "[0.25, 0.5, 0.75]" and repeat step 11.

- [ ] The three stops are evenly spaced (a quarter of the screen apart). Android: the header's top edge aligns with the `0.25`, `0.5` and `0.75` guides; at `0.75` the sheet ends exactly at the bottom edge of the screen, with no dimmed strip below it, and the footer strip is visible right above the navigation bar.

---

### Middle detent close to the largest one

14. Dismiss the sheet. Tap "[0.5, 0.65, 0.8]", then "Open FormSheet".

- [ ] The sheet rests at `0.5`, at the same position as in steps 2 and 9.

15. Drag the sheet up.

- [ ] The sheet settles at `0.65`. Android: the header's top edge aligns with the `0.65` guide, **below** the `0.8` guide, and the sheet ends at the bottom edge of the screen – there is no strip of dimmed background between the sheet and the bottom of the screen.

16. Drag the sheet up again.

- [ ] The sheet moves **up** to `0.8`. Android: the header's top edge aligns with the `0.8` guide, the sheet still ends exactly at the bottom edge, and the footer strip is visible right above the navigation bar.

17. Drag the sheet down twice.

- [ ] The sheet stops at `0.65` and then at `0.5`.

18. Dismiss the sheet. Tap "[0.3, 0.55, 0.8]", then "Open FormSheet". Drag the sheet up twice, then down twice.

- [ ] The stops are `0.3` → `0.55` → `0.8` → `0.55` → `0.3`. Android: at `0.55` the header's top edge aligns with the `0.55` guide (previously the sheet rested noticeably higher, at about 0.69 of the screen).

19. Dismiss the sheet.

- [ ] The host screen is undimmed and "Open FormSheet" is pressable again.
