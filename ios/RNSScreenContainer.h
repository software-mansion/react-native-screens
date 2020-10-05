#import <React/RCTViewManager.h>

@protocol RNSScreenContainerDelegate

- (void)markChildUpdated;

@end

@interface RNScreensViewController: UIViewController

@end

@interface RNSScreenContainerView : UIView <RNSScreenContainerDelegate>

@end
