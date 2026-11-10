# Test Scenario: Preferred Content Size (iOS)

## Details

**Description:** Verify the `preferredContentSize` and
`widthFollowsPreferredContentSizeWhenEdgeAttached` props of `FormSheet`. On
iPad, a custom size of `400 x 300` resizes the centered panel, also while it
is open. On iPhone in landscape, where the sheet stays attached to the bottom
edge (`prefersEdgeAttachedInCompactHeight` is on), the sheet takes the
preferred width only when "Width follows" is on.

**OS test creation version:** iOS: 26.1, iPadOS: 26.1.

## E2E test

TBD: Planned, but will be implemented separately.

## Prerequisites

- iPad: device or simulator, app in full-screen mode.
- iPhone: device or simulator, with rotation not locked.

## Note

- Wait for every animation to finish before the next tap.
- "Sheet size" shows the width and height of the sheet's content in points.

## Steps

### Baseline

1. Launch the app on iPad and navigate to the **Preferred Content Size
   (iOS)** screen.

   - [ ] The screen shows "Custom size: OFF", "Width follows: OFF", two
         switches (off) and "Open FormSheet".

---

### iPad panel size

1. Tap "Open FormSheet".

   - [ ] A centered floating panel presents; "Sheet size" is not about
         `400 x 300`.

2. Tap "Dismiss", toggle the "Custom size" switch on, then tap "Open
   FormSheet".

   - [ ] A smaller centered floating panel presents.
   - [ ] "Sheet size" is `400` wide and about `300` tall.

3. Toggle the "Custom size" switch in the sheet off, then on again.

   - [ ] The open panel animates to its size from step 1, then back to `400`
         wide and about `300` tall; "Sheet size" follows each change.

---

### iPhone landscape width

1. On iPhone, navigate to the **Preferred Content Size (iOS)** screen, toggle
   the "Custom size" switch on, rotate to landscape, then tap "Open FormSheet".

   - [ ] The sheet is attached to the bottom edge and spans the width of the
         screen between the notch areas.
   - [ ] The width in "Sheet size" is larger than `400`.

2. Tap "Dismiss", toggle the "Width follows" switch on, then tap "Open
   FormSheet".

   - [ ] The sheet is still attached to the bottom edge and is narrower than
         in step 1.
   - [ ] The width in "Sheet size" reads `400`.

3. Toggle the "Width follows" switch in the sheet off, then on again.

   - [ ] The open sheet widens to its width from step 1, then narrows back to
         about `400`; "Sheet size" follows each change.
