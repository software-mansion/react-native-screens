#pragma once

#import <Foundation/Foundation.h>

#if defined(__cplusplus)
#import <react/renderer/core/State.h>

namespace react = facebook::react;
#endif // __cplusplus

NS_ASSUME_NONNULL_BEGIN

@class RNSSplitNavigatorComponentView;

/**
 * @class RNSSplitNavigatorShadowStateProxy
 * @brief Manages communication between native UIView layout and associated React Native ShadowNode state.
 *
 * This proxy enables RNSSplitNavigatorComponentView to propagate visual and layout-level state
 * back to the Shadow Tree via RNSSplitNavigatorShadowNode.
 */
@interface RNSSplitNavigatorShadowStateProxy : NSObject

/**
 * @brief Triggers a shadow state update for the given SplitNavigator component.
 *
 * Internally uses the component's frame in UIWindow coordinates to update the Shadow Tree state.
 *
 * @param navigatorComponentView An instance of RNSSplitNavigatorComponentView whose state should be updated.
 */
- (void)updateShadowStateOfComponent:(RNSSplitNavigatorComponentView *)navigatorComponentView;

/**
 * @brief Triggers a shadow state update for the given SplitNavigator component in the context of a given ancestor
 * view.
 *
 * Converts the navigator view's local frame to coordinates of the specified ancestor view
 * before applying the update to the Shadow Tree. If the ancestor hasn't been defined frame is calculated relatively to
 * the UIWindow.
 *
 * @param navigatorComponentView An instance of RNSSplitNavigatorComponentView whose state should be updated.
 * @param ancestorView An optional UIView in whose coordinate space the frame should be computed.
 */
- (void)updateShadowStateOfComponent:(RNSSplitNavigatorComponentView *)navigatorComponentView
             inContextOfAncestorView:(UIView *_Nullable)ancestorView;

/**
 * @brief Send an update to ShadowNode state with given frame if needed.
 *
 * Updates size and origin in the ShadowNode state, if changed.
 *
 * @param frame A CGRect defining the component's layout metrics.
 */
- (void)updateShadowStateWithFrame:(CGRect)frame;

@end

#pragma mark - Hidden from Swift

#if defined(__cplusplus)

@interface RNSSplitNavigatorShadowStateProxy ()

- (void)updateState:(react::State::Shared const &)state oldState:(react::State::Shared const &)oldState;

@end

#endif // __cplusplus
NS_ASSUME_NONNULL_END
