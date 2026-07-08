# Test Scenario: Header Subviews (iOS)

## Details

**Description:** This test focuses on handling custom subviews in the header on iOS.
The test focuses on correct ShadowNode updates, i.e. React views located in the exact same place as native views,
with correct handling of pressables: in / out / press. The implementation should correctly handle items being added,
removed and resized.

**OS test creation version:** iOS 26.4, iPadOS 26.4

## E2E test

TBD

## Prerequisites

- iOS / iPadOS emulator

## Note (Optional)

- "Position of items on device matches element tree" means that the DevTools overlay the item highlight with correct position and size. Alternatively, this could be checked by pressing and moving the cursor over the button to see if the whole visible area works, not triggering onPressOut immediately
- on iOS 26, view may move to overflow menu if there is no space for them, iOS 18 tries to render all of them (including the header)
- spacers on iOS 26 work only to split the glass "bubble" around the item, setting width only works on iOS < 26
- the difference between `flexible` and `fixed` spacer sizing is only visible on iOS 26 **below 26.0**
- `subtitle`, `largeSubtitle` is only supported on iOS 26
- custom view buttons don't move to overflow menu (native behavior); one needs to specify `menuRepresentation` for them (not implemented yet)
- on iOS 26, with 3 leading + 3 trailing items, expanding the items pushes ~2 trailing items into an overflow "⋯" button that is currently **not usable** (custom views have no working overflow representation yet — see the `menuRepresentation` note above). This is expected, not a regression.
- items are collapsed in the order: title, trailing buttons (one by one), leading buttons (all at once); this is in line with native behavior
- on iOS 26, the title (both regular and custom) moves from center to the leading edge if trailing buttons would otherwise touch it
- the regular title seems to take up space even if large title is enabled on iOS 18 (if set to custom view, it is still rendered)
- the test adds an option for changing the hit slop, but this remains to be handled in the future on the native side (TODO)
- for now, large subtitle view on iOS 26 doesn't respond to clicks (TODO)

## How to verify a layout match

Almost every check below comes down to one question: **does each header item sit exactly where the element tree says it should, and does its whole visible area respond to touch?** The items are blank pressable boxes (no label), so use these two checks to locate and validate them. For every "layout matches" checkbox, confirm both:

1. **Position & size overlay match.** Open the React DevTools element inspector and hover/select each header item. The highlight rectangle must cover the item on the device with the **same origin and the same width/height** — no offset, no scaling, and no lag remaining after an item is added/removed/resized.
2. **Touch area matches the visible item.** Press and hold an item and slide your finger/cursor around inside it: the pressed‑in feedback must stay active across the **entire** visible box and only release (`onPressOut`) when you actually leave its bounds. A press that releases early, or feedback offset from the box, means the touch area is misaligned with what is drawn.

## Steps on iPhone

1. Open the Dev Console.
2. Reload the application (the dev console triggers extra layout callbacks; a reload gives a clean first layout that won't mask a regression).
3. Verify the first layout (default config: 2 leading + 2 trailing items, short text title and subtitle).

- [ ] The header shows the text title **"Title"**, **two** blank leading item boxes and **two** blank trailing item boxes.
- [ ] A visible **fixed gap** separates the two leading items (fixed spacer); the two trailing items are pushed apart by a **flexible** spacer.
- [ ] Every item's overlay and touch area match its box (see *How to verify a layout match*).

1. Tap **"Toggle leading items count"** and **"Toggle trailing items count"** to add a third item on each side. Verify layout.

- [ ] A third box appears on each edge; all items (old + new) still overlay‑match, none overlaps the title, and none is clipped at the screen edge.

5. Set **title** to `view`. Verify layout.

- [ ] The text title is replaced by a blank **custom title box (≈100×20)**, horizontally centered and not overlapping the leading/trailing items; its overlay and touch area match. (On iOS 18 the regular title may still take space alongside it — see Notes.)

6. Set **subtitle** to `view`. Verify layout.

- [ ] **iOS 26 only:** a smaller **custom subtitle box (≈80×10)** appears directly **below** the title, centered and overlay‑matching. On iOS 18 no subtitle view is expected (subtitle is unsupported).

7. Tap the **header items** to resize them (each tap toggles a box between ~20 pt and ~60 pt wide) and force neighbours to move. Verify layout.

- [ ] The tapped item grows/shrinks and its neighbours reflow to make room; after the reflow every item's overlay and touch area still match its **new** box, with no highlight left behind at the old size or position.

8. Rotate the screen to **landscape**. Verify layout.

- [ ] The header re‑lays out for the wider width; all items stay in their correct slots (leading left, trailing right, title centered or shifted per Notes), overlays match, and nothing is clipped or stuck at its portrait position.

9. Rotate the screen back to **portrait**. Verify layout.

- [ ] The layout returns to the portrait arrangement with matching overlays; no item keeps a landscape size or position.

10. Tap **"Toggle leading items count"** until it reads `0/3` (all leading items removed). Verify layout.

- [ ] All leading item boxes disappear; the remaining trailing items and title stay correctly placed and overlay‑matched, with no empty gap or stray spacer left where the leading items were.

11. Enable **"large header enabled"** (scroll the content up/down to reveal the large title).

- [ ] While the large title is shown, the **inline (regular) title is removed**, and all item overlays still match. (You may need to lower the item count to leave room for the regular title — see Notes.)

12. Set **title** to `long` and **large title** to `short`, then scroll to reveal the large title.

- [ ] **iOS 18:** the large title shows the **long** string ("A quick brown fox jumped over the lazy dog").
- [ ] **iOS 26:** the large title shows the **short** string ("Title").

13. Set **large title** to `none`.

- [ ] **iOS 26:** the large title falls back to the regular title and shows the **long** string set in step 12.

## Steps on iPad

1. Open the Dev Console.
2. Reload the application (the dev console triggers extra layout callbacks; a reload gives a clean first layout that won't mask a regression).
3. Verify the first layout (default config: 2 leading + 2 trailing items, short text title).

- [ ] As on iPhone step 3: title **"Title"**, two leading + two trailing boxes, a fixed gap between the leading items and flexible spacing between the trailing items — all overlay‑matched. (iPad header metrics differ, but the tree must still match the device.)

4. Set **title** to `view`. Verify layout.

- [ ] The custom title box is centered in the iPad header, overlay‑matched, and does not overlap the leading/trailing items.

5. **Resize the application window** (Split View / Stage Manager — drag to a narrower, then wider width). Verify layout.

- [ ] At each new width the header re‑lays out immediately; items keep their slots, overlays and touch areas match, nothing is clipped or overlapping, and the custom title/items recenter/reflow to the new width.
