#import "RNSConversions-Stack.h"
#import "RNSDefines.h"

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

UIBarButtonItemStyle UIBarButtonItemStyleFromReactRNSStackHeaderItemIOSVariant(
    react::RNSStackHeaderItemIOSVariant variant)
{
  switch (variant) {
    case react::RNSStackHeaderItemIOSVariant::Plain:
      return UIBarButtonItemStylePlain;
    case react::RNSStackHeaderItemIOSVariant::Prominent:
#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
      if (@available(iOS 26.0, *)) {
        return UIBarButtonItemStyleProminent;
      }
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
      // Bold text look, closest counterpart of prominent style before iOS 26
      return UIBarButtonItemStyleDone;
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

}; // namespace rnscreens::conversion
