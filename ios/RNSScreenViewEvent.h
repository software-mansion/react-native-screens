#ifdef RN_FABRIC_ENABLED

#import <React/RCTBridge+Private.h>
#import <React/RCTEventDispatcherProtocol.h>

@interface RNSScreenViewEvent : NSObject <RCTEvent>

- (instancetype)initWithEventName:(NSString *)eventName
                         reactTag:(NSNumber *)reactTag
                         progress:(double)progress
                          closing:(int)closing
                     goingForward:(int)goingForward;

@end

#endif // RN_FABRIC_ENABLED
