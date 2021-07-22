#import <React/RCTUIManagerObserverCoordinator.h>
#import <React/RCTViewManager.h>

#import "RNSScreenContainer.h"

@interface RNScreensNavigationController : UINavigationController <RNScreensViewControllerDelegate>

@property (nonatomic) BOOL additionalInsetSet;
@property (nonatomic) CGFloat additionalTopInset;

@end

@interface RNSScreenStackView : UIView <RNSScreenContainerDelegate, RCTInvalidating>

@property (nonatomic, copy) RCTDirectEventBlock onFinishTransitioning;

- (void)markChildUpdated;
- (void)didUpdateChildren;

@end

@interface RNSScreenStackManager : RCTViewManager <RCTInvalidating>

@end
