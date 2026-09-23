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

#if RNS_BAR_BUTTON_ITEM_VISIBILITY_PRIORITY_AVAILABLE
UIBarButtonItemVisibilityPriority UIBarButtonItemVisibilityPriorityFromReactRNSStackHeaderItemIOSVisibilityPriority(
    react::RNSStackHeaderItemIOSVisibilityPriority visibilityPriority)
{
  switch (visibilityPriority) {
    case react::RNSStackHeaderItemIOSVisibilityPriority::Low:
      return UIBarButtonItemVisibilityPriorityLow;
    case react::RNSStackHeaderItemIOSVisibilityPriority::High:
      return UIBarButtonItemVisibilityPriorityHigh;
    case react::RNSStackHeaderItemIOSVisibilityPriority::Standard:
      return UIBarButtonItemVisibilityPriorityStandard;
  }
}
#endif // RNS_BAR_BUTTON_ITEM_VISIBILITY_PRIORITY_AVAILABLE

}; // namespace rnscreens::conversion
