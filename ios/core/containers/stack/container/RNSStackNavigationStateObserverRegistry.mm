#import "RNSStackNavigationStateObserverRegistry.h"

#import "RNSAssert.h"
#import "RNSStackNavigationController.h"

@implementation RNSStackNavigationStateObserverRegistry {
  NSMutableArray<id<RNSStackNavigationStateObserver>> *_observers;
  BOOL _isEmitting;
}

- (instancetype)init
{
  if (self = [super init]) {
    _observers = [NSMutableArray new];
    _isEmitting = NO;
  }
  return self;
}

- (BOOL)addObserver:(id<RNSStackNavigationStateObserver>)observer
{
  if (_isEmitting || [_observers containsObject:observer]) {
    return NO;
  }
  [_observers addObject:observer];
  return YES;
}

- (BOOL)removeObserver:(id<RNSStackNavigationStateObserver>)observer
{
  if (_isEmitting || ![_observers containsObject:observer]) {
    return NO;
  }
  [_observers removeObject:observer];
  return YES;
}

- (BOOL)clear
{
  if (_isEmitting) {
    return NO;
  }
  [_observers removeAllObjects];
  return YES;
}

- (void)emitDidUpdateStateTo:(RNSStackNavigationState *)navState
                 withContext:(RNSStackNavigationStateUpdateContext *)context
                      sender:(RNSStackNavigationController *)sender
{
  [self emitSignal:^(id<RNSStackNavigationStateObserver> observer) {
    [observer stackContainer:sender didUpdateStateTo:navState withContext:context];
  }];
}

- (void)emitRejectedStateUpdate:(RNSStackNavigationStateUpdateRequest *)rejectedRequest
                   currentState:(RNSStackNavigationState *)currentNavState
                     withReason:(RNSStackNavigationStateRejectionReason)reason
                         sender:(RNSStackNavigationController *)sender
{
  [self emitSignal:^(id<RNSStackNavigationStateObserver> observer) {
    [observer stackContainer:sender rejectedStateUpdate:rejectedRequest currentState:currentNavState withReason:reason];
  }];
}

- (void)emitDidReleaseScreensWithKeys:(NSArray<NSString *> *)screenKeys sender:(RNSStackNavigationController *)sender
{
  [self emitSignal:^(id<RNSStackNavigationStateObserver> observer) {
    [observer stackContainer:sender didReleaseScreensWithKeys:screenKeys];
  }];
}

- (void)emitSignal:(void (^)(id<RNSStackNavigationStateObserver> observer))emitBlock
{
  RNSAssert(!_isEmitting, @"[RNScreens] Recursive emission on RNSStackNavigationStateObserverRegistry");

  // In release the best we can do is to emit anyway. The alternatives are to crash or to drop the event, which
  // leaves an observer with a certainly wrong state.

  _isEmitting = YES;
  @try {
    for (id<RNSStackNavigationStateObserver> observer in _observers) {
      emitBlock(observer);
    }
  } @finally {
    _isEmitting = NO;
  }
}

@end
