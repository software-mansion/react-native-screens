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
- (void)validateContainmentOfPresentedView:(UIView *)presentedView
{
  if (presentedView == nil || presentedView.window == nil || self.window == nil) {
    return;
  }

  UIView *containerView = presentedView.superview;
  if (containerView == nil) {
    return;
  }

  if (containerView.superview != self || !CGRectEqualToRect(containerView.frame, self.bounds)) {
    RNSLogE(
        @"ContainedModal presentation container escaped its provider (container: %@ in %@, provider bounds: %@). UIKit's context attach-point contract may have changed on this OS version.",
        NSStringFromCGRect(containerView.frame),
        NSStringFromClass([containerView.superview class]),
        NSStringFromCGRect(self.bounds));
  }
}
#endif

@end
