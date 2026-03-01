#pragma once

#import "RNSDefines.h"

#if RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE

#import <UIKit/UIKit.h>
#import "RNSEnums.h"
#import "RNSTabsBottomAccessoryComponentView.h"
#import "RNSTabsBottomAccessoryContentComponentView.h"

NS_ASSUME_NONNULL_BEGIN

/**
 * @class RNSTabsBottomAccessoryHelper
 * @brief Class responsible for managing accessory size and environment changes for
 * RNSTabsBottomAccessoryComponentView.
 */
API_AVAILABLE(ios(26.0))
@interface RNSTabsBottomAccessoryHelper : NSObject

- (instancetype)initWithBottomAccessoryView:(RNSTabsBottomAccessoryComponentView *)bottomAccessoryView;

/**
 * Registers KVO for frames of UIKit's bottom accessory wrapper view.
 * It must be called after `RNSTabsBottomAccessoryComponentView` or its ancestor is set as `bottomAccessory` on
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
@interface RNSTabsBottomAccessoryHelper ()

/**
 * Allows to set which `RNSTabsBottomAccessoryContentComponentView` instance should be visible
 * for which accessory environment.
 */
- (void)setContentView:(nullable RNSTabsBottomAccessoryContentComponentView *)contentView
        forEnvironment:(RNSTabsBottomAccessoryEnvironment)environment;

/**
 * If `contentView` is set for both environments, sets opacity according to current tab accessory `environent`.
 * Otherwise, it is a no-op.
 */
- (void)handleContentViewVisibilityForEnvironmentIfNeeded;

@end

#endif // defined(__cplusplus) && REACT_NATIVE_VERSION_MINOR >= 82

NS_ASSUME_NONNULL_END

#endif // RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE
