#import <UIKit/UIKit.h>
#import "RNSScreenContainer.h"

//@interface RNSScreen : UIViewController <RNScreensViewControllerDelegate>
//
//- (instancetype)initWithView:(UIView *)view;
//- (void)notifyFinishTransitioning;
//- (UIViewController *)findChildVCForConfigAndTrait:(RNSWindowTrait)trait includingModals:(BOOL)includingModals;
//
//@end

@interface RNSScreenController : UIViewController <RNScreensViewControllerDelegate>

- (instancetype)initWithView:(UIView *)view;
- (UIViewController *)findChildVCForConfigAndTrait:(RNSWindowTrait)trait includingModals:(BOOL)includingModals;

#if RN_FABRIC_ENABLED
- (void)setViewToSnapshot:(UIView *)snapshot;
- (void)resetViewToScreen;
#else
- (void)notifyFinishTransitioning;
#endif

@end
