#ifdef RN_FABRIC_ENABLED
#import <React/RCTViewComponentView.h>
#import <UIKit/UIKit.h>
#else
#import <React/RCTUIManagerObserverCoordinator.h>
#import <React/RCTViewManager.h>
#endif

#import "RNSScreenContainer.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNScreensNavigationController : UINavigationController <RNScreensViewControllerDelegate>

@end

@interface RNSScreenStackView :
#ifdef RN_FABRIC_ENABLED
    RCTViewComponentView
#else
    UIView <RNSScreenContainerDelegate, RCTInvalidating>
#endif

#ifndef RN_FABRIC_ENABLED
@property (nonatomic, copy) RCTDirectEventBlock onFinishTransitioning;

- (void)markChildUpdated;
- (void)didUpdateChildren;
#endif

@end

#ifndef RN_FABRIC_ENABLED
@interface RNSScreenStackManager : RCTViewManager <RCTInvalidating>

@end
#endif

NS_ASSUME_NONNULL_END
