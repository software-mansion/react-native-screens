#pragma once

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>
#else
#import <React/RCTUIManagerObserverCoordinator.h>
#import <React/RCTViewManager.h>
#endif

#import "RNSBottomTabsSpecialEffectsSupporting.h"
#import "RNSScreenContainer.h"

#if !TARGET_OS_TV
#import "RNSOrientationProviding.h"
#endif // !TARGET_OS_TV

NS_ASSUME_NONNULL_BEGIN

@interface RNSNavigationController : UINavigationController <
                                         RNSViewControllerDelegate,
                                         RNSBottomTabsSpecialEffectsSupporting
#if !TARGET_OS_TV
                                         ,
                                         RNSOrientationProviding
#endif // !TARGET_OS_TV
                                         >

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

@property (nonatomic, readwrite) BOOL iosPreventReattachmentOfDismissedScreens;

#ifdef RCT_NEW_ARCH_ENABLED
#else
@property (nonatomic, copy) RCTDirectEventBlock onFinishTransitioning;
#endif // RCT_NEW_ARCH_ENABLED

@end

#pragma mark-- Integration

@interface RNSScreenStackView ()

/**
 * \return Arrray with ids of screens owned by this stack. Ids are returned in no particular order. The list might be
 * empty. The strings inside the list are nullable if the screen has not been assigned an ID.
 */
@property (nonatomic, readonly, nonnull) NSArray<NSString *> *screenIds;

@end

@interface RNSScreenStackManager : RCTViewManager <RCTInvalidating>

@end

NS_ASSUME_NONNULL_END
