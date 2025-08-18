#ifdef RCT_NEW_ARCH_ENABLED

#import "RNSViewControllerInvalidator.h"

#import <React/RCTAssert.h>
#import "RNSInvalidatedComponentsRegistry.h"
#import "RNSViewControllerInvalidating.h"

@implementation RNSViewControllerInvalidator

+ (void)invalidateViewIfDetached:(UIView<RNSViewControllerInvalidating> *_Nonnull)view
                     forRegistry:(RNSInvalidatedComponentsRegistry *_Nonnull)registry
{
  if (view.window == nil) {
    [view invalidateController];
  } else {
    [registry pushForInvalidation:view];
  }
}

@end

#endif // RCT_NEW_ARCH_ENABLED
