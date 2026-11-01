# Test Scenario: Comprehensive

## Details

**Description:** One stack-hosted scenario exercising the core behaviors of
`ContainedModalOverContent` + `ContainedModalProvider`: containment, outside
interactivity, presentation at a non-zero scroll offset, scroll tracking while
open, provider resize, rotation, suspend/restore via stack push/pop,
dismiss-while-suspended, counter state preservation, nested providers, and a
provider hosted inside a native sheet. The
inner provider is a light-blue box inside a scroll view on the root screen of a
two-screen stack; its modal is a dark, bottom-anchored, semi-transparent
overlay. A second, outer provider spans the whole screen content and hosts a
full-screen dark-red modal; each modal targets its own provider by id. Modal visibility state lives above the stack, so the pushed screen
can flip `isOpen` to `false` while the inner modal is suspended.

Out of scope here: the replacing variant (`ContainedModalCurrentContext`) and
modal stacking (only one modal can be open per provider).

**OS test creation version:** iOS: 26.5.

## E2E test

TBD.

## Prerequisites

- iPhone: device or simulator.

## Steps

### Baseline

1. Launch the app and navigate to the **Comprehensive** screen (ContainedModal
   group).

- [ ] The root stack screen shows an "Outside taps: 0" counter, "Outside tap",
      "Grow provider", "Push screen over" and "Open full-screen modal" buttons,
      and a scroll view. The light-blue provider box with a ticking "Provider
      counter" and "Open modal" is visible near the top of the scroll view; a
      tall spacer below it keeps the content scrollable.

---

### Present at scroll offset + containment

2. Scroll down slightly (so the scroll offset is non-zero but the provider box
   stays fully visible), then tap "Open modal".

- [ ] The dark overlay fades in covering exactly the light-blue box — correct
      position despite the non-zero scroll offset; nothing outside the box is
      covered or dimmed.

### Outside interactivity + inside blocking

3. Tap "Outside tap" a few times, then try to tap where "Open modal" was (under
   the overlay).

- [ ] The counter increments on every outside tap; the tap under the overlay
      does nothing.

### Provider resize

4. Tap "Grow provider" (outside the provider), then "Shrink provider".

- [ ] The provider box animates/changes between heights and the overlay tracks
      it exactly both times — modal never sticks out of, nor undershoots, the
      box.

### Rotation

5. Rotate the device to landscape and back to portrait (modal still open).

- [ ] After each rotation the overlay still covers exactly the provider box.

### Suspend / restore via stack

6. With the modal open, note the current counter values and tap "Push screen
   over". On the pushed screen, tap "Pop" (or use the back button).

- [ ] The pushed screen fully covers the stack; after popping, the modal is
      still open, correctly covering the provider box, and both counters kept
      ticking (values advanced, never reset).

### Dismiss while suspended

7. With the modal open, tap "Push screen over". On the pushed screen, verify
   "Suspended modal isOpen: true", then tap "Dismiss suspended modal" (flips
   `isOpen` to `false` while the presentation is suspended off-window). Tap
   "Pop".

- [ ] After popping, the modal is NOT visible and the provider content ("Open
      modal", counter) is fully tappable — no leftover overlay, no touch-dead
      zone.

8. Tap "Open modal" again.

- [ ] The modal presents normally, with no `[RNScreens]` warnings — the
      dismiss-while-suspended cycle must not wedge the presentation state
      machine (a wedged `Dismissing` state would make this re-present silently
      no-op).

### Full-screen provider (nested providers)

9. Dismiss any open modal, then tap "Open full-screen modal" (near the top of
   the screen).

- [ ] A dark-red overlay fades in covering the WHOLE screen content (buttons,
      counter and scroll view all underneath; the native header stays visible).
      All underlying controls are blocked; the full-screen counter ticks.

10. Tap "Dismiss full-screen modal".

- [ ] The overlay fades out and every control is interactive again. The inner
      (light-blue box) modal still opens and closes independently afterwards —
      the explicit ids keep the two modals paired with their own providers.
- [ ] (Optional) With the inner modal open, open the full-screen modal too: both
      can be open simultaneously (different providers — the one-modal limit is
      per provider), the full-screen overlay stacks ABOVE the inner one, and
      dismissing the outer leaves the inner intact.

### Dismiss + re-present stability

11. Tap "Dismiss from JS", then "Open modal" again.

- [ ] The overlay fades out, provider content is tappable again; re-presenting
      works identically (no leftover touch-dead zones, no misplaced overlay),
      counters continuous throughout.

### Scroll tracking while open — run LAST

12. With the modal open, scroll slightly up and down.

- [ ] The overlay moves in lockstep with the provider box — no detached or
      lagging overlay.

13. Tap "Dismiss from JS" at its new position.

- [ ] The modal dismisses — touch delivery rides the main surface's touch
      handler and live native hit-testing, so plain taps follow the scrolled
      position immediately. Known limitation: Pressability's press-rect used for
      press-and-MOVE hysteresis re-syncs only on layout passes, so a press
      started right after a scroll may cancel on movement until the next layout
      pass — plain taps are unaffected.

### Press & move (touch coordinate space)

14. Open the modal and slowly press-and-hold "Press & move", wiggling the finger
    slightly (a few points, less than the scroll-pan threshold) before
    releasing.

- [ ] The button shows its pressed-in color while the finger moves and `onPress`
      fires on release — the pressed state must survive the movement. (Large
      drags cancel the press via the surrounding ScrollView's pan gesture —
      standard React Native behavior, same as any Pressable inside a
      ScrollView.)
- [ ] In React DevTools / the RN component tree, the modal's children report
      their real on-screen positions (inside the provider box), not
      content-local coordinates around the origin.

### Provider inside a native sheet (touch coordinate space)

15. Dismiss any open modal. Tap "Open sheet", then in the sheet tap "Open sheet
    modal". Slowly press-and-hold "Press & move (sheet)", wiggling the finger
    slightly before releasing.

- [ ] The modal covers exactly the light-blue box inside the sheet, and the
      sheet content outside the box stays interactive.
- [ ] The button shows its pressed-in color while the finger moves and the
      counter next to it increments on release — the sheet delivers touches
      through its own touch handler, and the modal's press rects must be
      expressed in that space (a window-space offset cancels the press on the
      first move).
- [ ] In React DevTools / the RN component tree, the sheet modal's children
      report positions consistent with their on-screen place inside the sheet.

16. Tap "Dismiss sheet modal", pull the sheet down, then tap "Open modal".

- [ ] The sheet modal dismisses, the sheet closes, and the main-screen modal
      still presents and dismisses normally afterwards.
