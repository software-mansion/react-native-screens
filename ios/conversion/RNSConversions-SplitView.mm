#import "RNSConversions.h"

namespace rnscreens::conversion {

#pragma mark RN Codegen enum to internal enum conversions

UISplitViewControllerSplitBehavior SplitViewSplitBehaviorFromHostProp(
    facebook::react::RNSSplitViewHostSplitBehavior splitBehavior)
{
  using enum facebook::react::RNSSplitViewHostSplitBehavior;

  switch (splitBehavior) {
    case Displace:
      return UISplitViewControllerSplitBehaviorDisplace;
    case Overlay:
      return UISplitViewControllerSplitBehaviorOverlay;
    case Tile:
      return UISplitViewControllerSplitBehaviorTile;
    case Automatic:
    default:
      return UISplitViewControllerSplitBehaviorAutomatic;
  }
}

UISplitViewControllerPrimaryEdge SplitViewPrimaryEdgeFromHostProp(
    facebook::react::RNSSplitViewHostPrimaryEdge primaryEdge)
{
  using enum facebook::react::RNSSplitViewHostPrimaryEdge;

  switch (primaryEdge) {
    case Trailing:
      return UISplitViewControllerPrimaryEdgeTrailing;
    case Leading:
    default:
      return UISplitViewControllerPrimaryEdgeLeading;
  }
}

UISplitViewControllerDisplayMode SplitViewDisplayModeFromHostProp(
    facebook::react::RNSSplitViewHostDisplayMode displayMode)
{
  using enum facebook::react::RNSSplitViewHostDisplayMode;

  switch (displayMode) {
    case SecondaryOnly:
      return UISplitViewControllerDisplayModeSecondaryOnly;
    case OneBesideSecondary:
      return UISplitViewControllerDisplayModeOneBesideSecondary;
    case OneOverSecondary:
      return UISplitViewControllerDisplayModeOneOverSecondary;
    case TwoBesideSecondary:
      return UISplitViewControllerDisplayModeTwoBesideSecondary;
    case TwoOverSecondary:
      return UISplitViewControllerDisplayModeTwoOverSecondary;
    case TwoDisplaceSecondary:
      return UISplitViewControllerDisplayModeTwoDisplaceSecondary;
    case Automatic:
    default:
      return UISplitViewControllerDisplayModeAutomatic;
  }
}

}; // namespace rnscreens::conversion
