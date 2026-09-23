#pragma once

#if defined(__cplusplus)

#import <react/renderer/components/rnscreens/Props.h>
#import "RNSDefines.h"
#import "RNSHeaderItemPlacement.h"
#import "RNSHeaderItemSpacerPlacement.h"
#import "RNSStackScreenComponentView.h"

namespace rnscreens::conversion {

namespace react = facebook::react;

RNSStackScreenActivityMode
RNSStackScreenActivityModeFromReactRNSStackScreenActivityMode(
    react::RNSStackScreenActivityMode mode);

RNSHeaderItemPlacement
RNSHeaderItemPlacementFromReactRNSStackHeaderItemIOSPlacement(
    react::RNSStackHeaderItemIOSPlacement placement);

RNSHeaderItemSpacerPlacement
RNSHeaderItemSpacerPlacementFromReactRNSStackHeaderItemSpacerIOSPlacement(
    react::RNSStackHeaderItemSpacerIOSPlacement placement);

UINavigationItemBackButtonDisplayMode
UINavigationItemBackButtonDisplayModeFromReactRNSStackHeaderConfigIOSBackButtonDisplayMode(
    react::RNSStackHeaderConfigIOSBackButtonDisplayMode displayMode);

#if RNS_BAR_BUTTON_ITEM_VISIBILITY_PRIORITY_AVAILABLE
UIBarButtonItemVisibilityPriority
UIBarButtonItemVisibilityPriorityFromReactRNSStackHeaderItemIOSVisibilityPriority(
    react::RNSStackHeaderItemIOSVisibilityPriority visibilityPriority)
    API_AVAILABLE(ios(27.0));
#endif // RNS_BAR_BUTTON_ITEM_VISIBILITY_PRIORITY_AVAILABLE

}; // namespace rnscreens::conversion

#endif // defined(__cplusplus)
