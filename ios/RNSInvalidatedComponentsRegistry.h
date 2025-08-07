#import <UIKit/UIKit.h>
#import "RNSViewControllerInvalidating.h"

@interface RNSInvalidatedComponentsRegistry : NSObject

+ (instancetype)invalidatedComponentsRegistry;

- (void)pushForInvalidation:(UIView<RNSViewControllerInvalidating> *)view;
- (void)flushInvalidViews;

@end
