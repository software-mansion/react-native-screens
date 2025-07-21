#import "RNSConversions.h"

namespace rnscreens::conversion {

#pragma mark SplitViewHost props

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

UISplitViewControllerDisplayModeButtonVisibility SplitViewDisplayModeButtonVisibilityFromHostProp(
    react::RNSSplitViewHostDisplayModeButtonVisibility displayModeButtonVisibility)
{
  using enum facebook::react::RNSSplitViewHostDisplayModeButtonVisibility;

  switch (displayModeButtonVisibility) {
    case Always:
      return UISplitViewControllerDisplayModeButtonVisibilityAlways;
    case Never:
      return UISplitViewControllerDisplayModeButtonVisibilityNever;
    case Automatic:
    default:
      return UISplitViewControllerDisplayModeButtonVisibilityAutomatic;
  }
}

#pragma mark SplitViewScreen props

RNSSplitViewScreenColumnType RNSSplitViewScreenColumnTypeFromScreenProp(
    facebook::react::RNSSplitViewScreenColumnType columnType)
{
  using enum facebook::react::RNSSplitViewScreenColumnType;

  switch (columnType) {
    case Inspector:
      return RNSSplitViewScreenColumnTypeInspector;
    case Column:
    default:
      return RNSSplitViewScreenColumnTypeColumn;
  }
}

}; // namespace rnscreens::conversion
