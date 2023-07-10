#import "RNSScreen+RNSScreenHeaderHeight.h"

@implementation RNSScreen (RNSScreenHeaderHeight)

- (void)viewDidLayoutSubviews
{
  [super viewDidLayoutSubviews];

  if (self.screenView.isPresentedAsNativeModal) {
    [self recalculateHeaderHeightIsModal:YES];
  }
}

- (void)dismissViewControllerAnimated:(BOOL)flag completion:(void (^)())completion
{
  [super dismissViewControllerAnimated:flag completion:completion];
  BOOL isPresentedAsNativeModal = self.screenView.isPresentedAsNativeModal;

  [self recalculateHeaderHeightIsModal:isPresentedAsNativeModal];
}

- (CGFloat)getCalculatedHeaderHeight:(BOOL)isModal
{
  CGFloat navbarHeight = self.navigationController.navigationBar.frame.size.height;

  // In case where screen is a full screen modal, we want to calculate it's childViewController's height
  if (self.isFullscreenModal && self.childViewControllers.count > 0 && self.childViewControllers[0] != nil) {
    UINavigationController *childNavCtr = self.childViewControllers[0];
    navbarHeight = childNavCtr.navigationBar.frame.size.height;
  }

  return navbarHeight;
}

- (void)recalculateHeaderHeightIsModal:(BOOL)isModal
{
  if (self.isTransparentModal) {
    [self.screenView notifyHeaderHeightChange:0];
    return;
  }

  CGFloat navbarHeight = [self getCalculatedHeaderHeight:isModal];
  CGSize statusBarSize;

  if (@available(iOS 13.0, *)) {
    statusBarSize = self.view.window.windowScene.statusBarManager.statusBarFrame.size;
  } else {
    statusBarSize = [[UIApplication sharedApplication] statusBarFrame].size;
  }

  // Unfortunately, UIKit doesn't care about switching width and height options on screen rotation.
  // We should check if user has rotated its screen, so we're choosing the minimum value between the
  // width and height.
  CGFloat statusBarHeight = MIN(statusBarSize.width, statusBarSize.height);
  CGFloat summarizedHeight = navbarHeight + statusBarHeight;
  [self.screenView notifyHeaderHeightChange:summarizedHeight];
}

- (BOOL)isTransparentModal
{
  return self.modalPresentationStyle == UIModalPresentationOverFullScreen;
}

- (BOOL)isFullscreenModal
{
  switch (self.modalPresentationStyle) {
    case UIModalPresentationFullScreen:
    case UIModalPresentationCurrentContext:
    case UIModalPresentationOverCurrentContext:
      return true;
    default:
      return false;
  }
}

@end
