# Test Scenario: Replacing Content

## Details

**Description:** The behaviors specific to `ContainedModalReplacingContent`:
while the modal is open the provider's children are removed from the screen
(not just covered) and come back intact afterwards, the provider's content is
restored at the right place and size even when the provider was resized or
the device rotated while the modal was open, repeated open/close cycles stay
stable, and touches inside the modal are delivered correctly. The provider is
a light-blue box inside a scroll view; its modal is a dark, translucent,
bottom-anchored overlay, so the light-blue background showing through (and
nothing else) is the visual proof that the children are gone. Shared
behaviors (outside interactivity, scroll offset, suspend/restore, nested
providers, sheet hosting) are covered by the Comprehensive scenario, which can
be switched to this variant.

**OS test creation version:** iOS: 27.0.

## E2E test

TBD.

## Prerequisites

- iPhone: device or simulator.

## Steps

### Baseline

1. Launch the app and navigate to the **Replacing Content** screen
   (ContainedModal group).

- [ ] The screen shows an "Outside taps: 0" counter, "Outside tap",
      "Grow provider" and "Run 3 open/close cycles" buttons, and a scroll
      view with the light-blue provider box near the top. The box shows a
      ticking "Provider counter", a "Provider presses: 0" pressable and an
      "Open modal" button.

### Content replaced, state kept

2. Tap "Provider presses" twice, then tap "Open modal".

- [ ] The dark overlay fades in covering exactly the light-blue box. Inside
      the box, the counter, the pressable and "Open modal" are GONE: only the
      light-blue background shows through the translucent overlay, with the
      modal's own counter, hint, "Press & move: 0" and "Dismiss" on top. The
      modal counter ticks.

3. Tap "Outside tap" a few times, then tap where "Open modal" was.

- [ ] The outside counter increments on every tap; the tap inside the box
      does nothing (the modal owns the box, there is no content underneath).

4. Tap "Dismiss".

- [ ] The overlay fades out and the box content is back exactly as it was:
      counter continuous (never reset), "Provider presses: 2", all three
      controls at their previous places. Tapping "Provider presses" works
      and shows 3.

### Press & move inside the modal

5. Open the modal. Slowly press-and-hold "Press & move", wiggling the finger
   slightly (a few points, below the scroll-pan threshold) before releasing.

- [ ] The pressable shows its pressed-in color while the finger moves and the
      counter next to it increments on release.
- [ ] In React DevTools / the RN component tree, the modal's children report
      their real on-screen positions (inside the provider box), not
      content-local coordinates around the origin.

### Resize while open

6. With the modal open, tap "Grow provider".

- [ ] The box and the overlay grow together; the overlay keeps covering exactly
      the box.

7. Tap "Dismiss" (still grown).

- [ ] The restored content fills the GROWN box: the counter and pressable sit
      at the top of the box, nothing is clipped, offset or sized to the old
      height; the box content is tappable across its whole area.

8. Open the modal, tap "Shrink provider", then "Dismiss".

- [ ] Same as above for the shrunk box.

### Rotation while open

9. Open the modal, rotate the device to landscape, tap "Dismiss", then rotate
   back to portrait.

- [ ] In landscape the overlay covers exactly the box. After dismissing, the
      restored content fits the landscape box; after rotating back it fits the
      portrait box. No stale frame from the other orientation.

### Repeated cycles

10. Tap "Run 3 open/close cycles" and wait until the button reads
    "Run 3 open/close cycles" again (about 6 seconds).

- [ ] The modal opens and closes three times. After the last close the box
      content is intact and at its place, counter continuous, and "Open modal"
      presents normally once more. No `[RNScreens]` warnings in the logs.

### Scroll tracking while open

11. Open the modal and scroll the list slightly up and down.

- [ ] The overlay moves in lockstep with the box.

12. Tap "Dismiss" at its new position.

- [ ] The modal dismisses and the restored content follows the scrolled box.
