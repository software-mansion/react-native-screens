#import "RNSViewControllerInvalidator.h"
#import <React/RCTAssert.h>
#import "RNSInvalidatedComponentsRegistry.h"
#import "RNSViewControllerInvalidating.h"

@implementation RNSViewControllerInvalidator

+ (void)invalidateViewIfDetached:(UIView *)view
{
  RCTAssert(
      [view conformsToProtocol:@protocol(RNSViewControllerInvalidating)],
      @"[RNScreens] View of type: %@ doesn't conform to RNSViewControllerInvalidating",
      view.class);

  UIView<RNSViewControllerInvalidating> *invalidationTarget = (UIView<RNSViewControllerInvalidating> *)view;

  if (invalidationTarget.window == nil) {
    [invalidationTarget invalidateController];
  } else {
    [[RNSInvalidatedComponentsRegistry invalidatedComponentsRegistry] pushForInvalidation:invalidationTarget];
  }
}

@end
