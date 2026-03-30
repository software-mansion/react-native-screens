#pragma once

#import "RNSScreenEventEmitting.h"
#import <Foundation/Foundation.h>

// Hide C++ symbols from C compiler used when building Swift module
#if defined(__cplusplus)
#import <react/renderer/components/rnscreens/EventEmitters.h>

namespace react = facebook::react;
#endif // __cplusplus

NS_ASSUME_NONNULL_BEGIN

/**
 * @class RNSSplitScreenComponentEventEmitter
 * @brief Responsible for emitting events from the native SplitScreen (column) to the React Element Tree.
 */
@interface RNSSplitScreenComponentEventEmitter : NSObject <RNSScreenEventEmitting>

- (BOOL)emitOnWillAppear;
- (BOOL)emitOnDidAppear;
- (BOOL)emitOnWillDisappear;
- (BOOL)emitOnDidDisappear;

/// Emitted when the screen is dismissed by JS (activityMode was already .detached).
- (BOOL)emitOnDismiss;

/// Emitted when the screen is dismissed by a native back gesture (activityMode was still .attached).
- (BOOL)emitOnNativeDismiss;

@end

#pragma mark - Hidden from Swift

#if defined(__cplusplus)

@interface RNSSplitScreenComponentEventEmitter ()

- (void)updateEventEmitter:(const std::shared_ptr<const react::RNSSplitScreenEventEmitter> &)emitter;

@end

#endif // __cplusplus
NS_ASSUME_NONNULL_END
