#pragma once

#if defined(__cplusplus)
#import <react/renderer/components/rnscreens/Props.h>
#import "RNSEnums.h"

namespace rnscreens::conversion {

namespace react = facebook::react;

std::optional<UIBlurEffectStyle>
RNSMaybeUIBlurEffectStyleFromRNSBottomTabsTabBarBlurEffect(
    react::RNSBottomTabsTabBarBlurEffect blurEffect);

UIBlurEffect *RNSUIBlurEffectFromRNSBottomTabsTabBarBlurEffect(
    react::RNSBottomTabsTabBarBlurEffect blurEffect);

UIOffset RNSBottomTabsTabBarItemTitlePositionAdjustmentStruct(
    react::RNSBottomTabsTabBarItemTitlePositionAdjustmentStruct
        titlePositionAdjustment);

std::optional<UIBlurEffectStyle>
RNSMaybeUIBlurEffectStyleFromRNSBottomTabsScreenTabBarBlurEffect(
    react::RNSBottomTabsScreenTabBarBlurEffect blurEffect);

UIBlurEffect *RNSUIBlurEffectFromRNSBottomTabsScreenTabBarBlurEffect(
    react::RNSBottomTabsScreenTabBarBlurEffect blurEffect);

UIOffset RNSBottomTabsScreenTabBarItemTitlePositionAdjustmentStruct(
    react::RNSBottomTabsScreenTabBarItemTitlePositionAdjustmentStruct
        titlePositionAdjustment);

#pragma mark SplitView

RNSSplitViewSplitBehavior RNSSplitViewSplitBehaviorFromHostProp(
    react::RNSSplitViewHostSplitBehavior);

RNSSplitViewPrimaryEdge RNSSplitViewPrimaryEdgeFromHostProp(
    react::RNSSplitViewHostPrimaryEdge);

UISplitViewControllerSplitBehavior
RNSSplitBehaviorToUISplitViewControllerSplitBehavior(
    RNSSplitViewSplitBehavior behavior);

UISplitViewControllerPrimaryEdge
RNSPrimaryEdgeToUISplitViewControllerPrimaryEdge(
    RNSSplitViewPrimaryEdge primaryEdge);
}; // namespace rnscreens::conversion

#endif
