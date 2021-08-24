
#import "RNSScreenNavigationContainer.h"
#import "RNSScreen.h"
#import "RNSScreenContainer.h"
#import "RNSScreenStack.h"

#import <React/RCTUIManager.h>
#import <React/RCTUIManagerObserverCoordinator.h>
#import <React/RCTUIManagerUtils.h>

@implementation RNScreensContainerNavigationController

@end

@implementation RNSScreenNavigationContainerView

- (instancetype)init
{
  if (self = [super init]) {
    self.controller = [[RNScreensContainerNavigationController alloc] init];
    [(RNScreensContainerNavigationController *)self.controller setNavigationBarHidden:YES animated:NO];
    // remove controller's view added by RNSScreenContainer
    [self.subviews[0] removeFromSuperview];
    [self addSubview:self.controller.view];
  }
  return self;
}

- (void)updateContainer
{
  for (RNSScreenView *screen in self.reactSubviews) {
    if (screen.activityState == RNSActivityStateOnTop) {
      // there should never be more than one screen with `RNSActivityStateOnTop`
      // since this component should be used for `tabs` and `drawer` navigators
      [(RNScreensContainerNavigationController *)self.controller setViewControllers:@[ screen.controller ] animated:NO];
      [screen notifyFinishTransitioning];
    }
  }

  [self maybeDismissVC];
}

@end

@implementation RNSScreenNavigationContainerManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
  return [[RNSScreenNavigationContainerView alloc] init];
}

@end
