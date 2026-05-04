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
  if (_isEmitting) {
    return NO;
  }
  if ([_observers containsObject:observer]) {
    return NO;
  }
  [_observers addObject:observer];
  return YES;
}

- (BOOL)removeObserver:(id<RNSTabsNavigationStateObserver>)observer
{
  if (_isEmitting) {
    return NO;
  }
  if (![_observers containsObject:observer]) {
    return NO;
  }
  [_observers removeObject:observer];
  return YES;
}

- (void)clear
{
  RCTAssert(!_isEmitting, @"[RNScreens] RNSTabsNavigationStateObserverRegistry clear during emission");
  [_observers removeAllObjects];
}

- (void)emitDidUpdateStateTo:(nonnull RNSTabsNavigationState *)navState
                 withContext:(nonnull RNSTabsNavigationStateUpdateContext *)context
                      sender:(nonnull RNSTabBarController *)sender
{
  RCTAssert(!_isEmitting, @"[RNScreens] Recursive emission on RNSTabsNavigationStateObserverRegistry");
  _isEmitting = YES;
  for (id<RNSTabsNavigationStateObserver> observer in _observers) {
    [observer tabsContainer:sender didUpdateStateTo:navState withContext:context];
  }
  _isEmitting = NO;
}

- (void)emitRejectedStateUpdate:(nonnull RNSTabsNavigationStateUpdateRequest *)rejectedRequest
                   currentState:(nonnull RNSTabsNavigationState *)currentNavState
                     withReason:(RNSTabsNavigationStateRejectionReason)reason
                         sender:(nonnull RNSTabBarController *)sender
{
  RCTAssert(!_isEmitting, @"[RNScreens] Recursive emission on RNSTabsNavigationStateObserverRegistry");
  _isEmitting = YES;
  for (id<RNSTabsNavigationStateObserver> observer in _observers) {
    [observer tabsContainer:sender rejectedStateUpdate:rejectedRequest currentState:currentNavState withReason:reason];
  }
  _isEmitting = NO;
}

- (void)emitPreventedSelectionOf:(nonnull NSString *)preventedScreenKey
                    currentState:(nonnull RNSTabsNavigationState *)currentNavState
                          sender:(nonnull RNSTabBarController *)sender
{
  RCTAssert(!_isEmitting, @"[RNScreens] Recursive emission on RNSTabsNavigationStateObserverRegistry");
  _isEmitting = YES;
  for (id<RNSTabsNavigationStateObserver> observer in _observers) {
    [observer tabsContainer:sender preventedSelectionOf:preventedScreenKey currentState:currentNavState];
  }
  _isEmitting = NO;
}

- (void)emitDidSelectMoreTabWithCurrentState:(nonnull RNSTabsNavigationState *)currentNavState
                                      sender:(nonnull RNSTabBarController *)sender
{
  RCTAssert(!_isEmitting, @"[RNScreens] Recursive emission on RNSTabsNavigationStateObserverRegistry");
  _isEmitting = YES;
  SEL sel = @selector(tabsContainer:didSelectMoreTabWithCurrentState:);
  for (id<RNSTabsNavigationStateObserver> observer in _observers) {
    if ([observer respondsToSelector:sel]) {
      [observer tabsContainer:sender didSelectMoreTabWithCurrentState:currentNavState];
    }
  }
  _isEmitting = NO;
}

@end
