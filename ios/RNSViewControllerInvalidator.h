#import <UIKit/UIKit.h>

@interface RNSViewControllerInvalidator : NSObject

+ (void)invalidateViewIfDetached:(UIView *)view;

@end
