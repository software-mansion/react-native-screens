#import <UIKit/UIKit.h>
#import "RNSScreenContainer.h"

@interface RNSScreenController : UIViewController <RNScreensViewControllerDelegate>

- (instancetype)initWithView:(UIView *)view;
- (void)setViewToSnapshot:(UIView *)snapshot;
- (void)resetViewToScreen;

- (UIViewController *)findChildVCForConfigAndTrait:(RNSWindowTrait)trait includingModals:(BOOL)includingModals;

@end
