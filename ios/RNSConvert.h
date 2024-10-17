#ifdef RCT_NEW_ARCH_ENABLED
#import <UIKit/UIKit.h>
#import <react/renderer/components/rnscreens/Props.h>
#import "RNSEnums.h"

namespace react = facebook::react;

@interface RNSConvert : NSObject

+ (UISemanticContentAttribute)UISemanticContentAttributeFromCppEquivalent:
    (react::RNSScreenStackHeaderConfigDirection)direction;

+ (UINavigationItemBackButtonDisplayMode)UINavigationItemBackButtonDisplayModeFromCppEquivalent:
    (react::RNSScreenStackHeaderConfigBackButtonDisplayMode)backButtonDisplayMode;

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

+ (NSMutableArray<NSNumber *> *)NSNumberMutableArrayFromFloatVector:(const std::vector<CGFloat> &)vector;

+ (NSMutableArray<NSNumber *> *)arrayFromVector:(const std::vector<CGFloat> &)vector;

+ (RNSBlurEffectStyle)RNSBlurEffectStyleFromCppEquivalent:(react::RNSScreenStackHeaderConfigBlurEffect)blurEffect;

/// This method fails (by assertion) when `blurEffect == RNSBlurEffectStyleNone` which has no counter part in the UIKit type.
+ (UIBlurEffectStyle)tryConvertRNSBlurEffectStyleToUIBlurEffectStyle:(RNSBlurEffectStyle)blurEffect;

@end

#endif // RCT_NEW_ARCH_ENABLED
