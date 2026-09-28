#pragma once

#import "RNSDefines.h"
#import "RNSReactBaseView.h"
#import "RNSScreenContainer.h"
#import "RNSTabsSpecialEffectsSupporting.h"

#if !TARGET_OS_TV
#import "RNSOrientationProviding.h"
#endif // !TARGET_OS_TV

#if RNS_IPHONE_OS_VERSION_AVAILABLE(27_0) && !TARGET_OS_TV
#import "RNSNavigationBar.h"
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(27_0) && !TARGET_OS_TV

NS_ASSUME_NONNULL_BEGIN

@interface RNSNavigationController : UINavigationController <RNSViewControllerDelegate,
                                                             RNSTabsSpecialEffectsSupporting
#if !TARGET_OS_TV
                                                             ,
                                                             RNSOrientationProviding
#endif // !TARGET_OS_TV
#if RNS_IPHONE_OS_VERSION_AVAILABLE(27_0) && !TARGET_OS_TV
                                                             ,
                                                             RNSNavigationBarLayoutDelegate
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(27_0) && !TARGET_OS_TV
                                                             >

#if RNS_IPHONE_OS_VERSION_AVAILABLE(27_0) && !TARGET_OS_TV
/**
 * Should be called whenever the layout of the navigation bar's subviews might have changed without
 * the navigation bar's frame changing (iOS 27 bar minimization). Notifies the top screen about
 * the header height change.
 */
- (void)navigationBarContentDidChangeLayout;
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(27_0) && !TARGET_OS_TV

@end

@interface RNSScreenStackView : RNSReactBaseView <RNSScreenContainerDelegate>

- (void)markChildUpdated;
- (void)didUpdateChildren;
- (void)startScreenTransition;
- (void)updateScreenTransition:(double)progress;
- (void)finishScreenTransition:(BOOL)canceled;

@property (nonatomic) BOOL customAnimation;
@property (nonatomic) BOOL disableSwipeBack;

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

#if defined(__cplusplus)
@interface RNSScreenStackManager : RCTViewManager
#else
@interface RNSScreenStackManager : NSObject
#endif // __cplusplus

@end

NS_ASSUME_NONNULL_END
