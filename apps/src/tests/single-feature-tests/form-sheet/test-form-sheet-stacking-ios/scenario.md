# Test Scenario: Stacking FormSheets

## Details

**Description:** Verify stacking over a `FormSheet` another `FormSheet` instance. This test ensures that the underlying `FormSheet` correctly handles touches, that the new `FormSheet` presents with theirs independent configurations, and that both sheets maintain stability during dismissal and manual detent adjustments.

**OS test creation version:** iOS: 18.6 and 26.4

## E2E test

Other: Planned, but will be implemented separately.

## Prerequisites

- iOS device or simulator: iPhone

## Steps - iPhone

### Baseline

1. Launch the app and navigate to the **Stacking FormSheets** screen.

- [ ] Expected: Content with the button "Open First FormSheet" is shown.

---

### First FormSheet Initialization

2. Tap the "Open First FormSheet" button.

- [ ] Expected: The first FormSheet opens at the initial lower detent (0.4). The "First FormSheet" text, along with the "Open Second FormSheet" and "Dismiss First FormSheet" buttons, are visible. 

---

### First FormSheet Detent Adaptation

3. Grab the top edge of the First FormSheet and swipe up to expand it to its maximum detent (1.0).

- [ ] Expected: The first FormSheet expands smoothly to take up the maximum available height.

---

### Stacking the Second FormSheet

4. Tap the "Open Second FormSheet" button from within the first sheet.

- [ ] Expected: A second FormSheet opens over the top of the first one, presenting at its own initial detent (0.6). The first FormSheet remains visible in the background, maintaining its expanded 1.0 detent state. The "Second FormSheet" text and "Dismiss Second FormSheet" button are centered and visible.

---

### Independent Detent Adaptation

5. Grab the top edge of the Second FormSheet and swipe up to expand it to its maximum detent (0.9).

- [ ] Expected: The second FormSheet expands smoothly to ~90% of the screen height without affecting the expanded state of the first FormSheet beneath it.

---

### Sequential Dismissal Verification

6. Tap the "Dismiss Second FormSheet" button (or swipe down completely on the top sheet).

- [ ] Expected: The second FormSheet dismisses smoothly. The first FormSheet comes back into full focus and remains at its expanded 1.0 detent state from Step 3. Its internal buttons ("Open Second FormSheet", "Dismiss First FormSheet") are pressable.

7. Tap the "Dismiss First FormSheet" button (or swipe down completely).

- [ ] Expected: The first FormSheet dismisses smoothly, returning the user to the underlying main screen. Pressables on the main screen are working normally.
