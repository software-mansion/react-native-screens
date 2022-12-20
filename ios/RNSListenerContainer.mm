#import "RNSListenerContainer.h"

@implementation RNSListenerContainer {
  NSMutableArray<ObserverBlock> *_observers;
}

- (instancetype)init
{
  self = [super init];
  _observers = [NSMutableArray new];
  return self;
}

- (void)addListener:(ObserverBlock)observer
{
  [_observers addObject:observer];
}

- (void)removeListener:(ObserverBlock)observer
{
  [_observers removeObject:observer];
}

- (void)notifyListeners:(NSString *)type data:(NSDictionary *)data component:(id<RCTComponent>)component
{
  for (ObserverBlock observer in _observers) {
    observer(type, data, component);
  }
}

@end
