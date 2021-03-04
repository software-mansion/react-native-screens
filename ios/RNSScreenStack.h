#import <React/RCTViewManager.h>
#import <React/RCTUIManagerObserverCoordinator.h>

#import "RNSScreenContainer.h"
#import "RNSScreen.h"

@interface RNScreensNavigationController: UINavigationController <RNScreensViewControllerDelegate>

@end

@interface RNSScreenStackView : UIView <RNSScreenContainerDelegate, RCTInvalidating>

@property (nonatomic, copy) RCTDirectEventBlock onFinishTransitioning;
@property (nonatomic, copy) RNSScreenView *topScreenView;
@property (nonatomic, copy) RNSScreenView *belowScreenView;
@property (nonatomic, copy) CADisplayLink *animationTimer;

- (void)markChildUpdated;
- (void)didUpdateChildren;

@end

@interface RNSScreenStackManager : RCTViewManager <RCTInvalidating>

@end
