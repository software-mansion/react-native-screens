#pragma once

#import <Foundation/Foundation.h>

// Hide C++ symbols from C compiler used when building Swift module
#if defined(__cplusplus)
#import <react/renderer/components/rnscreens/EventEmitters.h>

namespace react = facebook::react;
#endif // __cplusplus

NS_ASSUME_NONNULL_BEGIN

/**
 * These methods can be called to send an appropriate event to ElementTree.
 * Returned value denotes whether the event has been successfully dispatched to React event pipeline.
 * The returned value of `true` does not mean, that the event has been successfully delivered.
 */
@interface RNSStackScreenComponentEventEmitter : NSObject

- (BOOL)emitOnWillAppear;
- (BOOL)emitOnDidAppear;
- (BOOL)emitOnWillDisappear;
- (BOOL)emitOnDidDisappear;
- (BOOL)emitOnDismiss;
- (BOOL)emitOnNativeDismiss;

@end

#pragma mark - Hidden from Swift

#if defined(__cplusplus)

@interface RNSStackScreenComponentEventEmitter ()

- (void)updateEventEmitter:(const std::shared_ptr<const react::RNSStackScreenEventEmitter> &)emitter;

@end

#endif // __cplusplus
NS_ASSUME_NONNULL_END
