#pragma once

#import <Foundation/Foundation.h>

#import <react/renderer/components/rnscreens/EventEmitters.h>

namespace react = facebook::react;

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

@interface RNSStackScreenComponentEventEmitter ()

- (void)updateEventEmitter:(const std::shared_ptr<const react::RNSStackScreenEventEmitter> &)emitter;

@end

NS_ASSUME_NONNULL_END
