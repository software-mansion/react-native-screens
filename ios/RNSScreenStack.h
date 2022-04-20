#import <React/RCTUIManagerObserverCoordinator.h>
#import <React/RCTViewManager.h>

#import "RNSScreenContainer.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNScreensNavigationController : UINavigationController <RNScreensViewControllerDelegate>

@end

@interface RNSScreenStackView : UIView <RNSScreenContainerDelegate, RCTInvalidating>

@property (nonatomic, copy) RCTDirectEventBlock onFinishTransitioning;

- (void)markChildUpdated;
- (void)didUpdateChildren;

@end

@interface RNSScreenStackManager : RCTViewManager <RCTInvalidating>

@end

NS_ASSUME_NONNULL_END
