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
- (BOOL)getToggleStateForItemWithId:(NSString *)menuElementId initialState:(BOOL)initialState
{
  NSNumber *existing = _states[menuElementId];
  if (existing != nil) {
    return existing.boolValue;
  }
  _states[menuElementId] = @(initialState);
  return initialState;
}

- (BOOL)toggleItemWithId:(NSString *)menuElementId
{
  NSNumber *existing = _states[menuElementId];
  BOOL newValue = !(existing != nil ? existing.boolValue : NO);
  _states[menuElementId] = @(newValue);
  _toggleStateChanged = YES;
  return newValue;
}

- (void)selectItemWithId:(NSString *)menuElementId fromIds:(NSArray<NSString *> *)allItemIdsInMenu
{
  BOOL givenItemIsSelected = NO;
  _toggleStateChanged = ![_states[menuElementId] boolValue];
  for (NSString *itemId in allItemIdsInMenu) {
    if ([itemId isEqualToString:menuElementId]) {
      _states[itemId] = @(YES);
      givenItemIsSelected = YES;
    } else {
      _states[itemId] = @(NO);
    }
  }

  RCTAssert(
      givenItemIsSelected, @"[RNScreens] Attempt to select item \"%@\" that is not present in the list", menuElementId);
}

@end
