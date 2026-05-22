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

- (void)setNeeds:(RNSFormSheetAppearanceUpdateFlags)flags
{
  _updateFlags |= flags;
}

- (BOOL)needsAll:(RNSFormSheetAppearanceUpdateFlags)flags
{
  if (flags == RNSFormSheetAppearanceUpdateFlagsNone) {
    return NO;
  }

  return (_updateFlags & flags) == flags;
}

- (void)updateIfNeeds:(RNSFormSheetAppearanceUpdateFlags)flags performOperations:(dispatch_block_t)block
{
  if ([self needsAll:flags]) {
    block();
    _updateFlags &= ~flags;
  }
}

@end
