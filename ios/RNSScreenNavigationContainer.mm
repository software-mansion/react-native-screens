#import "RNSScreenNavigationContainer.h"
#import "RNSScreen.h"
#import "RNSScreenContainer.h"

@implementation RNScreensContainerNavigationController

@end

@implementation RNSScreenNavigationContainerView

- (void)setupController
{
  self.controller = [[RNScreensContainerNavigationController alloc] init];
  [(RNScreensContainerNavigationController *)self.controller setNavigationBarHidden:YES animated:NO];
  [self addSubview:self.controller.view];
}

- (void)updateContainer
{
#ifndef RN_FABRIC_ENABLED
  for (RNSScreenView *screen in self.reactSubviews) {
    if (screen.activityState == RNSActivityStateOnTop) {
      // there should never be more than one screen with `RNSActivityStateOnTop`
      // since this component should be used for `tabs` and `drawer` navigators
      [(RNScreensContainerNavigationController *)self.controller setViewControllers:@[ screen.controller ] animated:NO];
      [screen notifyFinishTransitioning];
    }
  }

  [self maybeDismissVC];
#endif
}

@end

@implementation RNSScreenNavigationContainerManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
  return [[RNSScreenNavigationContainerView alloc] init];
}

@end
