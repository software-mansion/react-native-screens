#import "RNSFormSheetAppearanceCoordinator.h"

@implementation RNSFormSheetAppearanceCoordinator {
  RNSFormSheetAppearanceUpdateFlags _updateFlags;
}

- (instancetype)init
{
  if (self = [super init]) {
    _updateFlags = RNSFormSheetAppearanceUpdateFlagsNone;
  }
  return self;
}

- (void)needs:(RNSFormSheetAppearanceUpdateFlags)flag
{
  _updateFlags |= flag;
}

- (BOOL)isNeeded:(RNSFormSheetAppearanceUpdateFlags)flag
{
  return (_updateFlags & flag) == flag;
}

- (void)updateIfNeeded:(RNSFormSheetAppearanceUpdateFlags)flag performBlock:(NS_NOESCAPE dispatch_block_t)block
{
  if ([self isNeeded:flag]) {
    _updateFlags &= ~flag;
    block();
  }
}

@end
