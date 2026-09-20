# Stack header axis behavior

Run this scenario in FabricExample, built with the iOS 27.1 SDK, on iOS 27.1.
Use a simulator configuration where UIKit displays vertical bars and repeat in
a configuration with a horizontal navigation bar. UIKit decides bar placement;
the option only changes which axes an item supports and prefers.

1. Initially the native sun item uses `horizontalOnly` and the green custom A
   uses `verticalPreferred`. In a layout with both axes, the sun stays horizontal
   and A moves into the vertical bar.
2. Set each item to `automatic`. UIKit infers placement from its contents.
   The custom view normally remains horizontal; a symbol can go vertical.
3. Try both explicit preferences on both items. In a horizontal-only layout,
   `verticalPreferred` still permits horizontal placement. When only a vertical
   bar exists, UIKit may hide `horizontalOnly` items.
4. Tap "Remove axis options" after setting explicit preferences. This must
   produce the same placement as `automatic`, without leaving the old preference.
5. Toggle items off and on. Preferences must survive remounting. Tap the sun and
   custom item and check that the press count increases.
6. Toggle the separator, repeat preference changes, and check each item still
   follows its own preference. Existing shared-background behavior is retained.
7. Push to screen two and pop. The same identifiers match the sun/moon and A/B
   items across screens. Check settled placement and transitions on both axes.
8. Repeat on iOS below 27.1. All preference values are ignored and the items
   retain UIKit's default behavior. Android and tvOS ignore the iOS option.

This scenario does not request pinned groups or change bar visibility.
