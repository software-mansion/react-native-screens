#ifdef RCT_NEW_ARCH_ENABLED

#import "RNSInvalidatedComponentsRegistry.h"

@interface RNSInvalidatedComponentsRegistry ()
@property (nonatomic, strong) NSMutableSet<UIView<RNSViewControllerInvalidating> *> *invalidViews;
@end

@implementation RNSInvalidatedComponentsRegistry

- (instancetype)init
{
  if (self = [super init]) {
    _invalidViews = [NSMutableSet set];
  }
  return self;
}

- (void)pushForInvalidation:(UIView<RNSViewControllerInvalidating> *)view
{
  [_invalidViews addObject:view];
}

- (void)flushInvalidViews
{
  for (id<RNSViewControllerInvalidating> view in _invalidViews) {
    [view invalidateController];
  }
  [_invalidViews removeAllObjects];
}

@end

#endif // RCT_NEW_ARCH_ENABLED
