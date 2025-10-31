#ifdef RCT_NEW_ARCH_ENABLED

#import "RNSViewControllerInvalidator.h"

#import <React/RCTAssert.h>
#import <cxxreact/ReactNativeVersion.h>
#import "RNSInvalidatedComponentsRegistry.h"
#import "RNSViewControllerInvalidating.h"

@implementation RNSViewControllerInvalidator

+ (void)invalidateViewIfDetached:(UIView<RNSViewControllerInvalidating> *_Nonnull)view
                     forRegistry:(RNSInvalidatedComponentsRegistry *_Nonnull)registry
{
  // Backward compatibility for 0.82 RC or lower
  if (facebook::react::ReactNativeVersion.Minor <= 81 || facebook::react::ReactNativeVersion.Prerelease != "") {
    if (view.window == nil) {
      [view invalidateController];
    } else {
      [registry pushForInvalidation:view];
    }
  }
}

@end

#endif // RCT_NEW_ARCH_ENABLED
