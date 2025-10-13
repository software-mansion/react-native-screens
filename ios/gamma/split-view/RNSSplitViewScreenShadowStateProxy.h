#import <Foundation/Foundation.h>

#if defined(__cplusplus)
#import <react/renderer/core/State.h>

namespace react = facebook::react;
#endif // __cplusplus

NS_ASSUME_NONNULL_BEGIN

@class RNSSplitViewScreenComponentView;

/**
 * @class RNSSplitViewScreenShadowStateProxy
 * @brief Manages communication between native UIView layout and associated React Native ShadowNode state.
 *
 * This proxy enables RNSSplitViewScreenComponentView to propagate visual and layout-level state
 * back to the Shadow Tree via RNSSplitViewScreenShadowNode.
 */
@interface RNSSplitViewScreenShadowStateProxy : NSObject

/**
 * @brief Triggers a shadow state update for the given SplitViewScreen component.
 *
 * Internally uses the component’s frame in UIWindow coordinates to update the Shadow Tree state.
 *
 * @param screenComponentView An instance of RNSSplitViewScreenComponentView whose state should be updated.
 */
- (void)updateShadowStateOfComponent:(RNSSplitViewScreenComponentView *)screenComponentView;

/**
 * @brief Triggers a shadow state update for the given SplitViewScreen component in the context of a given ancestor
 * view.
 *
 * Converts the split view screen's local frame to coordinates of the specified ancestor view
 * before applying the update to the Shadow Tree. If the ancestor haven't been defined frame is calculated relatively to
 * the UIWindow.
 *
 * @param screenComponentView An instance of RNSSplitViewScreenComponentView whose state should be updated.
 * @param ancestorView An optional UIView in whose coordinate space the frame should be computed.
 */
- (void)updateShadowStateOfComponent:(RNSSplitViewScreenComponentView *)screenComponentView
             inContextOfAncestorView:(UIView *_Nullable)ancestorView;

/**
 * @brief Send an update to ShadowNode state with given frame if needed.
 *
 * Converts the frame to coordinates of the specified ancestor view,
 * before applying the update to the Shadow Tree.
 *
 * @param screenComponentView an instance of RNSSplitViewScreenComponentView whose state should be updated,
 * @param frame frame to update the shadow state with; it must be in coordinate system of `screenComponentView`,
 * @param ancestorView coordinate-system provider view, relative to which the frame should be converted before sending
 * the update.
 */
- (void)updateShadowStateOfComponent:(RNSSplitViewScreenComponentView *)screenComponentView
                           withFrame:(CGRect)frame
             inContextOfAncestorView:(nonnull UIView *)ancestorView;

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

@interface RNSSplitViewScreenShadowStateProxy ()

- (void)updateState:(react::State::Shared const &)state oldState:(react::State::Shared const &)oldState;

@end

#endif // __cplusplus
NS_ASSUME_NONNULL_END
