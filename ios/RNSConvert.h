#ifdef RN_FABRIC_ENABLED
#import <react/renderer/components/rnscreens/Props.h>
#import "RNSEnums.h"

@interface RNSConvert : NSObject

+ (RNSScreenStackPresentation)RNSScreenStackPresentationFromCppEquivalent:
    (facebook::react::RNSScreenStackPresentation)stackPresentation;

+ (RNSScreenStackAnimation)RNSScreenStackAnimationFromCppEquivalent:
    (facebook::react::RNSScreenStackAnimation)stackAnimation;

+ (RNSScreenStackHeaderSubviewType)RNSScreenStackHeaderSubviewTypeFromCppEquivalent:
    (facebook::react::RNSScreenStackHeaderSubviewType)subviewType;

@end

#endif // RN_FABRIC_ENABLED
