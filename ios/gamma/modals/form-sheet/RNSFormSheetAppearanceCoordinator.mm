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

- (void)setNeeds:(RNSFormSheetAppearanceUpdateFlags)flag
{
  _updateFlags |= flag;
}

- (BOOL)isNeeded:(RNSFormSheetAppearanceUpdateFlags)flag
{
  if (flag == RNSFormSheetAppearanceUpdateFlagsNone) {
    return NO;
  }

  return (_updateFlags & flag) == flag;
}

- (void)updateIfNeeded:(RNSFormSheetAppearanceUpdateFlags)flag performOperations:(dispatch_block_t)block
{
  if ([self isNeeded:flag]) {
    _updateFlags &= ~flag;
    block();
  }
}

@end
