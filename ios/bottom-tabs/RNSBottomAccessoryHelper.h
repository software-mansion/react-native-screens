#import <UIKit/UIKit.h>
#import "RNSBottomTabsAccessoryComponentView.h"

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

#pragma mark - Hidden from Swift

#if RCT_NEW_ARCH_ENABLED && defined(__cplusplus)

@interface RNSBottomAccessoryHelper ()

- (void)updateState:(const react::State::Shared &)state oldState:(const react::State::Shared &)oldState;

@end

#endif // RCT_NEW_ARCH_ENABLED && defined(__cplusplus)

NS_ASSUME_NONNULL_END
