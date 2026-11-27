#pragma once

#if defined(__cplusplus)

#import <UIKit/UIKit.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <string>
#import <vector>
#import "RNSDefines.h"
#import "RNSHeaderItemPlacement.h"
#import "RNSHeaderItemSpacerPlacement.h"
#import "RNSHeaderItemVisibilityPriority.h"
#import "RNSStackNavigationState.h"

namespace rnscreens::conversion {

namespace react = facebook::react;

std::vector<std::string> RNSStdStringVectorFromNSStringArray(NSArray<NSString *> *strings);

react::RNSStackHostEventEmitter::OnNavStateChangedActionOrigin
RNSOnNavStateChangedActionOriginFromRNSStackActionOrigin(
    RNSStackActionOrigin actionOrigin);

react::RNSStackHostEventEmitter::OnNavStateRequestRejectedRejectionReason
RNSOnNavStateRequestRejectedRejectionReasonFromRNSStackNavigationStateRejectionReason(
    RNSStackNavigationStateRejectionReason reason);

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

#if RNS_IPHONE_OS_VERSION_AVAILABLE(27_0) && !TARGET_OS_VISION && !TARGET_OS_TV

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

#endif // Check for iOS >= 27 && !TARGET_OS_VISION && !TARGET_OS_TV

RNSHeaderItemVisibilityPriority
RNSHeaderItemVisibilityPriorityFromReactRNSStackHeaderItemIOSVisibilityPriority(
    react::RNSStackHeaderItemIOSVisibilityPriority visibilityPriority);

}; // namespace rnscreens::conversion

#endif // defined(__cplusplus)
