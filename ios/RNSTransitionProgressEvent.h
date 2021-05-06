#import <React/RCTViewManager.h>

@interface RNSTransitionProgressEvent : NSObject <RCTEvent>

- (instancetype)initWithReactTag:(NSNumber *)reactTag progress:(double)progress closing:(BOOL)closing;

@end
