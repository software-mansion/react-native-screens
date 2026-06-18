#import "RNSContainedModalUpdateCoordinator.h"

@implementation RNSContainedModalUpdateCoordinator {
  RNSContainedModalUpdateFlags _updateFlags;
}

- (instancetype)init
{
  if (self = [super init]) {
    _updateFlags = RNSContainedModalUpdateFlagsNone;
  }
  return self;
}

- (void)setNeeds:(RNSContainedModalUpdateFlags)flags
{
  _updateFlags |= flags;
}

- (BOOL)needsAll:(RNSContainedModalUpdateFlags)flags
{
  if (flags == RNSContainedModalUpdateFlagsNone) {
    return NO;
  }
  return (_updateFlags & flags) == flags;
}

- (BOOL)needsAny:(RNSContainedModalUpdateFlags)flags
{
  if (flags == RNSContainedModalUpdateFlagsNone) {
    return NO;
  }
  return (_updateFlags & flags) != 0;
}

- (void)updateIfNeeded:(RNSContainedModalUpdateFlags)flags performOperations:(dispatch_block_t)block
{
  if ([self needsAll:flags]) {
    block();
    _updateFlags &= ~flags;
  }
}

- (void)updateIfAnyNeeded:(RNSContainedModalUpdateFlags)flags performOperations:(dispatch_block_t)block
{
  if ([self needsAny:flags]) {
    block();
    _updateFlags &= ~flags;
  }
}

@end
