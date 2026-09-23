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

RNSHeaderItemVisibilityPriority RNSHeaderItemVisibilityPriorityFromReactRNSStackHeaderItemIOSVisibilityPriority(
    react::RNSStackHeaderItemIOSVisibilityPriority visibilityPriority)
{
  switch (visibilityPriority) {
    case react::RNSStackHeaderItemIOSVisibilityPriority::Low:
      return RNSHeaderItemVisibilityPriorityLow;
    case react::RNSStackHeaderItemIOSVisibilityPriority::Standard:
      return RNSHeaderItemVisibilityPriorityStandard;
    case react::RNSStackHeaderItemIOSVisibilityPriority::High:
      return RNSHeaderItemVisibilityPriorityHigh;
  }
}

#if RNS_BAR_BUTTON_ITEM_VISIBILITY_PRIORITY_AVAILABLE
API_AVAILABLE(ios(27.0))
UIBarButtonItemVisibilityPriority UIBarButtonItemVisibilityPriorityFromRNSHeaderItemVisibilityPriority(
    RNSHeaderItemVisibilityPriority visibilityPriority)
{
  switch (visibilityPriority) {
    case RNSHeaderItemVisibilityPriorityLow:
      return UIBarButtonItemVisibilityPriorityLow;
    case RNSHeaderItemVisibilityPriorityStandard:
      return UIBarButtonItemVisibilityPriorityStandard;
    case RNSHeaderItemVisibilityPriorityHigh:
      return UIBarButtonItemVisibilityPriorityHigh;
  }
}
#endif // RNS_BAR_BUTTON_ITEM_VISIBILITY_PRIORITY_AVAILABLE

}; // namespace rnscreens::conversion
