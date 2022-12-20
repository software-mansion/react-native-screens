#import <React/RCTComponentData.h>

typedef void (^ObserverBlock)(NSString *type, NSDictionary *data, id<RCTComponent> component);

@interface RNSListenerContainer : NSObject

- (void)addListener:(ObserverBlock)observer;
- (void)removeListener:(ObserverBlock)observer;
- (void)notifyListeners:(NSString *)type data:(NSDictionary *)data component:(id<RCTComponent>)component;

@end
