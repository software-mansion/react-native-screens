#ifdef RCT_NEW_ARCH_ENABLED

#import <UIKit/UIKit.h>

#import "RNSInvalidatedComponentsRegistry.h"
#import "RNSViewControllerInvalidating.h"

@interface RNSViewControllerInvalidator : NSObject

+ (void)invalidateViewIfDetached:(UIView<RNSViewControllerInvalidating> *_Nonnull)view
                     forRegistry:(RNSInvalidatedComponentsRegistry *_Nonnull)registry;

@end

#endif // RCT_NEW_ARCH_ENABLED
