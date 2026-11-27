#pragma once

#import <Foundation/Foundation.h>
#import "RNSStackNavigationState.h"

// Hide C++ symbols from C compiler used when building Swift module
#if defined(__cplusplus)
#import <react/renderer/components/rnscreens/EventEmitters.h>

namespace react = facebook::react;
#endif // __cplusplus

NS_ASSUME_NONNULL_BEGIN

/** Payload of the `onNavStateChanged` event, emitted on every transition of the stack. */
typedef struct {
  /** The navigation state after the transition. */
  RNSStackNavigationState *_Nonnull navState;
  /** Origin (actor) of the transition. */
  RNSStackActionOrigin actionOrigin;
} OnNavStateChangedPayload;

/** Payload of the `onNavStateRequestRejected` event, emitted when a navigation state request is rejected. */
typedef struct {
  /** The current navigation state, which stays unchanged. */
  RNSStackNavigationState *_Nonnull currentNavState;
  /** The rejected request. */
  RNSStackNavigationStateUpdateRequest *_Nonnull rejectedRequest;
  /** Why the request was rejected. */
  RNSStackNavigationStateRejectionReason rejectionReason;
} OnNavStateRequestRejectedPayload;

/** Payload of the `onScreensReleased` event, emitted when screens removed from the stack are no longer held. */
typedef struct {
  /** Keys of the released screens. */
  NSArray<NSString *> *_Nonnull screenKeys;
} OnScreensReleasedPayload;

@interface RNSStackHostEventEmitter : NSObject

/** Emits `onNavStateChanged` to JS. Returns YES if the event was dispatched. */
- (BOOL)emitOnNavStateChanged:(OnNavStateChangedPayload)payload;

/** Emits `onNavStateRequestRejected` to JS. Returns YES if the event was dispatched. */
- (BOOL)emitOnNavStateRequestRejected:(OnNavStateRequestRejectedPayload)payload;

/** Emits `onScreensReleased` to JS. Returns YES if the event was dispatched. */
- (BOOL)emitOnScreensReleased:(OnScreensReleasedPayload)payload;

@end

#pragma mark - Hidden from Swift

#if defined(__cplusplus)

@interface RNSStackHostEventEmitter ()

- (void)updateEventEmitter:(const std::shared_ptr<const react::RNSStackHostEventEmitter> &)emitter;

@end

#endif // __cplusplus

NS_ASSUME_NONNULL_END
