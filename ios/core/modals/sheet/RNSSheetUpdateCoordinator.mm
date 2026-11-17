#import "RNSSheetUpdateCoordinator.h"

@implementation RNSSheetUpdateCoordinator {
  RNSSheetUpdateFlags _updateFlags;
}

- (instancetype)init
{
  if (self = [super init]) {
    _updateFlags = RNSSheetUpdateFlagsNone;
  }
  return self;
}

- (void)setNeeds:(RNSSheetUpdateFlags)flags
{
  _updateFlags |= flags;
}

- (BOOL)needsAll:(RNSSheetUpdateFlags)flags
{
  if (flags == RNSSheetUpdateFlagsNone) {
    return NO;
  }
  return (_updateFlags & flags) == flags;
}

- (BOOL)needsAny:(RNSSheetUpdateFlags)flags
{
  if (flags == RNSSheetUpdateFlagsNone) {
    return NO;
  }
  return (_updateFlags & flags) != 0;
}

- (void)updateIfNeeded:(RNSSheetUpdateFlags)flags performOperations:(dispatch_block_t)block
{
  if ([self needsAll:flags]) {
    block();
    _updateFlags &= ~flags;
  }
}

- (void)updateIfAnyNeeded:(RNSSheetUpdateFlags)flags performOperations:(dispatch_block_t)block
{
  if ([self needsAny:flags]) {
    block();
    _updateFlags &= ~flags;
  }
}

@end
