#import <React/RCTViewManager.h>

@protocol RNSScreenContainerDelegate

- (void)markChildUpdated;

@end

@protocol RNScreensViewControllerDelegate

@end

@interface RNScreensViewController : UIViewController <RNScreensViewControllerDelegate>

- (UIViewController *)findActiveChildVC;

@end

@interface RNSScreenContainerView : UIView <RNSScreenContainerDelegate>

@end
