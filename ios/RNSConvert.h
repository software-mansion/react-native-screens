#ifndef RNSConvert_h
#define RNSConvert_h

#import <react/renderer/components/rnscreens/Props.h>
#import "RNSEnums.h"

@interface RNSConvert : NSObject

+ (RNSScreenStackPresentation)RNSScreenStackPresentationFromCppEquivalent:
    (facebook::react::RNSScreenStackPresentation)stackPresentation;

+ (RNSScreenStackAnimation)RNSScreenStackAnimationFromCppEquivalent:
    (facebook::react::RNSScreenStackAnimation)stackAnimation;

@end

#endif /* RNSConvert_h */
