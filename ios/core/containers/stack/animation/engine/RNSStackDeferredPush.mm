#import "RNSStackDeferredPush.h"

@implementation RNSStackDeferredPush {
  BOOL _started;
  BOOL _releaseRequested;
}

- (void)startInteractiveTransition:(id<UIViewControllerContextTransitioning>)context
{
  self.completionCurve = UIViewAnimationCurveLinear;
  [super startInteractiveTransition:context];
  _started = YES;
  if (_releaseRequested) {
    [self finishAfterMount];
    return;
  }

  __weak auto weakSelf = self;
  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, NSEC_PER_SEC), dispatch_get_main_queue(), ^{
    [weakSelf releasePush];
  });
}

- (void)releasePush
{
  if (_releaseRequested) {
    return;
  }
  _releaseRequested = YES;
  if (_started) {
    [self finishAfterMount];
  }
}

- (void)finishAfterMount
{
  // A release may arrive during UIKit setup or while Fabric is mounting the prepared content.
  dispatch_async(dispatch_get_main_queue(), ^{
    [self finishInteractiveTransition];
  });
}

@end
