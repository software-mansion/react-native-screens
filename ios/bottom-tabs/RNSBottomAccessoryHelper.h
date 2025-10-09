#import <UIKit/UIKit.h>
#import "RNSBottomTabsAccessoryComponentView.h"

#if defined(__cplusplus)
#import <react/renderer/core/State.h>

namespace react = facebook::react;
#endif // defined(__cplusplus)

NS_ASSUME_NONNULL_BEGIN

API_AVAILABLE(ios(26.0))
@interface RNSBottomAccessoryHelper : NSObject

- (instancetype)initWithBottomAccessoryView:(RNSBottomTabsAccessoryComponentView *)bottomAccessoryView;

/**
 * Registers KVO for frames of UIKit's bottom accessory wrapper view.
 */
- (void)registerForAccessoryFrameChanges;

- (void)invalidate;

@end

#pragma mark - Hidden from Swift

#if RCT_NEW_ARCH_ENABLED && defined(__cplusplus)

@interface RNSBottomAccessoryHelper ()

- (void)updateState:(const react::State::Shared &)state oldState:(const react::State::Shared &)oldState;

@end

#endif // RCT_NEW_ARCH_ENABLED && defined(__cplusplus)

NS_ASSUME_NONNULL_END
