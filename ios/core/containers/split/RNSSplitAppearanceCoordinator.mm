#import "RNSSplitAppearanceCoordinator.h"

@implementation RNSSplitAppearanceCoordinator

- (void)needs:(RNSSplitAppearanceUpdateFlags)updateFlag
{
  _updateFlags |= updateFlag;
}

/**
 * Executes the update callback if the specified flag is set.
 * The flag is cleared prior to execution to ensure the update only happens once per cycle.
 */
- (void)updateIfNeeded:(RNSSplitAppearanceUpdateFlags)updateFlag updateCallback:(void (^)(void))updateCallback
{
  if ([self isNeeded:updateFlag]) {
    _updateFlags &= ~updateFlag;
    updateCallback();
  }
}

- (BOOL)isNeeded:(RNSSplitAppearanceUpdateFlags)updateFlag
{
  return (_updateFlags & updateFlag) == updateFlag;
}

@end
