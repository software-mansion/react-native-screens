#pragma once

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>
#else
#import <React/RCTUIManagerObserverCoordinator.h>
#import <React/RCTViewManager.h>
#endif

#import "RNSNavigationController.h"
#import "RNSScreenContainer.h"
#import "RNSScreenStackManager.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSScrenStackManager;

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
- (void)dismissOnReload;

@property (nonatomic) BOOL customAnimation;
@property (nonatomic) BOOL disableSwipeBack;

#ifdef RCT_NEW_ARCH_ENABLED
#else
@property (nonatomic, copy) RCTDirectEventBlock onFinishTransitioning;
#endif // RCT_NEW_ARCH_ENABLED

@end

NS_ASSUME_NONNULL_END
