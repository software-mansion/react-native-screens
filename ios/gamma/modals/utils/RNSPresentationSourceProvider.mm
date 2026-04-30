#import "RNSPresentationSourceProvider.h"
#import <React/RCTAssert.h>

@implementation RNSPresentationSourceProvider

+ (nullable UIViewController *)findViewControllerForPresentationInWindow:(nullable UIWindow *)window
                                                      ignoringController:(nullable UIViewController *)ignoringController
{
  if (window == nil) {
    return nil;
  }

  UIViewController *presentationSourceViewController = window.rootViewController;

  RCTAssert(
      presentationSourceViewController != nil,
      @"[RNScreens] Root View Controller should not be nil when trying to present a modal.");

  if (presentationSourceViewController == nil) {
    return nil;
  }

  while (presentationSourceViewController.presentedViewController != nil &&
         presentationSourceViewController.presentedViewController != ignoringController) {
    presentationSourceViewController = presentationSourceViewController.presentedViewController;
  }

  return presentationSourceViewController;
}

@end
