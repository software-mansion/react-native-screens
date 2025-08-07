#import "RNSInvalidatedComponentsRegistry.h"

@interface RNSInvalidatedComponentsRegistry ()
@property (nonatomic, strong) NSMutableSet<UIView<RNSViewControllerInvalidating> *> *invalidViews;
@end

@implementation RNSInvalidatedComponentsRegistry

+ (instancetype)invalidatedComponentsRegistry
{
  static RNSInvalidatedComponentsRegistry *sharedInstance = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    sharedInstance = [[RNSInvalidatedComponentsRegistry alloc] init];
  });
  return sharedInstance;
}

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
