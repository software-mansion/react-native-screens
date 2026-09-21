# Test Scenario: ScrollView In Sheet

## Details

**Description:** Verify that a `ScrollView` nested in a `FormSheet` with detents `[0.5, 1.0]` works properly: scrolling the list drives the sheet (swipe up expands, swipe down at the top edge collapses and then dismisses), while dragging the non-scrollable header always moves the sheet. On Android the `ScrollView` must opt into nested scrolling (`nestedScrollEnabled`) so that the Material `BottomSheetBehavior` receives its scroll events; the scenario also documents what happens without it.

**OS test creation version:** iOS: 18.6 and 26.5, Android: API Level 36.

## E2E test

TBD: Planned, but will be implemented separately.

## Prerequisites

- Android: emulator or device.
- iOS: iPhone device or simulator.

## Note

- The `nestedScrollEnabled` switch is Android-only; the prop has no effect on iOS.
- **Android:** toggle the switch only while the sheet is **closed** – Material resolves the scrolling child when the sheet is laid out.
- **Android:** the sheet content is laid out to the largest detent, so at `0.5` only the upper part of the list is visible. iOS lays the content out to the current detent.
- **Android:** an upward scroll on the list always moves the sheet up first, regardless of the list offset. On iOS the sheet expands only when the scroll starts at the top edge of the list (`prefersScrollingExpandsWhenScrolledToEdge`, default `true`).

## Steps

### Baseline

1. Launch the app and navigate to the **ScrollView In Sheet** screen.

- [ ] The host screen shows "nestedScrollEnabled (Android): ON", a switch (on), "Detent: -" and the "Open FormSheet" button.

---

### Scrolling drives the sheet

2. Tap "Open FormSheet".

- [ ] The sheet presents at the lower detent (0.5). The "Drag Here" header and the beginning of the list ("List Item 1", "List Item 2", …) are visible.

3. Slowly swipe up on the list with a long gesture (from the bottom of the screen to the top).

- [ ] The sheet expands to the largest detent (1.0) first. The list does not scroll while the sheet is moving; once the sheet reaches the top, the remaining part of the same gesture scrolls the list.

4. Swipe up on the list again.

- [ ] The list scrolls and reveals further items. The sheet stays at 1.0.

5. Swipe down on the list with a gesture shorter than the distance scrolled so far.

- [ ] The list scrolls back towards its top. The sheet stays at 1.0.

6. Scroll the list to its very top, then swipe down on the list.

- [ ] The sheet collapses to the lower detent (0.5) – on Android within the same gesture as soon as the list reaches its top edge. The list stays at its top.

7. Swipe down on the list again (list at its top, sheet at 0.5).

- [ ] The sheet dismisses and "Open FormSheet" is pressable again.

---

### Scrolled list at the lower detent

8. Tap "Open FormSheet", swipe up on the list so the sheet expands and the list scrolls a few items, then drag the "Drag Here" header down so the sheet collapses to 0.5 with the list still scrolled. Now swipe up on the list.

- [ ] Android: the sheet expands to 1.0 first and the list keeps its offset.
- [ ] iOS: the list scrolls and the sheet stays at 0.5 (the scroll did not start at the top edge).

9. Dismiss the sheet (scroll the list to the top and swipe down twice, or drag the header down twice).

- [ ] The sheet dismisses.

---

### Without nested scrolling (Android only)

10. Flip the switch so the host reads "nestedScrollEnabled (Android): OFF", then tap "Open FormSheet".

- [ ] The sheet presents at 0.5.

11. Swipe up on the list.

- [ ] The sheet expands to 1.0. The list does **not** scroll – the whole gesture is consumed by the sheet.

12. Swipe up on the list again.

- [ ] The list scrolls (the sheet cannot move further up, so the gesture reaches the list).

13. Swipe down on the scrolled list.

- [ ] The sheet collapses to 0.5 while the list keeps its offset. 

14. Swipe up on the header.

- [ ] It is impossible to scroll the list back up by touch. This is the expected Material behavior for a scroll view that does not take part in nested scrolling – `nestedScrollEnabled` is required for correct behavior.

15. Swipe down on the list again, then flip the switch back on.

- [ ] The sheet dismisses and the host reads "nestedScrollEnabled (Android): ON".
