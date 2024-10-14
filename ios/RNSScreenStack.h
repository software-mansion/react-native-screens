#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>
#else
#import <React/RCTUIManagerObserverCoordinator.h>
#import <React/RCTViewManager.h>
#endif

#import "RNSScreenContainer.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSNavigationController : UINavigationController <RNSViewControllerDelegate>

/// @returns `YES`  when this view controller was created as a part of native stack view.
/// Subclasses such as `RNSContainerNavigationController` should override this method.
///
/// Note that this is a temporary workaround needed to perform some assertions. When it becomes
/// obselete it should be removed.
- (BOOL)isNativeStackViewController;

@end

@interface RNSScreenStackView :
#ifdef RCT_NEW_ARCH_ENABLED
    RCTViewComponentView <RNSScreenContainerDelegate>
#else
    UIView <RNSScreenContainerDelegate, RCTInvalidating>
#endif

- (void)markChildUpdated;
- (void)didUpdateChildren;
- (void)startScreenTransition;
- (void)updateScreenTransition:(double)progress;
- (void)finishScreenTransition:(BOOL)canceled;

@property (nonatomic) BOOL customAnimation;
@property (nonatomic) BOOL disableSwipeBack;

#ifdef RCT_NEW_ARCH_ENABLED
#else
@property (nonatomic, copy) RCTDirectEventBlock onFinishTransitioning;
#endif // RCT_NEW_ARCH_ENABLED

@end

@interface RNSScreenStackManager : RCTViewManager <RCTInvalidating>

@end

NS_ASSUME_NONNULL_END
