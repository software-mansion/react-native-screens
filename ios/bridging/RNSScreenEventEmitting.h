#pragma once

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * @protocol RNSScreenEventEmitting
 * @brief Shared protocol for emitting lifecycle and dismiss events from a screen component to React Native.
 *
 * Implemented by RNSStackScreenComponentEventEmitter and RNSSplitScreenComponentEventEmitter.
 * Allows RNSBaseScreenController to emit events without knowing the concrete emitter type.
 *
 * Dismiss methods use the Stack pattern: two separate methods instead of a unified one.
 */
@protocol RNSScreenEventEmitting <NSObject>

- (BOOL)emitOnWillAppear;
- (BOOL)emitOnDidAppear;
- (BOOL)emitOnWillDisappear;
- (BOOL)emitOnDidDisappear;

/// Emitted when the screen is dismissed by JS (activityMode was already .detached).
- (BOOL)emitOnDismiss;

/// Emitted when the screen is dismissed by a native back gesture (activityMode was still .attached).
- (BOOL)emitOnNativeDismiss;

@end

NS_ASSUME_NONNULL_END
