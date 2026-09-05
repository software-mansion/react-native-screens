#pragma once

#import <Foundation/Foundation.h>

#import <react/renderer/components/rnscreens/EventEmitters.h>

namespace react = facebook::react;

NS_ASSUME_NONNULL_BEGIN

/**
 * @class RNSSplitScreenComponentEventEmitter
 * @brief Responsible for emitting events from the native SplitScreen (column) to the React Element Tree.
 */
@interface RNSSplitScreenComponentEventEmitter : NSObject

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

@interface RNSSplitScreenComponentEventEmitter ()

- (void)updateEventEmitter:(const std::shared_ptr<const react::RNSSplitScreenEventEmitter> &)emitter;

@end

NS_ASSUME_NONNULL_END
