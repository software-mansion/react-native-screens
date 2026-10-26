#import "RNSContainedModalProviderView.h"
#import "RNSContainedModalProviderController.h"
#import "RNSLog.h"

@implementation RNSContainedModalProviderView

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    self.backgroundColor = [UIColor clearColor];
    // Tracks whatever the owner embeds it in between explicit layout passes.
    self.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;

    _contextViewController = [[RNSContainedModalProviderController alloc] init];
    UIView *contextView = _contextViewController.view;
    contextView.frame = self.bounds;
    [self insertSubview:contextView atIndex:0];
  }
  return self;
}

- (void)layoutSubviews
{
  [super layoutSubviews];
  _contextViewController.view.frame = self.bounds;
}

#pragma mark - Context controller containment

- (void)attachContextControllerToParentViewController:(UIViewController *)parentViewController
{
  if (_contextViewController.parentViewController == parentViewController) {
    return;
  }
  [self detachContextControllerFromParentViewController];

  [parentViewController addChildViewController:_contextViewController];
  [_contextViewController didMoveToParentViewController:parentViewController];
}

- (void)detachContextControllerFromParentViewController
{
  if (_contextViewController.parentViewController == nil) {
    return;
  }

  [_contextViewController willMoveToParentViewController:nil];
  [_contextViewController removeFromParentViewController];
}

#if DEBUG
// The owner's bounds come from Fabric's float layout metrics while UIKit
// autoresizes the container in double precision, so after a rotation the two
// can differ by a sub-pixel fraction. Compare on the pixel grid. (Core stays
// React-free, hence no `react::floatEquality` here.)
static BOOL RNSRectsEqualWithinPixel(CGRect lhs, CGRect rhs, CGFloat screenScale)
{
  const CGFloat tolerance = 1.0 / MAX(screenScale, 1.0);
  return fabs(lhs.origin.x - rhs.origin.x) < tolerance && fabs(lhs.origin.y - rhs.origin.y) < tolerance &&
      fabs(lhs.size.width - rhs.size.width) < tolerance && fabs(lhs.size.height - rhs.size.height) < tolerance;
}

- (void)validateContainmentOfPresentedView:(UIView *)presentedView
{
  if (presentedView == nil || presentedView.window == nil || self.window == nil) {
    return;
  }

  UIView *containerView = presentedView.superview;
  if (containerView == nil) {
    return;
  }

  if (containerView.superview != self ||
      !RNSRectsEqualWithinPixel(containerView.frame, self.bounds, self.window.screen.scale)) {
    RNSLogE(
        @"ContainedModal presentation container escaped its provider (container: %@ in %@, provider bounds: %@). UIKit's context attach-point contract may have changed on this OS version.",
        NSStringFromCGRect(containerView.frame),
        NSStringFromClass([containerView.superview class]),
        NSStringFromCGRect(self.bounds));
  }
}
#endif

@end
