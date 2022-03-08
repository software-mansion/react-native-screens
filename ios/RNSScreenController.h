#import <UIKit/UIKit.h>
#import "RNSScreenContainer.h"

@interface RNSScreenController : UIViewController <RNScreensViewControllerDelegate>

- (instancetype)initWithView:(UIView *)view;
- (void)takeSnapshot;
- (void)setViewToSnapshot;
- (void)resetViewToScreen;

- (UIViewController *)findChildVCForConfigAndTrait:(RNSWindowTrait)trait includingModals:(BOOL)includingModals;

@end
