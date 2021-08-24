#import <React/RCTViewManager.h>

@protocol RNSScreenContainerDelegate

- (void)markChildUpdated;

@end

@protocol RNScreensViewControllerDelegate

@end

@interface RNScreensViewController : UIViewController <RNScreensViewControllerDelegate>

@end

@interface RNSScreenContainerManager : RCTViewManager

@end

@interface RNSScreenContainerView : UIView <RNSScreenContainerDelegate, RCTInvalidating>

@property (nonatomic, retain) UIViewController *controller;
@property (nonatomic, retain) NSMutableSet *activeScreens;
@property (nonatomic, retain) NSMutableArray *reactSubviews;

- (void)updateContainer;
- (void)maybeDismissVC;

@end
