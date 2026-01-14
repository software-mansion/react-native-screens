#pragma once

#import <UIKit/UIKit.h>
#ifdef RCT_NEW_ARCH_ENABLED
#import <react/renderer/components/rnscreens/Props.h>
#endif // RCT_NEW_ARCH_ENABLED
#import "RNSEnums.h"

#ifdef RCT_NEW_ARCH_ENABLED
namespace react = facebook::react;
#endif // RCT_NEW_ARCH_ENABLED

@interface RNSConvert : NSObject

#ifdef RCT_NEW_ARCH_ENABLED

+ (UISemanticContentAttribute)UISemanticContentAttributeFromCppEquivalent:
    (react::RNSScreenStackHeaderConfigDirection)direction;

+ (UINavigationItemBackButtonDisplayMode)UINavigationItemBackButtonDisplayModeFromCppEquivalent:
    (react::RNSScreenStackHeaderConfigBackButtonDisplayMode)backButtonDisplayMode;

+ (RNSOptionalBoolean)RNSOptionalBooleanFromRNSFullScreenSwipeEnabledCppEquivalent:
    (react::RNSScreenFullScreenSwipeEnabled)fullScreenSwipeEnabled;

+ (RNSScreenStackPresentation)RNSScreenStackPresentationFromCppEquivalent:
    (react::RNSScreenStackPresentation)stackPresentation;

+ (RNSScreenStackAnimation)RNSScreenStackAnimationFromCppEquivalent:(react::RNSScreenStackAnimation)stackAnimation;

+ (RNSScreenStackHeaderSubviewType)RNSScreenStackHeaderSubviewTypeFromCppEquivalent:
    (react::RNSScreenStackHeaderSubviewType)subviewType;

+ (RNSScreenReplaceAnimation)RNSScreenReplaceAnimationFromCppEquivalent:
    (react::RNSScreenReplaceAnimation)replaceAnimation;

+ (RNSScreenSwipeDirection)RNSScreenSwipeDirectionFromCppEquivalent:(react::RNSScreenSwipeDirection)swipeDirection;

+ (NSArray<NSNumber *> *)detentFractionsArrayFromVector:(const std::vector<react::Float> &)detents;

+ (NSDictionary *)gestureResponseDistanceDictFromCppStruct:
    (const react::RNSScreenGestureResponseDistanceStruct &)gestureResponseDistance;

#if !TARGET_OS_VISION
+ (UITextAutocapitalizationType)UITextAutocapitalizationTypeFromCppEquivalent:
    (react::RNSSearchBarAutoCapitalize)autoCapitalize;
#endif

+ (RNSSearchBarPlacement)RNSScreenSearchBarPlacementFromCppEquivalent:(react::RNSSearchBarPlacement)placement;

+ (RNSOptionalBoolean)RNSOptionalBooleanFromRNSSearchBarObscureBackground:
    (react::RNSSearchBarObscureBackground)obscureBackground;

+ (RNSOptionalBoolean)RNSOptionalBooleanFromRNSSearchBarHideNavigationBar:
    (react::RNSSearchBarHideNavigationBar)hideNavigationBar;

+ (UIUserInterfaceStyle)UIUserInterfaceStyleFromCppEquivalent:
    (react::RNSScreenStackHeaderConfigUserInterfaceStyle)userInterfaceStyle;

+ (NSMutableArray<NSNumber *> *)arrayFromVector:(const std::vector<CGFloat> &)vector;

+ (RNSBlurEffectStyle)RNSBlurEffectStyleFromCppEquivalent:(react::RNSScreenStackHeaderConfigBlurEffect)blurEffect;

+ (RNSScrollEdgeEffect)RNSScrollEdgeEffectFromScreenBottomScrollEdgeEffectCppEquivalent:
    (react::RNSScreenBottomScrollEdgeEffect)edgeEffect;
+ (RNSScrollEdgeEffect)RNSScrollEdgeEffectFromScreenLeftScrollEdgeEffectCppEquivalent:
    (react::RNSScreenLeftScrollEdgeEffect)edgeEffect;
+ (RNSScrollEdgeEffect)RNSScrollEdgeEffectFromScreenRightScrollEdgeEffectCppEquivalent:
    (react::RNSScreenRightScrollEdgeEffect)edgeEffect;
+ (RNSScrollEdgeEffect)RNSScrollEdgeEffectFromScreenTopScrollEdgeEffectCppEquivalent:
    (react::RNSScreenTopScrollEdgeEffect)edgeEffect;
+ (id)idFromFollyDynamic:(const folly::dynamic &)dyn;

#endif // RCT_NEW_ARCH_ENABLED

/// This method fails (by assertion) when `blurEffect == RNSBlurEffectStyleNone` or `blurEffect ==
/// RNSBlurEffectStyleSystemDefault` which have no counter parts in the UIKit types.
+ (UIBlurEffectStyle)tryConvertRNSBlurEffectStyleToUIBlurEffectStyle:(RNSBlurEffectStyle)blurEffect;

@end
