#pragma once

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
 * @brief Emits the onCollapse event to notify associated component instance that the SplitView has collapsed.
 *
 * Call this method when the SplitView collapses to a single column e.g. due to
 * size constraints or user interaction to notify React realm of this event.
 *
 * @return true if the event was successfully emitted, false otherwise.
 */
- (BOOL)emitOnCollapse;

- (BOOL)emitOnDisplayModeWillChangeFrom:(UISplitViewControllerDisplayMode)currentDisplayMode
                                     to:(UISplitViewControllerDisplayMode)nextDisplayMode;
/**
 * @brief Emits the onExpand event to notify associated component instance that the SplitView has expanded.
 *
 * Call this method when a SplitView is transitioning from the collapsed state to the multi-column display
 * to notify React realm of this event.
 *
 * @return true if the event was successfully emitted, false otherwise.
 */
- (BOOL)emitOnExpand;

/**
 * @brief Emits the onHideInspector event to notify that the inspector column is being hidden.
 *
 * Call this method when a user dismisses an inspector modal or hides it programmatically
 * to notify React for synchronize the state based on this event.
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
