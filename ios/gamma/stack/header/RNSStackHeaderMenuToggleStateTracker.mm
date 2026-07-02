#import "RNSStackHeaderMenuToggleStateTracker.h"
#import <React/RCTAssert.h>

@implementation RNSStackHeaderMenuToggleStateTracker {
  NSMutableDictionary<NSString *, NSNumber *> *_states;
}

- (instancetype)init
{
  if (self = [super init]) {
    _states = [NSMutableDictionary new];
    _toggleStateChanged = NO;
  }
  return self;
}

/**
 For singleSelection menus, only one item should have initialState set to true.
 This is enforced by JS-side and validated by an RCTAssert in RNSStackHeaderMenuCoordinator during menu build.
 */
- (BOOL)getToggleStateForItemWithId:(NSString *)menuItemId initialState:(BOOL)initialState
{
  NSNumber *existing = _states[menuItemId];
  if (existing != nil) {
    return existing.boolValue;
  }
  _states[menuItemId] = @(initialState);
  return initialState;
}

- (BOOL)toggleItemWithId:(NSString *)menuItemId
{
  NSNumber *existing = _states[menuItemId];
  BOOL newValue = !(existing != nil ? existing.boolValue : NO);
  _states[menuItemId] = @(newValue);
  _toggleStateChanged = YES;
  return newValue;
}

- (void)selectItemWithId:(NSString *)menuItemId fromIds:(NSArray<NSString *> *)allItemIdsInMenu
{
  BOOL givenItemIsSelected = NO;
  _toggleStateChanged = ![_states[menuItemId] boolValue];
  for (NSString *itemId in allItemIdsInMenu) {
    if ([itemId isEqualToString:menuItemId]) {
      _states[itemId] = @YES;
      givenItemIsSelected = YES;
    } else {
      _states[itemId] = @NO;
    }
  }

  RCTAssert(
      givenItemIsSelected, @"[RNScreens] Attempt to select item \"%@\" that is not present in the list", menuItemId);
}

@end
