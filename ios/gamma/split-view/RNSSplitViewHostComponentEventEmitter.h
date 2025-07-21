#import <Foundation/Foundation.h>

// Hide C++ symbols from C compiler used when building Swift module
#if defined(__cplusplus)
#import <react/renderer/components/rnscreens/EventEmitters.h>

namespace react = facebook::react;
#endif // __cplusplus

NS_ASSUME_NONNULL_BEGIN

/**
 * @class RNSSplitViewHostComponentEventEmitter
 * @brief Responsible for emitting events from the native SplitView to the React Element Tree.
 */
@interface RNSSplitViewHostComponentEventEmitter : NSObject

/**
 * @brief Emits the onCollapse event to notify React Native that the SplitView has collapsed.
 *
 * This event is triggered when the SplitView collapses to a single column due to
 * size constraints or user interaction.
 *
 * @return true if the event was successfully emitted, false otherwise.
 */
- (BOOL)emitOnCollapse;

/**
 * @brief Emits the onExpand event to notify React Native that the SplitView has expanded.
 *
 * This event is triggered when a SplitView is transitioning from the collapsed state to the multi-column display.
 *
 * @return true if the event was successfully emitted, false otherwise.
 */
- (BOOL)emitOnExpand;

/**
 * @brief Emits the onHideInspector event to notify that the inspector column is being hidden.
 *
 * This event is triggered when a user dismisses an inspector modal or hides it programmatically.
 *
 * @return true if the event was emitted successfully, false otherwise.
 */
- (BOOL)emitOnHideInspector;

@end

#pragma mark - Hidden from Swift

#if defined(__cplusplus)

@interface RNSSplitViewHostComponentEventEmitter ()

/**
 * @brief Sets the underlying C++ event emitter used for dispatching events to React.
 *
 * @param emitter A shared pointer to a RNSSplitViewHostEventEmitter instance.
 */
- (void)updateEventEmitter:(const std::shared_ptr<const react::RNSSplitViewHostEventEmitter> &)emitter;

@end

#endif // __cplusplus
NS_ASSUME_NONNULL_END
