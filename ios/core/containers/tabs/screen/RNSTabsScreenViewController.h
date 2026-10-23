#pragma once

#import <UIKit/UIKit.h>
#import "RNSContainerItem.h"
#import "RNSTabsContainerItemConfigProviding.h"
#import "RNSTabsSpecialEffectsSupporting.h"

#if !TARGET_OS_TV
#import "RNSOrientationProviding.h"
#endif // !TARGET_OS_TV

NS_ASSUME_NONNULL_BEGIN

@class RNSTabsScreenViewController;

/**
 * Receives the appearance lifecycle of a tab screen from its controller.
 */
@protocol RNSTabsScreenViewControllerDelegate <NSObject>

- (void)viewControllerViewWillAppear:(RNSTabsScreenViewController *)controller;
- (void)viewControllerViewDidAppear:(RNSTabsScreenViewController *)controller;
- (void)viewControllerViewWillDisappear:(RNSTabsScreenViewController *)controller;
- (void)viewControllerViewDidDisappear:(RNSTabsScreenViewController *)controller;

@end

@interface RNSTabsScreenViewController : UIViewController <RNSContainerItem
#if !TARGET_OS_TV
                                                           ,
                                                           RNSOrientationProviding
#endif // !TARGET_OS_TV
                                                           >

/**
 * The view of this controller, as the provider of the tab screen data.
 */
@property (nonatomic, readonly, nullable) UIView<RNSTabsContainerItemConfigProviding> *configProvider;
@property (nonatomic, weak, readonly, nullable) id<RNSTabsSpecialEffectsSupporting> tabsSpecialEffectsDelegate;
@property (nonatomic, weak, nullable) id<RNSTabsScreenViewControllerDelegate> delegate;

/**
 * Tell the controller that the tab screen it owns has got its react-props related to appearance changed.
 */
- (void)tabItemAppearanceHasChanged;

/**
 * Tell the controller that the tab screen it owns has got its react-props-orientation changed.
 */
- (void)tabScreenOrientationHasChanged;

/**
 * Tell the controller that the tab item related to this controller has been selected again after being presented.
 * Returns boolean indicating whether the action has been handled.
 */
- (bool)tabScreenSelectedRepeatedly;

/**
 * Set new special effects delegate.
 */
- (void)setTabsSpecialEffectsDelegate:(nonnull id<RNSTabsSpecialEffectsSupporting>)delegate;

/**
 * Inform the controller about resignation from being special effects delegate. If resignation comes from current
 * tabsSpecialEffectsDelegate, this method sets tabsSpecialEffectsDelegate to nil. If tabsSpecialEffectsDelegate has
 * already changed (to other delegate or nil), this method does nothing.
 */
- (void)clearTabsSpecialEffectsDelegateIfNeeded:(nonnull id<RNSTabsSpecialEffectsSupporting>)delegate;

@end

@interface RNSTabsScreenViewController (TabsScreenPropsForwarding)

- (nullable NSString *)getScreenKeyOrNull;

- (BOOL)isPreventNativeSelectionEnabled;

@end

NS_ASSUME_NONNULL_END
