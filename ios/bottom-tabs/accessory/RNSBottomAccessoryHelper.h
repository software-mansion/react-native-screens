#import <RNSDefines.h>

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV && !TARGET_OS_VISION

#import <UIKit/UIKit.h>
#include <cxxreact/ReactNativeVersion.h>
#import "RNSBottomTabsAccessoryComponentView.h"
#import "RNSBottomTabsAccessoryContentComponentView.h"
#import "RNSEnums.h"

#if defined(__cplusplus)
#import <react/renderer/core/State.h>

namespace react = facebook::react;
#endif // defined(__cplusplus)

NS_ASSUME_NONNULL_BEGIN

/**
 * @class RNSBottomAccessoryHelper
 * @brief Class responsible for state synchronization between Host and ShadowTree for
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

#if RCT_NEW_ARCH_ENABLED && REACT_NATIVE_VERSION_MINOR >= 82

/**
 * Due to *synchonous* events not being actually *synchronous*, we are unable to handle layout modifications
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

- (void)handleContentViewVisibilityForEnvironmentIfNeeded;

@end

#endif // RCT_NEW_ARCH_ENABLED && REACT_NATIVE_VERSION_MINOR >= 82

#pragma mark - Hidden from Swift

#if RCT_NEW_ARCH_ENABLED && defined(__cplusplus)

@interface RNSBottomAccessoryHelper ()

- (void)updateState:(const react::State::Shared &)state oldState:(const react::State::Shared &)oldState;

@end

#endif // RCT_NEW_ARCH_ENABLED && defined(__cplusplus)

NS_ASSUME_NONNULL_END

#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV && !TARGET_OS_VISION
