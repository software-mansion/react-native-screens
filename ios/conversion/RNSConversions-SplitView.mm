#import "RNSConversions.h"

namespace rnscreens::conversion {

#pragma mark RN Codegen enum to internal enum conversions

RNSSplitViewSplitBehavior RNSSplitViewSplitBehaviorFromHostProp(
    facebook::react::RNSSplitViewHostSplitBehavior splitBehavior)
{
  using enum facebook::react::RNSSplitViewHostSplitBehavior;
  
  switch (splitBehavior) {
    case Displace:
      return RNSSplitViewSplitBehaviorDisplace;
    case Overlay:
      return RNSSplitViewSplitBehaviorOverlay;
    case Tile:
      return RNSSplitViewSplitBehaviorTile;
    case Automatic:
    default:
      return RNSSplitViewSplitBehaviorAutomatic;
  }
}

RNSSplitViewPrimaryEdge RNSSplitViewPrimaryEdgeFromHostProp(
    facebook::react::RNSSplitViewHostPrimaryEdge primaryEdge)
{
  using enum facebook::react::RNSSplitViewHostPrimaryEdge;
  
  switch (primaryEdge) {
    case Trailing:
      return RNSSplitViewPrimaryEdgeTrailing;
    case Leading:
    default:
      return RNSSplitViewPrimaryEdgeLeading;
  }
}

#pragma mark Internal enum to UISplitViewController enum conversions

UISplitViewControllerSplitBehavior RNSSplitBehaviorToUISplitViewControllerSplitBehavior(
    RNSSplitViewSplitBehavior behavior)
{
  switch (behavior) {
    case RNSSplitViewSplitBehaviorDisplace:
      return UISplitViewControllerSplitBehaviorDisplace;
    case RNSSplitViewSplitBehaviorOverlay:
      return UISplitViewControllerSplitBehaviorOverlay;
    case RNSSplitViewSplitBehaviorTile:
      return UISplitViewControllerSplitBehaviorTile;
    case RNSSplitViewSplitBehaviorAutomatic:
    default:
      return UISplitViewControllerSplitBehaviorAutomatic;
  }
}

UISplitViewControllerPrimaryEdge RNSPrimaryEdgeToUISplitViewControllerPrimaryEdge(
    RNSSplitViewPrimaryEdge primaryEdge)
{
  switch (primaryEdge) {
    case RNSSplitViewPrimaryEdgeTrailing:
      return UISplitViewControllerPrimaryEdgeTrailing;
    case RNSSplitViewPrimaryEdgeLeading:
    default:
      return UISplitViewControllerPrimaryEdgeLeading;
  }
}

}; // namespace rnscreens::conversion
