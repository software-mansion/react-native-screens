#ifdef RCT_NEW_ARCH_ENABLED

#import <UIKit/UIKit.h>
#import "RNSViewControllerInvalidating.h"

@interface RNSInvalidatedComponentsRegistry : NSObject

- (void)pushForInvalidation:(UIView<RNSViewControllerInvalidating> *)view;
- (void)flushInvalidViews;

@end

#endif // RCT_NEW_ARCH_ENABLED
