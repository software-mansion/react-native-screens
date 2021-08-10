
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

- (instancetype)initWithManager:(RNSScreenNavigationContainerManager *)manager
{
  if (self = [super init]) {
    self.reactSubviews = [NSMutableArray new];
    self.controller = [[RNScreensContainerNavigationController alloc] init];
    [(RNScreensContainerNavigationController *)self.controller setNavigationBarHidden:YES animated:NO];
    self.needUpdate = NO;
    self.invalidated = NO;
    self.manager = manager;
    [self addSubview:self.controller.view];
  }
  return self;
}

- (void)updateContainer
{
  self.needUpdate = NO;

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
  return [[RNSScreenNavigationContainerView alloc] initWithManager:self];
}

@end
