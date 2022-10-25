#import <RNScreens/RNSScreen.h>
#import <RNScreens/RNSSharedElementAnimatorDelegateMock.h>

@implementation RNSSharedElementAnimatorDelegateMock

- (void)onScreenTransitionCreate:(id)screen_
{
  RNSScreen *screen = screen_;
  if (screen.transitionCoordinator != nil) {
    screen.fakeView.alpha = 0.0;
    [screen.transitionCoordinator
        animateAlongsideTransition:^(id<UIViewControllerTransitionCoordinatorContext> _Nonnull context) {
          [[context containerView] addSubview:screen.fakeView];
          screen.fakeView.alpha = 1.0;
          screen.animationTimer = [CADisplayLink displayLinkWithTarget:screen selector:@selector(handleAnimation)];
          [screen.animationTimer addToRunLoop:[NSRunLoop currentRunLoop] forMode:NSDefaultRunLoopMode];
        }
        completion:^(id<UIViewControllerTransitionCoordinatorContext> _Nonnull context) {
          [screen.animationTimer setPaused:YES];
          [screen.animationTimer invalidate];
          [screen.fakeView removeFromSuperview];
        }];
  }
}

- (void)onNativeAnimationEnd:(UIView *)screeen
{
}

- (void)onScreenRemoving:(UIView *)screen
{
}

@end
