#import "RNSStackHeaderConfigEventEmitter.h"
#import <React/RCTConversions.h>
#import <React/RCTLog.h>

@implementation RNSStackHeaderConfigEventEmitter {
  std::shared_ptr<const react::RNSStackHeaderConfigIOSEventEmitter> _reactEventEmitter;
}

- (BOOL)emitOnMenuItemPress:(NSString *)menuItemId
{
  if (_reactEventEmitter != nullptr) {
    _reactEventEmitter->onMenuItemPress({.menuItemId = RCTStringFromNSString(menuItemId)});
    return YES;
  } else {
    RCTLogWarn(@"[RNScreens] Skipped OnMenuItemPress event emission due to nullish emitter");
    return NO;
  }
}

- (BOOL)emitOnMenuSelectionChanged:(NSString *)menuId selectedMenuItemIds:(NSArray<NSString *> *)selectedIds
{
  if (_reactEventEmitter != nullptr) {
    std::vector<std::string> stringIds;
    stringIds.reserve([selectedIds count]);
    for (NSString *sid in selectedIds) {
      stringIds.push_back(RCTStringFromNSString(sid));
    }
    _reactEventEmitter->onMenuSelectionChanged({
        .menuId = RCTStringFromNSString(menuId),
        .selectedMenuItemIds = std::move(stringIds),
    });
    return YES;
  } else {
    RCTLogWarn(@"[RNScreens] Skipped OnMenuSelectionChanged event emission due to nullish emitter");
    return NO;
  }
}

- (void)updateEventEmitter:(const std::shared_ptr<const react::RNSStackHeaderConfigIOSEventEmitter> &)emitter
{
  _reactEventEmitter = emitter;
}

@end
