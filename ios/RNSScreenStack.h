#pragma once

#import "RNSReactBaseView.h"
#import "RNSScreenContainer.h"
#import "RNSTabsSpecialEffectsSupporting.h"

#if !TARGET_OS_TV
#import "RNSOrientationProviding.h"
#endif // !TARGET_OS_TV

NS_ASSUME_NONNULL_BEGIN

@interface RNSNavigationController : UINavigationController <
                                         RNSViewControllerDelegate,
                                         RNSTabsSpecialEffectsSupporting
#if !TARGET_OS_TV
                                         ,
                                         RNSOrientationProviding
#endif // !TARGET_OS_TV
                                         >

@end

@interface RNSScreenStackView : RNSReactBaseView <RNSScreenContainerDelegate>

- (void)markChildUpdated;
- (void)didUpdateChildren;
- (void)startScreenTransition;
- (void)updateScreenTransition:(double)progress;
- (void)finishScreenTransition:(BOOL)canceled;

@property (nonatomic) BOOL customAnimation;
@property (nonatomic) BOOL disableSwipeBack;

@property (nonatomic, readwrite) BOOL iosPreventReattachmentOfDismissedScreens;
@property (nonatomic, readwrite) BOOL iosPreventReattachmentOfDismissedModals;

@end

#pragma mark-- Integration

@interface RNSScreenStackView ()

/**
 * \return Arrray with ids of screens owned by this stack. Ids are returned in no particular order. The list might be
 * empty. The strings inside the list are nullable if the screen has not been assigned an ID.
 */
@property (nonatomic, readonly, nonnull) NSArray<NSString *> *screenIds;

@property (nonatomic, strong, readonly, nullable) UIColor *nativeContainerBackgroundColor;

@end

@interface RNSScreenStackManager : RCTViewManager

@end

NS_ASSUME_NONNULL_END
