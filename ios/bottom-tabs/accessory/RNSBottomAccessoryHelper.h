#pragma once

#import "RNSDefines.h"

#if RNS_BOTTOM_ACCESSORY_AVAILABLE

#import <UIKit/UIKit.h>
#import "RNSBottomTabsAccessoryComponentView.h"
#import "RNSBottomTabsAccessoryContentComponentView.h"
#import "RNSEnums.h"

NS_ASSUME_NONNULL_BEGIN

/**
 * @class RNSBottomAccessoryHelper
 * @brief Class responsible for managing accessory size and environment changes for
 * RNSBottomTabsAccessoryComponentView.
 */
API_AVAILABLE(ios(26.0))
@interface RNSBottomAccessoryHelper : NSObject

- (instancetype)initWithBottomAccessoryView:(RNSBottomTabsAccessoryComponentView *)bottomAccessoryView;

/**
 * Registers KVO for frames of UIKit's bottom accessory wrapper view.
 * It must be called after `RNSBottomTabsAccessoryComponentView` or its ancestor is set as `bottomAccessory` on
 * `RNSTabBarController`.
 */
- (void)registerForAccessoryFrameChanges;
/**
 * Invalidates observers, display link (if it is used); resets internal properties.
 */
- (void)invalidate;

@end

#pragma mark - Content view switching workaround

#if defined(__cplusplus) && REACT_NATIVE_VERSION_MINOR >= 82

/**
 * Due to *synchronous* events not being actually *synchronous*, we are unable to handle layout modifications
 * in reaction to environment change (e.g. subviews being mounted/unmounted; changes to size/origin are synchronous
 * thanks to synchronous state updates and work correctly).
 * In order to mitigate this, we introduced a workaround approach: 2 views are rendered all the time on top of each
 * other. One is for `regular` environment and the second one is for `inline` environment. When environment changes, we
 * swap which view is actually visible by changing opacity.
 */
@interface RNSBottomAccessoryHelper ()

/**
 * Allows to set which `RNSBottomTabsAccessoryContentComponentView` instance should be visible
 * for which accessory environment.
 */
- (void)setContentView:(nullable RNSBottomTabsAccessoryContentComponentView *)contentView
        forEnvironment:(RNSBottomTabsAccessoryEnvironment)environment;

/**
 * If `contentView` is set for both environments, sets opacity according to current tab accessory `environent`.
 * Otherwise, it is a no-op.
 */
- (void)handleContentViewVisibilityForEnvironmentIfNeeded;

@end

#endif // defined(__cplusplus) && REACT_NATIVE_VERSION_MINOR >= 82

NS_ASSUME_NONNULL_END

#endif // RNS_BOTTOM_ACCESSORY_AVAILABLE
