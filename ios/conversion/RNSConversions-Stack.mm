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
};

template <>
RNSHeaderItemSpacerPlacement convert(react::RNSStackHeaderItemSpacerIOSPlacement placement)
{
  switch (placement) {
    case react::RNSStackHeaderItemSpacerIOSPlacement::Leading:
      return RNSHeaderItemSpacerPlacementLeading;
    case react::RNSStackHeaderItemSpacerIOSPlacement::Trailing:
      return RNSHeaderItemSpacerPlacementTrailing;
  }
};

}; // namespace rnscreens::conversion

#endif // RNS_GAMMA_ENABLED
