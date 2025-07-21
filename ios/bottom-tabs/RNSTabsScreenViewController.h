#import <UIKit/UIKit.h>
#import "RNSBottomTabsScreenComponentView.h"
#import "RNSBottomTabsSpecialEffectsSupporting.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSTabsScreenViewController : UIViewController

@property (nonatomic, strong, readonly, nullable) RNSBottomTabsScreenComponentView *tabScreenComponentView;
@property (nonatomic, weak, readonly, nullable) id<RNSBottomTabsSpecialEffectsSupporting> tabsSpecialEffectsDelegate;

/**
 * Tell the controller that the tab screen it owns has got its react-props-focus changed.
 */
- (void)tabScreenFocusHasChanged;

/**
 * Tell the controller that the tab screen it owns has got its react-props related to appearance changed.
 */
- (void)tabItemAppearanceHasChanged;

/**
 * Tell the controller that the tab item related to this controller has been selected again after being presented.
 * Returns boolean indicating whether the action has been handled.
 */
- (bool)tabScreenSelectedRepeatedly;

/**
 * Set new special effects delegate.
 */
- (void)setTabsSpecialEffectsDelegate:(nonnull id<RNSBottomTabsSpecialEffectsSupporting>)delegate;

/**
 * Inform the controller about resignation from being special effects delegate. If resignation comes from current
 * tabsSpecialEffectsDelegate, this method sets tabsSpecialEffectsDelegate to nil. If tabsSpecialEffectsDelegate has
 * already changed (to other delegate or nil), this method does nothing.
 */
- (void)clearTabsSpecialEffectsDelegateIfNeeded:(nonnull id<RNSBottomTabsSpecialEffectsSupporting>)delegate;

@end

NS_ASSUME_NONNULL_END
