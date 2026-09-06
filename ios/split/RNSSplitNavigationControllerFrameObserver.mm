#import "RNSSplitNavigationControllerFrameObserver.h"
#import "RNSSplitNavigationControllerFrameOriginChangeDelegate.h"

static void *RNSSplitNavigationViewFrameContext = &RNSSplitNavigationViewFrameContext;

@implementation RNSSplitNavigationControllerFrameObserver {
  RNSSplitNavigationController *__weak _navigationController;
  id<RNSSplitNavigationControllerFrameOriginChangeDelegate> __weak _frameOriginChangeDelegate;
  UIView *__weak _observedView;
}

- (instancetype)initWithSplitNavigationController:(RNSSplitNavigationController *)navigationController
                                         delegate:(id<RNSSplitNavigationControllerFrameOriginChangeDelegate>)
                                                      frameOriginChangeDelegate
{
  if (self = [super init]) {
    _navigationController = navigationController;
    _frameOriginChangeDelegate = frameOriginChangeDelegate;
  }

  return self;
}

#pragma mark - Observing view frame changes

- (void)registerForViewFrameChanges
{
  [self unregisterForViewFrameChanges];

  UIView *view = _navigationController.viewIfLoaded;
  if (view == nil) {
    return;
  }

  [view addObserver:self
         forKeyPath:@"frame"
            options:NSKeyValueObservingOptionOld | NSKeyValueObservingOptionNew
            context:RNSSplitNavigationViewFrameContext];
  _observedView = view;
}

- (void)unregisterForViewFrameChanges
{
  [_observedView removeObserver:self forKeyPath:@"frame" context:RNSSplitNavigationViewFrameContext];
  _observedView = nil;
}

- (void)observeValueForKeyPath:(NSString *)keyPath
                      ofObject:(id)object
                        change:(NSDictionary<NSKeyValueChangeKey, id> *)change
                       context:(void *)context
{
  if (context != RNSSplitNavigationViewFrameContext) {
    [super observeValueForKeyPath:keyPath ofObject:object change:change context:context];
    return;
  }

  id oldValue = change[NSKeyValueChangeOldKey];
  id newValue = change[NSKeyValueChangeNewKey];
  if (![oldValue isKindOfClass:[NSValue class]] || ![newValue isKindOfClass:[NSValue class]]) {
    return;
  }

  CGRect oldFrame = [oldValue CGRectValue];
  CGRect newFrame = [newValue CGRectValue];

  if (!CGPointEqualToPoint(oldFrame.origin, newFrame.origin)) {
    RNSSplitNavigationController *navigationController = _navigationController;
    if (navigationController != nil) {
      [_frameOriginChangeDelegate splitNavigationControllerFrameOriginDidChange:navigationController];
    }
  }
}

- (void)dealloc
{
  [self unregisterForViewFrameChanges];
}

@end
