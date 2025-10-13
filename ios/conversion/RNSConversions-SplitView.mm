#import "RNSConversions.h"

namespace rnscreens::conversion {

#pragma mark SplitViewHost props

UISplitViewControllerSplitBehavior SplitViewPreferredSplitBehaviorFromHostProp(
    facebook::react::RNSSplitViewHostPreferredSplitBehavior splitBehavior)
{
  using enum facebook::react::RNSSplitViewHostPreferredSplitBehavior;

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

UISplitViewControllerDisplayMode SplitViewPreferredDisplayModeFromHostProp(
    facebook::react::RNSSplitViewHostPreferredDisplayMode displayMode)
{
  using enum facebook::react::RNSSplitViewHostPreferredDisplayMode;

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

std::string UISplitViewControllerDisplayModeToString(UISplitViewControllerDisplayMode displayMode)
{
  switch (displayMode) {
    case UISplitViewControllerDisplayModeSecondaryOnly:
      return "secondaryOnly";
    case UISplitViewControllerDisplayModeOneBesideSecondary:
      return "oneBesideSecondary";
    case UISplitViewControllerDisplayModeOneOverSecondary:
      return "oneOverSecondary";
    case UISplitViewControllerDisplayModeTwoBesideSecondary:
      return "twoBesideSecondary";
    case UISplitViewControllerDisplayModeTwoOverSecondary:
      return "twoOverSecondary";
    case UISplitViewControllerDisplayModeTwoDisplaceSecondary:
      return "twoDisplaceSecondary";
    case UISplitViewControllerDisplayModeAutomatic:
    default:
      return "automatic";
  }
}

RNSOrientation RNSOrientationFromRNSSplitViewHostOrientation(react::RNSSplitViewHostOrientation orientation)
{
  using enum facebook::react::RNSSplitViewHostOrientation;

  switch (orientation) {
    case Inherit:
      return RNSOrientationInherit;
    case All:
      return RNSOrientationAll;
    case AllButUpsideDown:
      return RNSOrientationAllButUpsideDown;
    case Portrait:
      return RNSOrientationPortrait;
    case PortraitUp:
      return RNSOrientationPortraitUp;
    case PortraitDown:
      return RNSOrientationPortraitDown;
    case Landscape:
      return RNSOrientationLandscape;
    case LandscapeLeft:
      return RNSOrientationLandscapeLeft;
    case LandscapeRight:
      return RNSOrientationLandscapeRight;
    default:
      RCTLogError(@"[RNScreens] unsupported orientation");
      return RNSOrientationInherit;
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
