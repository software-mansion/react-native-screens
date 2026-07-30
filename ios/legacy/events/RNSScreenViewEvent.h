#pragma once

#if defined(__cplusplus)
#import <React/RCTEventDispatcherProtocol.h>
#endif // defined(__cplusplus)

@interface RNSScreenViewEvent : NSObject
#if defined(__cplusplus)
                                <RCTEvent>
#endif // defined(__cplusplus)

- (instancetype)initWithEventName:(NSString *)eventName
                         reactTag:(NSNumber *)reactTag
                         progress:(double)progress
                          closing:(int)closing
                     goingForward:(int)goingForward;

@end
