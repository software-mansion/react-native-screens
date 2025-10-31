#if RCT_NEW_ARCH_ENABLED && REACT_NATIVE_VERSION_MINOR <= 82

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
  // Backward compatibility for 0.82 RC or lower
  if (facebook::react::ReactNativeVersion.Minor <= 81 || facebook::react::ReactNativeVersion.Prerelease != "") {
    [_invalidViews addObject:view];
  }
}

- (void)flushInvalidViews
{
  // Backward compatibility for 0.82 RC or lower
  if (facebook::react::ReactNativeVersion.Minor <= 81 || facebook::react::ReactNativeVersion.Prerelease != "") {
    for (id<RNSViewControllerInvalidating> view in _invalidViews) {
      [view invalidateController];
    }
    [_invalidViews removeAllObjects];
  }
}

@end

#endif // RCT_NEW_ARCH_ENABLED && REACT_NATIVE_VERSION_MINOR <= 82
