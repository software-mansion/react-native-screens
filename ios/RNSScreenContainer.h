#import <React/RCTViewManager.h>

NS_ASSUME_NONNULL_BEGIN

@protocol RNSScreenContainerDelegate

- (void)markChildUpdated;
- (void)updateContainer;

@end

@protocol RNScreensViewControllerDelegate

@end

@interface RNScreensViewController : UIViewController <RNScreensViewControllerDelegate>

- (UIViewController *)findActiveChildVC;

@end

@interface RNSScreenContainerManager : RCTViewManager

@end

@interface RNSScreenContainerView : UIView <RNSScreenContainerDelegate, RCTInvalidating>

@property (nonatomic, retain) UIViewController *controller;
@property (nonatomic, retain) NSMutableArray *reactSubviews;

- (void)maybeDismissVC;

@end

NS_ASSUME_NONNULL_END
