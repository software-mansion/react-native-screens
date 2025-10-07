#import <UIKit/UIKit.h>
#import "RNSBottomTabsAccessoryComponentView.h"
#import "RNSBottomTabsAccessoryWrapperView.h"

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
 * Should be called after setting RNSBottomTabsAccessoryComponentView as a bottom accessory.
 */
- (void)registerForAccessoryFrameChanges;

/**
 * Notifies RNSBottomAccessoryHelper that the bottom accessory's frame has changed.
 */
- (void)notifyFrameUpdate;

- (void)invalidate;

@end

#pragma mark - Hidden from Swift

#if defined(__cplusplus)

@interface RNSBottomAccessoryHelper ()

- (void)updateState:(const react::State::Shared &)state oldState:(const react::State::Shared &)oldState;

@end

#endif // defined(__cplusplus)

NS_ASSUME_NONNULL_END
