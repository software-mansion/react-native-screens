#import "RNSTabsNavigationStateObserverRegistry.h"

#import <React/RCTAssert.h>

#import "RNSTabBarController.h"

@implementation RNSTabsNavigationStateObserverRegistry {
  NSMutableArray<id<RNSTabsNavigationStateObserver>> *_observers;
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

- (BOOL)addObserver:(id<RNSTabsNavigationStateObserver>)observer
{
  if (_isEmitting || [_observers containsObject:observer]) {
    return NO;
  }
  [_observers addObject:observer];
  return YES;
}

- (BOOL)removeObserver:(id<RNSTabsNavigationStateObserver>)observer
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

- (void)emitDidUpdateStateTo:(nonnull RNSTabsNavigationState *)navState
                 withContext:(nonnull RNSTabsNavigationStateUpdateContext *)context
                      sender:(nonnull RNSTabBarController *)sender
{
  [self emitSignal:^(id<RNSTabsNavigationStateObserver> observer) {
    [observer tabsContainer:sender didUpdateStateTo:navState withContext:context];
  }];
}

- (void)emitRejectedStateUpdate:(nonnull RNSTabsNavigationStateUpdateRequest *)rejectedRequest
                   currentState:(nonnull RNSTabsNavigationState *)currentNavState
                     withReason:(RNSTabsNavigationStateRejectionReason)reason
                         sender:(nonnull RNSTabBarController *)sender
{
  [self emitSignal:^(id<RNSTabsNavigationStateObserver> observer) {
    [observer tabsContainer:sender rejectedStateUpdate:rejectedRequest currentState:currentNavState withReason:reason];
  }];
}

- (void)emitPreventedSelectionOf:(nonnull NSString *)preventedScreenKey
                    currentState:(nonnull RNSTabsNavigationState *)currentNavState
                          sender:(nonnull RNSTabBarController *)sender
{
  [self emitSignal:^(id<RNSTabsNavigationStateObserver> observer) {
    [observer tabsContainer:sender preventedSelectionOf:preventedScreenKey currentState:currentNavState];
  }];
}

- (void)emitDidSelectMoreTabWithCurrentState:(nonnull RNSTabsNavigationState *)currentNavState
                                      sender:(nonnull RNSTabBarController *)sender
{
  SEL observerSelector = @selector(tabsContainer:didSelectMoreTabWithCurrentState:);
  [self emitSignal:^(id<RNSTabsNavigationStateObserver> observer) {
    if ([observer respondsToSelector:observerSelector]) {
      [observer tabsContainer:sender didSelectMoreTabWithCurrentState:currentNavState];
    }
  }];
}

- (void)emitSignal:(void (^)(id<RNSTabsNavigationStateObserver> observer))emitBlock
{
  RCTAssert(!_isEmitting, @"[RNScreens] Recursive emission on RNSTabsNavigationStateObserverRegistry");

  // In release best we can do here is let it emit the event. Alternatives are to crash or not emit (certain wrong
  // state).

  _isEmitting = YES;
  @try {
    for (id<RNSTabsNavigationStateObserver> observer in _observers) {
      emitBlock(observer);
    }
  } @finally {
    _isEmitting = NO;
  }
}

@end
