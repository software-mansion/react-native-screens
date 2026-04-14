#import "RNSConversions-SplitHeader.h"

#if RNS_GAMMA_ENABLED

namespace rnscreens::conversion {

namespace react = facebook::react;

template <>
RNSSplitHeaderItemPlacement convert(react::RNSSplitHeaderItemIOSPlacement placement)
{
  switch (placement) {
    case react::RNSSplitHeaderItemIOSPlacement::Left:
      return RNSSplitHeaderItemPlacementLeft;
    case react::RNSSplitHeaderItemIOSPlacement::Right:
      return RNSSplitHeaderItemPlacementRight;
    case react::RNSSplitHeaderItemIOSPlacement::Title:
      return RNSSplitHeaderItemPlacementTitle;
    case react::RNSSplitHeaderItemIOSPlacement::Subtitle:
      return RNSSplitHeaderItemPlacementSubtitle;
    case react::RNSSplitHeaderItemIOSPlacement::LargeSubtitle:
      return RNSSplitHeaderItemPlacementLargeSubtitle;
  }
};

template <>
RNSSplitHeaderItemSpacerPlacement convert(react::RNSSplitHeaderItemSpacerIOSPlacement placement)
{
  switch (placement) {
    case react::RNSSplitHeaderItemSpacerIOSPlacement::Left:
      return RNSSplitHeaderItemSpacerPlacementLeft;
    case react::RNSSplitHeaderItemSpacerIOSPlacement::Right:
    default:
      return RNSSplitHeaderItemSpacerPlacementRight;
  }
};

}; // namespace rnscreens::conversion

#endif // RNS_GAMMA_ENABLED
