# Test Scenario: iPad Layout (PageSheet vs FormSheet)

## Details

**Description:** Verify what distinguishes `PageSheet` from `FormSheet`: the layout UIKit picks in a regular-width environment (iPad). The host screen owns one `PageSheet` and one `FormSheet` configured identically (detents `[0.5, 1.0]`, grabber visible). On iPad the page sheet must present as a wide, bottom-anchored card with the host screen dimmed and scaled back behind it, while the form sheet presents as a centered floating panel of a fixed size with the host screen dimmed only. On iPhone (compact width) both sheets must be indistinguishable.

**OS test creation version:** iOS: 26.1, iPadOS: 26.1.

## E2E test

TBD: Planned, but will be implemented separately.

## Prerequisites

- iPad: device or simulator, app in full-screen mode (regular width and regular height size classes). This is the primary target of the scenario.
- iPhone: device or simulator, for the parity check only.

## Note

- Both sheets share one native implementation; the only difference is `UIModalPresentationPageSheet` vs `UIModalPresentationFormSheet`. Every sheet prop (detents, grabber, corner radius, undimmed detent, `fitToContents`, events) applies to both.
- Detent behaviour of a page sheet on iPad may differ between iPadOS versions. Record what you observe in step 3 of the iPad section.

## Steps

### Baseline

1. Launch the app and navigate to the **iPad Layout (PageSheet vs FormSheet)** screen.

    - [ ] The host screen shows the "Open PageSheet" and "Open FormSheet" buttons.

---

### iPad - portrait

1. Tap "Open PageSheet".

    - [ ] A wide card anchored to the bottom edge presents; it spans (almost) the full width of the screen with a top inset below the status bar.
    - [ ] The host screen is dimmed **and** visibly scaled back (shrunk, pushed behind the card).
    - [ ] The grabber is visible at the top of the card. "PageSheet content" and "Dismiss PageSheet" are centered within the card.

2. Drag the card up to the largest detent and back down.

    - [ ] The card resizes between the two detents (or snaps back to the largest one - note the iPadOS version and the observed behaviour).

3. Tap "Dismiss PageSheet", then tap "Open FormSheet".

    - [ ] A centered floating panel of a fixed size presents (not bottom-anchored, not full width).
    - [ ] The host screen is dimmed but **not** scaled back.
    - [ ] "FormSheet content" and "Dismiss FormSheet" are centered within the panel.

4. Tap "Dismiss FormSheet".

    - [ ] The panel dismisses and the host screen is undimmed.

---

### iPad - landscape

1. Rotate the iPad to landscape and repeat the portrait steps.

    - [ ] The page sheet is a centered card roughly as wide as the iPad is in portrait, still anchored to the bottom, with the host screen scaled back behind it.
    - [ ] The form sheet is still a centered floating panel.

---

### iPhone - parity

1. On an iPhone in portrait, tap "Open PageSheet", drag between the detents, swipe it down to dismiss. Then do the same with "Open FormSheet".

    - [ ] Both sheets present as the same full-width bottom sheet with the same detents, grabber, dimming and dismissal behaviour. There is no visible difference between the two.

2. Rotate the iPhone to landscape and open each sheet.

    - [ ] Both present full screen (compact height), identically.
