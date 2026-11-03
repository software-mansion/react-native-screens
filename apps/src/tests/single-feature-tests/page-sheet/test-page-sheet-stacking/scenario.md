# Test Scenario: Mixed Stacking (PageSheet & FormSheet)

## Details

**Description:** Verify the present / dismiss flow of a stack that mixes both sheet styles: a `PageSheet` (First – blue), a `FormSheet` presented from it (Second – green) and another `PageSheet` presented from that one (Third – yellow), each with detents `[0.4, 1.0]`. Every sheet exposes buttons that dismiss any sheet in the stack, so the scenario covers dismissing the top, the middle and the bottom sheet – dismissing a sheet must also dismiss every sheet presented above it, regardless of style. The scenario exercises presentation-source lookup through a chain of controllers with differing `modalPresentationStyle`.

**OS test creation version:** iOS: 26.1, iPadOS: 26.1, Android: API Level 36.

## E2E test

TBD: Planned, but will be implemented separately.

## Prerequisites

- iPhone: device or simulator.
- iPad: device or simulator, app in full-screen mode (regular width and regular height size classes).
- Android: phone device or emulator.

## Note

- On Android both styles present the same bottom sheet dialog, so the stack behaves exactly like `test-form-sheet-stacking`. The content of each sheet is anchored to the top; on iOS it is centered within the current detent.
- **iPad:** the First and Third sheets are wide, bottom-anchored cards; the Second is a centered floating panel. Presenting the panel from the card and the card from the panel must both work.

## Steps

### Baseline

1. Launch the app and navigate to the **Mixed Stacking (PageSheet & FormSheet)** screen.

    - [ ] The host screen shows the "Open First PageSheet" button.

---

### Build the full stack

1. Tap "Open First PageSheet".

    - [ ] The blue First sheet presents at 0.4 and the host screen is dimmed. Its title reads "First PageSheet".

2. Drag the First sheet up to 1.0 and tap "Open Second FormSheet".

    - [ ] The green Second sheet presents on top at 0.4. iPhone: the First sheet is pushed back behind it. iPad: a centered panel appears over the wide card.

3. Drag the Second sheet up to 1.0 and tap "Open Third PageSheet".

    - [ ] The yellow Third sheet presents on top at 0.4. iPad: a wide, bottom-anchored card appears over the centered panel.

---

### Dismiss the top sheet

1. Tap "Dismiss Third PageSheet".

    - [ ] Only the Third sheet dismisses; the Second (green) sheet is visible again at 1.0 with the First behind it.

---

### Dismiss the middle sheet

1. Tap "Open Third PageSheet" again, then tap "Dismiss Second FormSheet" on the Third sheet.

    - [ ] Both the Third and the Second sheet dismiss; the First (blue) sheet is visible at 1.0.

---

### Dismiss the bottom sheet

1. Tap "Open Second FormSheet", then "Open Third PageSheet", then tap "Dismiss First PageSheet" on the Third sheet.

    - [ ] All three sheets dismiss and the host screen is undimmed; "Open First PageSheet" is pressable again.

---

### Native dismissal in the stack

1. Rebuild the full stack, then swipe the Third sheet down past its lower detent.

    - [ ] Only the Third sheet dismisses natively. Tap "Open Third PageSheet" again - it presents (the JS state was synced by `onNativeDismiss`).

2. Swipe the Second sheet down past its lower detent (after dismissing the Third).

    - [ ] Only the Second sheet dismisses; the First remains. "Open Second FormSheet" presents it again.
