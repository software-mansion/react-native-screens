#ifdef RN_FABRIC_ENABLED
#import <react/renderer/components/rnscreens/Props.h>
#import "RNSEnums.h"
#import "RNSSharedElementTransitionOptions.h"

@interface RNSConvert : NSObject

+ (RNSScreenStackPresentation)RNSScreenStackPresentationFromCppEquivalent:
    (facebook::react::RNSScreenStackPresentation)stackPresentation;

+ (RNSScreenStackAnimation)RNSScreenStackAnimationFromCppEquivalent:
    (facebook::react::RNSScreenStackAnimation)stackAnimation;

+ (RNSScreenStackHeaderSubviewType)RNSScreenStackHeaderSubviewTypeFromCppEquivalent:
    (facebook::react::RNSScreenStackHeaderSubviewType)subviewType;

+ (RNSScreenReplaceAnimation)RNSScreenReplaceAnimationFromCppEquivalent:
    (facebook::react::RNSScreenReplaceAnimation)replaceAnimation;

+ (RNSScreenSwipeDirection)RNSScreenSwipeDirectionFromCppEquivalent:
    (facebook::react::RNSScreenSwipeDirection)swipeDirection;

+ (NSDictionary *)gestureResponseDistanceDictFromCppStruct:
    (const facebook::react::RNSScreenGestureResponseDistanceStruct &)gestureResponseDistance;

+ (NSArray<RNSSharedElementTransitionOptions *> *)sharedElementTransitionsFromCppStruct:
    (const std::vector<facebook::react::RNSScreenSharedElementTransitionsStruct> &)sharedElementTransitions;

@end

#endif // RN_FABRIC_ENABLED
