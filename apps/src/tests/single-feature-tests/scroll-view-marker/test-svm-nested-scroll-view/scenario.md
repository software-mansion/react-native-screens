# Test Scenario: ScrollViewMarker - nested ScrollView

## Details

**Description:** Verifies that `ScrollViewMarker` resolves its
`ScrollView` when the child renders it below its own container views
instead of returning it directly. The marker's child here is a plain
wrapper component whose `ScrollView` sits two `View`s deep - the shape
produced by list and keyboard-aware components that wrap their
`ScrollView` in decorator views, for example
`react-native-keyboard-controller`'s `KeyboardChatScrollView`, which
renders its `ScrollView` inside a `ClippingScrollViewDecoratorView`.

Before the fix this configuration resolved no `ScrollView` at all: the
marker only accepted its direct child, so it failed the
`[RNScreens] Failed to find ScrollView` assertion in debug and
silently applied no effect in release.

On Android there are no scroll edge effects - the screen exists there
only as a prepared environment for native-side debugging, so this
manual scenario covers iOS only.

**OS test creation version:** iOS 26.0.

## E2E test

Incomplete: not automated. The core checks of this scenario are
visual (blur, fade, and the dividing line of the scroll edge effects)
and Detox cannot verify any of them.

## Prerequisites

- iOS simulator or device with iOS 26+ (`scrollEdgeEffects` is a
  no-op on older iOS versions).

## Note

- This scenario is deliberately identical to **Basic functionality**
  except for the wrapper around the `ScrollView`. Both should look
  and behave the same; any difference between them is the bug.
- The `Text` label rendered above the marker is intentional: it
  breaks the "first descendant chain" fallback heuristic, so the
  marker is the only way the effect can be applied.
- Only the top edge effect is configured by this screen; the other
  edges keep their `automatic` default.
- The scroll edge effect only appears while there is content scrolled
  past the edge. With the content resting at the very top, no top
  effect is drawn for any value.

### How each top edge effect should look (iOS 26+)

- **`automatic`** - matches the `soft` look here: a smooth,
  progressive blur/fade near the edge, **no dividing line**.
- **`hard`** - also blurred/washed out, but ending at a sharp,
  straight cutoff marked by a thin **dividing line**.
- **`soft`** - a gradual blur/fade, **no dividing line**.
- **`hidden`** - no effect at all: the rectangles stay fully crisp to
  the edge, the content simply clips.

## Steps

1. Launch the app in a **debug** build and navigate to
   **ScrollViewMarker scenarios → Nested ScrollView**.

- [ ] The screen opens without an assertion failure or red box.
      (Before the fix, `[RNScreens] Failed to find ScrollView` fired
      here.)
- [ ] Visible: the label, a vertical list of coloured full-width
      rectangles, and the floating selector pill near the bottom with
      `hard` highlighted.

2. Scroll the list up so rectangles leave the screen at the top, and
   stop mid-list. Observe the top edge (`hard` is selected).

- [ ] The scrolled-out content above the boundary is blurred/washed
      out and ends at a sharp, straight cutoff with a thin dividing
      line; below it the rectangles are fully crisp.
- [ ] The effect appears only while content is scrolled past the top;
      after scrolling back to the very top it disappears.

3. Keep the content scrolled mid-list and tap `soft` in the selector.

- [ ] The `soft` chip becomes highlighted.
- [ ] The top edge changes in place to a gradual blur/fade with no
      dividing line.
- [ ] The list itself does not change: scroll position is kept and
      every rectangle keeps its colour.

4. Tap `hidden`, then scroll up and down past the top edge.

- [ ] The rectangles stay fully crisp up to the edge - no blur, no
      fade, no dividing line, in both directions.

5. Tap `automatic`, then scroll up and down past the top edge.

- [ ] A soft blur/fade is shown again, visually matching the `soft`
      value.

6. Open **ScrollViewMarker scenarios → Basic functionality** and
   repeat steps 2-5 there, comparing against what you just saw.

- [ ] Every value renders identically in both scenarios. The nesting
      of the `ScrollView` makes no visible difference.
