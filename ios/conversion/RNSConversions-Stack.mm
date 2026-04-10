#import "RNSConversions-Stack.h"

#if RNS_GAMMA_ENABLED

namespace rnscreens::conversion {

namespace react = facebook::react;

template <>
RNSStackScreenActivityMode convert(react::RNSStackScreenActivityMode mode)
{
  return static_cast<RNSStackScreenActivityMode>(mode);
};

template <>
RNSHeaderItemPlacement convert(react::RNSStackHeaderItemIOSPlacement placement)
{
  switch (placement) {
    case react::RNSStackHeaderItemIOSPlacement::Left:
      return RNSHeaderItemPlacementLeft;
    case react::RNSStackHeaderItemIOSPlacement::Right:
      return RNSHeaderItemPlacementRight;
    case react::RNSStackHeaderItemIOSPlacement::Title:
      return RNSHeaderItemPlacementTitle;
    case react::RNSStackHeaderItemIOSPlacement::Subtitle:
      return RNSHeaderItemPlacementSubtitle;
    case react::RNSStackHeaderItemIOSPlacement::LargeSubtitle:
      return RNSHeaderItemPlacementLargeSubtitle;
  }
};

template <>
RNSHeaderItemSpacerPlacement convert(react::RNSStackHeaderItemSpacerIOSPlacement placement)
{
  switch (placement) {
    case react::RNSStackHeaderItemSpacerIOSPlacement::Left:
      return RNSHeaderItemSpacerPlacementLeft;
    case react::RNSStackHeaderItemSpacerIOSPlacement::Right:
    default:
      return RNSHeaderItemSpacerPlacementRight;
  }
};

}; // namespace rnscreens::conversion

#endif // RNS_GAMMA_ENABLED
