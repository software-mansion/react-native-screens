#import <React/RCTEventDispatcherProtocol.h>

@interface RNSSheetTranslationEvent : NSObject <RCTEvent>

- (instancetype)initWithEventName:(NSString *)eventName
                         reactTag:(NSNumber *)reactTag
                                y:(double)y
                    transitioning:(int)transitioning;

@end
