#import "RNSConversions.h"

namespace rnscreens::conversion {

#pragma mark SplitHost props

UISplitViewControllerSplitBehavior SplitViewPreferredSplitBehaviorFromHostProp(
    facebook::react::RNSSplitHostPreferredSplitBehavior splitBehavior)
{
  using enum facebook::react::RNSSplitHostPreferredSplitBehavior;

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
    facebook::react::RNSSplitHostPrimaryEdge primaryEdge)
{
  using enum facebook::react::RNSSplitHostPrimaryEdge;

  switch (primaryEdge) {
    case Trailing:
      return UISplitViewControllerPrimaryEdgeTrailing;
    case Leading:
    default:
      return UISplitViewControllerPrimaryEdgeLeading;
  }
}

UISplitViewControllerDisplayMode SplitViewPreferredDisplayModeFromHostProp(
    facebook::react::RNSSplitHostPreferredDisplayMode displayMode)
{
  using enum facebook::react::RNSSplitHostPreferredDisplayMode;

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

#if !TARGET_OS_TV
UISplitViewControllerBackgroundStyle SplitViewPrimaryBackgroundStyleFromHostProp(
    facebook::react::RNSSplitHostPrimaryBackgroundStyle primaryBackgroundStyle)
{
  using enum facebook::react::RNSSplitHostPrimaryBackgroundStyle;

  switch (primaryBackgroundStyle) {
    case None:
      return UISplitViewControllerBackgroundStyleNone;
    case Sidebar:
      return UISplitViewControllerBackgroundStyleSidebar;
    case Default:
    default:
      UISplitViewController *tempSplitVC = [[UISplitViewController alloc] init];
      return tempSplitVC.primaryBackgroundStyle;
  }
}
#endif // !TARGET_OS_TV

UISplitViewControllerDisplayModeButtonVisibility SplitViewDisplayModeButtonVisibilityFromHostProp(
    react::RNSSplitHostDisplayModeButtonVisibility displayModeButtonVisibility)
{
  using enum facebook::react::RNSSplitHostDisplayModeButtonVisibility;

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

RNSOrientation RNSOrientationFromRNSSplitHostOrientation(react::RNSSplitHostOrientation orientation)
{
  using enum facebook::react::RNSSplitHostOrientation;

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

std::optional<UISplitViewControllerColumn> SplitViewTopColumnForCollapsingFromHostProp(
    facebook::react::RNSSplitHostTopColumnForCollapsing topColumnForCollapsing)
{
  using enum facebook::react::RNSSplitHostTopColumnForCollapsing;

  switch (topColumnForCollapsing) {
    case Primary:
      return UISplitViewControllerColumnPrimary;
    case Supplementary:
      return UISplitViewControllerColumnSupplementary;
    case Secondary:
      return UISplitViewControllerColumnSecondary;
    case Default:
    default:
      return std::nullopt;
  }
}

#pragma mark SplitScreen props

RNSSplitScreenColumnType RNSSplitScreenColumnTypeFromScreenProp(
    facebook::react::RNSSplitScreenColumnType columnType)
{
  using enum facebook::react::RNSSplitScreenColumnType;

  switch (columnType) {
    case Inspector:
      return RNSSplitScreenColumnTypeInspector;
    case Column:
    default:
      return RNSSplitScreenColumnTypeColumn;
  }
}

}; // namespace rnscreens::conversion
