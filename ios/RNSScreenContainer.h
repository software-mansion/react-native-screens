#import <React/RCTViewManager.h>

@protocol RNSScreenContainerDelegate

- (void)markChildUpdated;

@end

@protocol RNScreensViewControllerDelegate

@end

@interface RNScreensViewController : UIViewController <RNScreensViewControllerDelegate>

@end

@interface RNSScreenContainerManager : RCTViewManager

- (void)markUpdated:(UIView<RNSScreenContainerDelegate> *)screen;

@end

@interface RNSScreenContainerView : UIView <RNSScreenContainerDelegate, RCTInvalidating>

@property (nonatomic, retain) UIViewController *controller;
@property (nonatomic, retain) NSMutableSet *activeScreens;
@property (nonatomic, retain) NSMutableArray *reactSubviews;
@property (nonatomic) BOOL needUpdate;
@property (nonatomic) BOOL invalidated;
@property (nonatomic, weak) RNSScreenContainerManager *manager;

- (void)updateContainer;
- (void)maybeDismissVC;

@end
