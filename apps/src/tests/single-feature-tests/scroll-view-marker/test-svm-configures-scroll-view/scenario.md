# Test Scenario: ScrollViewMarker - basic functionality

## Details

**Description:** Verifies the basic functionality of
`ScrollViewMarker`: it finds the `ScrollView` it wraps and configures
its scroll edge effect, including switching the value at runtime. The
`Text` label rendered before the marker intentionally breaks the
"first descendant chain" fallback heuristic, making the marker the
only way the enclosing Stack screen can resolve its content
ScrollView. That registration is not verified here - the steps cover
only the edge effect configuration.

On Android there are no scroll edge effects - the screen exists there
only as a prepared environment for native-side debugging, so this
manual scenario covers iOS only.

**OS test creation version:** iOS 26.5.

## E2E test

Incomplete: not automated. The core checks of this scenario are
visual (blur, fade, and the dividing line of the scroll edge effects)
and Detox cannot verify any of them.

## Prerequisites

- iOS simulator or device with iOS 26+ (`scrollEdgeEffects` is a
  no-op on older iOS versions).

## Note

- The `Text` label rendered above the marker is intentional.
- Only the top edge effect is configured by this screen; the other
  edges keep their `automatic` default.
- The screen has no `headerConfig`, so the stack shows its default,
  untitled navigation bar. The top edge effect is observed at the top
  edge of the scrolling content, where the coloured rectangles leave
  the screen under the navigation bar area.
- The scroll edge effect only appears while there is content scrolled
  past the edge. With the content resting at the very top, no top
  effect is drawn for any value.

### How each top edge effect should look (iOS 26+)

- **`automatic`** - the system picks the effect for the context; on
  this screen it matches the `soft` look: the scrolled-out content
  dissolves in a smooth, progressive blur/fade near the edge. There
  is **no dividing line** and no sharp boundary - rectangle colours
  melt gradually into the top area.
- **`hard`** - the effect area is **also blurred/washed out** (do not
  expect a clean, opaque band), but instead of fading gradually into
  the content it ends at a sharp, straight cutoff marked by a thin
  **dividing line**. Below the line the rectangles are fully crisp
  right up to the boundary.
- **`soft`** - a soft-edged effect, visually like `automatic` here: a
  gradual blur/fade of the content near the edge, **no dividing
  line**, no sharp boundary.
- **`hidden`** - the effect is disabled entirely: the rectangles stay
  fully crisp and undistorted all the way to the edge - **no blur, no
  fade, no dividing line**, the content simply clips.

The quickest tells apart: `hard` is the only value with a sharp
boundary and dividing line (its blur does not fade out - it is cut
off); `hidden` is the only value with completely crisp content at the
edge; `soft` and `automatic` look alike here (gradual dissolve).

## Steps

1. Launch the app and navigate to **ScrollViewMarker scenarios → Basic
   functionality**.

- [ ] Visible: the heuristic-interrupting label, a vertical list of
      coloured full-width rectangles, and the floating selector pill
      near the bottom with `hard` highlighted.

2. Scroll the list up so rectangles leave the screen at the top, and
   stop mid-list. Observe the top edge (`hard` is selected).

- [ ] The scrolled-out content above the boundary is blurred/washed
      out and ends at a sharp, straight cutoff with a thin dividing
      line; below it the rectangles are fully crisp (see the `hard`
      description in the Note).
- [ ] The effect appears only while content is scrolled past the top;
      after scrolling back to the very top it disappears.

3. Keep the content scrolled mid-list and tap `soft` in the selector.

- [ ] The `soft` chip becomes highlighted.
- [ ] The top edge changes in place to a gradual blur/fade with no
      dividing line (see `soft` in the Note).
- [ ] The list itself does not change: scroll position is kept and
      every rectangle keeps its colour.

4. Scroll up and down a few times with `soft` selected.

- [ ] The soft fade renders consistently in both scroll directions
      and disappears when the content rests at the very top.

5. Tap `hidden`, then scroll up and down past the top edge.

- [ ] The rectangles stay fully crisp up to the edge - no blur, no
      fade, no dividing line, in both directions (see `hidden` in the
      Note).

6. Tap `automatic`, then scroll up and down past the top edge.

- [ ] A soft blur/fade is shown again, visually matching the `soft`
      value (see `automatic` in the Note).

7. Tap `hard` again and scroll up and down past the top edge. Then,
   with the content resting mid-list, cycle through all four values a
   few times in any order.

- [ ] The sharp cutoff with the dividing line is back for `hard`.
- [ ] Cycling never causes a crash, flicker at rest, a
      scroll-position jump, or a colour change of the rectangles.
