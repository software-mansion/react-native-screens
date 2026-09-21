#import "RNSConversions-Stack.h"

namespace rnscreens::conversion {

namespace react = facebook::react;

RNSStackScreenActivityMode RNSStackScreenActivityModeFromReactRNSStackScreenActivityMode(
    react::RNSStackScreenActivityMode mode)
{
  return static_cast<RNSStackScreenActivityMode>(mode);
}

RNSHeaderItemPlacement RNSHeaderItemPlacementFromReactRNSStackHeaderItemIOSPlacement(
    react::RNSStackHeaderItemIOSPlacement placement)
{
  switch (placement) {
    case react::RNSStackHeaderItemIOSPlacement::Leading:
      return RNSHeaderItemPlacementLeading;
    case react::RNSStackHeaderItemIOSPlacement::Trailing:
      return RNSHeaderItemPlacementTrailing;
    case react::RNSStackHeaderItemIOSPlacement::Title:
      return RNSHeaderItemPlacementTitle;
    case react::RNSStackHeaderItemIOSPlacement::Subtitle:
      return RNSHeaderItemPlacementSubtitle;
    case react::RNSStackHeaderItemIOSPlacement::LargeSubtitle:
      return RNSHeaderItemPlacementLargeSubtitle;
  }
}

RNSHeaderItemSpacerPlacement RNSHeaderItemSpacerPlacementFromReactRNSStackHeaderItemSpacerIOSPlacement(
    react::RNSStackHeaderItemSpacerIOSPlacement placement)
{
  switch (placement) {
    case react::RNSStackHeaderItemSpacerIOSPlacement::Leading:
      return RNSHeaderItemSpacerPlacementLeading;
    case react::RNSStackHeaderItemSpacerIOSPlacement::Trailing:
      return RNSHeaderItemSpacerPlacementTrailing;
  }
}

UINavigationItemBackButtonDisplayMode
UINavigationItemBackButtonDisplayModeFromReactRNSStackHeaderConfigIOSBackButtonDisplayMode(
    react::RNSStackHeaderConfigIOSBackButtonDisplayMode displayMode)
{
  switch (displayMode) {
    case react::RNSStackHeaderConfigIOSBackButtonDisplayMode::Default:
      return UINavigationItemBackButtonDisplayModeDefault;
    case react::RNSStackHeaderConfigIOSBackButtonDisplayMode::Generic:
      return UINavigationItemBackButtonDisplayModeGeneric;
    case react::RNSStackHeaderConfigIOSBackButtonDisplayMode::Minimal:
      return UINavigationItemBackButtonDisplayModeMinimal;
  }
}

#if RNS_IPHONE_OS_VERSION_AVAILABLE(27_0)

UIBarMinimizationBehavior UIBarMinimizationBehaviorFromReactRNSStackHeaderConfigIOSMinimizationBehavior(
    react::RNSStackHeaderConfigIOSMinimizationBehavior minimizationBehavior)
{
  switch (minimizationBehavior) {
    case react::RNSStackHeaderConfigIOSMinimizationBehavior::Automatic:
      return UIBarMinimizationBehaviorAutomatic;
    case react::RNSStackHeaderConfigIOSMinimizationBehavior::Never:
      return UIBarMinimizationBehaviorNever;
    case react::RNSStackHeaderConfigIOSMinimizationBehavior::OnScrollDown:
      return UIBarMinimizationBehaviorOnScrollDown;
    case react::RNSStackHeaderConfigIOSMinimizationBehavior::OnScrollUp:
      return UIBarMinimizationBehaviorOnScrollUp;
  }
}

UIBarMinimizationRestorationBehavior
UIBarMinimizationRestorationBehaviorFromReactRNSStackHeaderConfigIOSRestorationBehavior(
    react::RNSStackHeaderConfigIOSRestorationBehavior restorationBehavior)
{
  switch (restorationBehavior) {
    case react::RNSStackHeaderConfigIOSRestorationBehavior::Automatic:
      return UIBarMinimizationRestorationBehaviorAutomatic;
    case react::RNSStackHeaderConfigIOSRestorationBehavior::AtScrollEdge:
      return UIBarMinimizationRestorationBehaviorAtScrollEdge;
  }
}

#endif // Check for iOS >= 27

}; // namespace rnscreens::conversion
