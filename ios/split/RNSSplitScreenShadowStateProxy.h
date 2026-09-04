#pragma once

#import <Foundation/Foundation.h>

#if defined(__cplusplus)
#import <react/renderer/core/State.h>

namespace react = facebook::react;
#endif // __cplusplus

NS_ASSUME_NONNULL_BEGIN

/**
 * @class RNSSplitScreenShadowStateProxy
 * @brief Manages communication between native UIView layout and associated React Native ShadowNode state.
 *
 * This proxy enables RNSSplitScreenComponentView to propagate visual and layout-level state
 * back to the Shadow Tree via RNSSplitScreenShadowNode.
 */
@interface RNSSplitScreenShadowStateProxy : NSObject

/**
 * @brief Send an update to ShadowNode state with given layout metrics.
 *
 * Updates size and origin in the ShadowNode state, if changed.
 *
 * @param frame A CGRect defining the component's layout metrics.
 */
- (void)updateShadowStateWithFrame:(CGRect)frame;

@end

#pragma mark - Hidden from Swift

#if defined(__cplusplus)

@interface RNSSplitScreenShadowStateProxy ()

- (void)updateState:(react::State::Shared const &)state oldState:(react::State::Shared const &)oldState;

@end

#endif // __cplusplus
NS_ASSUME_NONNULL_END
