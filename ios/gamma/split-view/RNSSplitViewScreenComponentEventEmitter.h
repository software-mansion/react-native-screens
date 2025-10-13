#import <Foundation/Foundation.h>

// Hide C++ symbols from C compiler used when building Swift module
#if defined(__cplusplus)
#import <react/renderer/components/rnscreens/EventEmitters.h>

namespace react = facebook::react;
#endif // __cplusplus

NS_ASSUME_NONNULL_BEGIN

/**
 * @class RNSSplitViewScreenComponentEventEmitter
 * @brief Responsible for emitting events from the native SplitViewScreen (column) to the React Element Tree.
 */
@interface RNSSplitViewScreenComponentEventEmitter : NSObject

/**
 * @brief Emits the onWillAppear event to notify React Native.
 *
 * This event is triggered when the SplitView column will be added to the native hierarchy.
 *
 * @return true if the event was successfully emitted, false otherwise.
 */
- (BOOL)emitOnWillAppear;

/**
 * @brief Emits the onDidAppear event to notify React Native.
 *
 * This event is triggered when the SplitView column was added to the native hierarchy.
 *
 * @return true if the event was successfully emitted, false otherwise.
 */
- (BOOL)emitOnDidAppear;

/**
 * @brief Emits the onWillDisappear event to notify React Native.
 *
 * This event is triggered when the SplitView column will be removed from the native hierarchy.
 *
 * @return true if the event was successfully emitted, false otherwise.
 */
- (BOOL)emitOnWillDisappear;

/**
 * @brief Emits the onDidDisappear event to notify React Native.
 *
 * This event is triggered when the SplitView column was removed from the native hierarchy.
 *
 * @return true if the event was successfully emitted, false otherwise.
 */
- (BOOL)emitOnDidDisappear;

@end

#pragma mark - Hidden from Swift

#if defined(__cplusplus)

@interface RNSSplitViewScreenComponentEventEmitter ()

- (void)updateEventEmitter:(const std::shared_ptr<const react::RNSSplitViewScreenEventEmitter> &)emitter;

@end

#endif // __cplusplus
NS_ASSUME_NONNULL_END
