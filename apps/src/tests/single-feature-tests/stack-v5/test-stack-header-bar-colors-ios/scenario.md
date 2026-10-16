# Stack header bar colors on iOS

Run `TestStackHeaderBarColorsIOS` directly from `apps/App.tsx` or select
"Stack Header Bar Colors (iOS)" in the Stack v5 scenarios.

1. With both presets at `default`, scroll between the top and the standard
   appearance. Compare with `empty`; both should retain UIKit's defaults.
2. Set standard to `opaque`, scroll to standard, and verify a sky-blue bar with
   a red shadow. Keep scroll edge at `default` and scroll to the top to observe
   UIKit's derived scroll-edge appearance.
3. Set scroll edge to `opaque`. Verify its sky-blue background and red shadow
   at the top. Change standard to `transparent`; scrolling down should reveal
   the rows through the bar and hide the shadow, independently of scroll edge.
4. Try `translucent` on each appearance. Rows should show through the blue tint.
5. Select `dynamic`, then change the simulator's light/dark appearance without
   changing props. The background changes from sky blue to transparent and the
   platform shadow color adapts. UIKit's automatic scroll-edge effects may still
   be visible on recent iOS versions.
6. Change `opaque` to `shadow`. The custom background should reset while the red
   shadow remains. Change to `empty`, then `default`, then press "Reset both".
   No prior color should remain on either appearance.

The explicit scroll-edge appearance is independent of the standard appearance.
An omitted background keeps the default material for standard and the default
transparent background for an explicit scroll-edge appearance. These colors do
not configure UIKit's automatic scroll-edge effects.
