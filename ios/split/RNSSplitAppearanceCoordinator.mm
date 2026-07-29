#import "RNSSplitAppearanceCoordinator.h"

@implementation RNSSplitAppearanceCoordinator

- (void)needs:(RNSSplitAppearanceUpdateFlags)updateFlag
{
  _updateFlags |= updateFlag;
}

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
