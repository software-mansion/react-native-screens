#import <React/RCTBridge+Private.h>
#import <React/RCTEventDispatcherProtocol.h>

@interface RNSHeaderHeightChangeEvent : NSObject <RCTEvent>

- (instancetype)initWithEventName:(NSString *)eventName reactTag:(NSNumber *)reactTag newHeight:(double)newHeight;

@end
