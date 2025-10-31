#import <UIKit/UIKit.h>
#import "RNSViewControllerInvalidating.h"

#if RCT_NEW_ARCH_ENABLED

@interface RNSInvalidatedComponentsRegistry : NSObject

- (void)pushForInvalidation:(UIView<RNSViewControllerInvalidating> *)view;
- (void)flushInvalidViews;

@end

#endif // RCT_NEW_ARCH_ENABLED
