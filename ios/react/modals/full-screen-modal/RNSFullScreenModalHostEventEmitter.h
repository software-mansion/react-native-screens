#pragma once

#import <Foundation/Foundation.h>

// Hide C++ symbols from C compiler used when building Swift module
#if defined(__cplusplus)
#import <react/renderer/components/rnscreens/EventEmitters.h>

namespace react = facebook::react;
#endif // __cplusplus

NS_ASSUME_NONNULL_BEGIN

@interface RNSFullScreenModalHostEventEmitter : NSObject

- (BOOL)emitOnPresentationRejected;
- (BOOL)emitOnWillAppear;
- (BOOL)emitOnDidAppear;
- (BOOL)emitOnWillDisappear;
- (BOOL)emitOnDidDisappear;
- (BOOL)emitOnDismiss;
- (BOOL)emitOnNativeDismiss;

@end

#pragma mark - Hidden from Swift

#if defined(__cplusplus)

@interface RNSFullScreenModalHostEventEmitter ()

- (void)updateEventEmitter:(const std::shared_ptr<const react::RNSFullScreenModalHostEventEmitter> &)emitter;

@end

#endif // __cplusplus

NS_ASSUME_NONNULL_END
