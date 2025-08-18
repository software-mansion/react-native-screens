#import <UIKit/UIKit.h>
#import "RNSViewControllerInvalidating.h"

@interface RNSInvalidatedComponentsRegistry : NSObject

- (void)pushForInvalidation:(UIView<RNSViewControllerInvalidating> *)view;
- (void)flushInvalidViews;

@end
