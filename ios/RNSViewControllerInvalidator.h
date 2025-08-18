#import <UIKit/UIKit.h>

#import "RNSViewControllerInvalidating.h"

@interface RNSViewControllerInvalidator : NSObject

+ (void)invalidateViewIfDetached:(UIView<RNSViewControllerInvalidating> *)view;

@end
