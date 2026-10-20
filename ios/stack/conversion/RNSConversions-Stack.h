#pragma once

#if defined(__cplusplus)

#import <react/renderer/components/rnscreens/Props.h>
#import "RNSDefines.h"
#import "RNSHeaderItemPlacement.h"
#import "RNSHeaderItemSpacerPlacement.h"
#import "RNSHeaderItemVisibilityPriority.h"
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

UIBarButtonItemStyle UIBarButtonItemStyleFromReactRNSStackHeaderItemIOSVariant(
    react::RNSStackHeaderItemIOSVariant variant);

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

API_AVAILABLE(ios(27.0))
UIBarMinimizationSafeAreaAdjustment
UIBarMinimizationSafeAreaAdjustmentFromReactRNSStackHeaderConfigIOSSafeAreaAdjustment(
    react::RNSStackHeaderConfigIOSSafeAreaAdjustment safeAreaAdjustment);

#endif // Check for iOS >= 27
  
RNSHeaderItemVisibilityPriority
RNSHeaderItemVisibilityPriorityFromReactRNSStackHeaderItemIOSVisibilityPriority(
    react::RNSStackHeaderItemIOSVisibilityPriority visibilityPriority);

#if RNS_IPHONE_OS_VERSION_AVAILABLE(27_0) && !TARGET_OS_TV && !TARGET_OS_VISION
API_AVAILABLE(ios(27.0))
UIBarButtonItemVisibilityPriority
UIBarButtonItemVisibilityPriorityFromRNSHeaderItemVisibilityPriority(
    RNSHeaderItemVisibilityPriority visibilityPriority);
#endif // Check for iOS >= 27 && !TARGET_OS_TV && !TARGET_OS_VISION

}; // namespace rnscreens::conversion

#endif // defined(__cplusplus)
