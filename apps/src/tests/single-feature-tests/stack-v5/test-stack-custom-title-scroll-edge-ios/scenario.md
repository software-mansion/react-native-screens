# Stack custom title scroll edge (iOS)

Run on iOS 26 or newer. The scroll view is registered through
`ScrollViewMarker`. Edge effects and navigation bar appearance use their defaults.

1. Open **Stack Custom Title Scroll Edge (iOS)** in the Stack v5 scenarios.
2. Inspect the custom React title at rest, then press **Scroll down**. Content
   passing beneath the title should fade, keeping the title legible.
3. Press **Native title** at the same scroll position. Its automatic protection
   should match the custom title's. Scroll back to the top and compare both again.
4. Select **Custom title**, then **Resize title** while scrolled. The title's
   bounds and protection should update. Press it again to shrink the title and
   unmount the additional React child.
5. Repeat native/custom and size changes. Check that title children remain
   visible, with no mount/unmount errors or stale protection.
6. With VoiceOver, check that the React title is announced as a heading and the
   additional child remains accessible. There should be no extra empty element.

On older iOS, verify that native/custom titles and resizing still work without
changing navigation bar appearance.
