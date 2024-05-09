#ifdef RCT_NEW_ARCH_ENABLED
#import <react/renderer/components/rnscreens/Props.h>
#import "RNSEnums.h"

namespace react = facebook::react;

@interface RNSConvert : NSObject

+ (NSNumber *)getFontSizePropValue:(int)value;

+ (UISemanticContentAttribute)getDirectionPropValue:(react::RNSScreenStackHeaderConfigDirection)direction;

+ (UINavigationItemBackButtonDisplayMode)getBackButtonDisplayModePropValue:
    (react::RNSScreenStackHeaderConfigBackButtonDisplayMode)backButtonDisplayMode;

+ (RNSScreenStackPresentation)RNSScreenStackPresentationFromCppEquivalent:
    (react::RNSScreenStackPresentation)stackPresentation;

+ (RNSScreenStackAnimation)RNSScreenStackAnimationFromCppEquivalent:(react::RNSScreenStackAnimation)stackAnimation;

+ (RNSScreenStackHeaderSubviewType)RNSScreenStackHeaderSubviewTypeFromCppEquivalent:
    (react::RNSScreenStackHeaderSubviewType)subviewType;

+ (RNSScreenReplaceAnimation)RNSScreenReplaceAnimationFromCppEquivalent:
    (react::RNSScreenReplaceAnimation)replaceAnimation;

+ (RNSScreenSwipeDirection)RNSScreenSwipeDirectionFromCppEquivalent:(react::RNSScreenSwipeDirection)swipeDirection;

+ (RNSScreenDetentType)RNSScreenDetentTypeFromAllowedDetents:(react::RNSScreenSheetAllowedDetents)allowedDetents;

+ (RNSScreenDetentType)RNSScreenDetentTypeFromLargestUndimmedDetent:(react::RNSScreenSheetLargestUndimmedDetent)detent;

+ (NSDictionary *)gestureResponseDistanceDictFromCppStruct:
    (const react::RNSScreenGestureResponseDistanceStruct &)gestureResponseDistance;

#if !TARGET_OS_VISION
+ (UITextAutocapitalizationType)UITextAutocapitalizationTypeFromCppEquivalent:
    (react::RNSSearchBarAutoCapitalize)autoCapitalize;
#endif

+ (RNSSearchBarPlacement)RNSScreenSearchBarPlacementFromCppEquivalent:(react::RNSSearchBarPlacement)placement;

@end

#endif // RCT_NEW_ARCH_ENABLED
