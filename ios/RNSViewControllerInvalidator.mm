#import "RNSViewControllerInvalidator.h"
#import <React/RCTAssert.h>
#import "RNSInvalidatedComponentsRegistry.h"
#import "RNSViewControllerInvalidating.h"

@implementation RNSViewControllerInvalidator

+ (void)invalidateViewIfDetached:(UIView<RNSViewControllerInvalidating> *)view
{
  if (view.window == nil) {
    [view invalidateController];
  } else {
    [[RNSInvalidatedComponentsRegistry invalidatedComponentsRegistry] pushForInvalidation:view];
  }
}

@end
