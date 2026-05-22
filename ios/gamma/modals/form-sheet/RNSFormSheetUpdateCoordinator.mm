#import "RNSFormSheetUpdateCoordinator.h"

@implementation RNSFormSheetUpdateCoordinator {
  RNSFormSheetUpdateFlags _updateFlags;
}

- (instancetype)init
{
  if (self = [super init]) {
    _updateFlags = RNSFormSheetUpdateFlagsNone;
  }
  return self;
}

- (void)setNeeds:(RNSFormSheetUpdateFlags)flags
{
  _updateFlags |= flags;
}

- (BOOL)needsAll:(RNSFormSheetUpdateFlags)flags
{
  if (flags == RNSFormSheetUpdateFlagsNone) {
    return NO;
  }
  return (_updateFlags & flags) == flags;
}

- (BOOL)needsAny:(RNSFormSheetUpdateFlags)flags
{
  if (flags == RNSFormSheetUpdateFlagsNone) {
    return NO;
  }
  return (_updateFlags & flags) != 0;
}

- (void)updateIfNeeds:(RNSFormSheetUpdateFlags)flags performOperations:(dispatch_block_t)block
{
  if ([self needsAll:flags]) {
    block();
    _updateFlags &= ~flags;
  }
}

- (void)updateIfNeedsAny:(RNSFormSheetUpdateFlags)flags performOperations:(dispatch_block_t)block
{
  if ([self needsAny:flags]) {
    block();
    _updateFlags &= ~flags;
  }
}

@end
