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

#if RNS_IPHONE_OS_VERSION_AVAILABLE(27_0)

API_AVAILABLE(ios(27.0))
UIBarMinimizationBehavior
UIBarMinimizationBehaviorFromReactRNSStackHeaderConfigIOSMinimizationBehavior(
    react::RNSStackHeaderConfigIOSMinimizationBehavior minimizationBehavior);

API_AVAILABLE(ios(27.0))
UIBarMinimizationRestorationBehavior
UIBarMinimizationRestorationBehaviorFromReactRNSStackHeaderConfigIOSRestorationBehavior(
    react::RNSStackHeaderConfigIOSRestorationBehavior restorationBehavior);

#endif // Check for iOS >= 27

}; // namespace rnscreens::conversion

#endif // defined(__cplusplus)
