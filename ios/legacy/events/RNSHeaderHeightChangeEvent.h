#pragma once

#if defined(__cplusplus)
#import <React/RCTEventDispatcherProtocol.h>
#endif // defined(__cplusplus)

@interface RNSHeaderHeightChangeEvent : NSObject
#if defined(__cplusplus)
                                        <RCTEvent>
#endif // defined(__cplusplus)

- (instancetype)initWithEventName:(NSString *)eventName reactTag:(NSNumber *)reactTag headerHeight:(double)headerHeight;

@end
