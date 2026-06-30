#pragma once

#import <Foundation/Foundation.h>

// Hide C++ symbols from C compiler used when building Swift module
#if defined(__cplusplus)
#import <react/renderer/components/rnscreens/EventEmitters.h>

namespace react = facebook::react;
#endif // __cplusplus

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackHeaderItemEventEmitter : NSObject

- (BOOL)emitOnPress;

@end

#pragma mark - Hidden from Swift

#if defined(__cplusplus)

@interface RNSStackHeaderItemEventEmitter ()

- (void)updateEventEmitter:(const std::shared_ptr<const react::RNSStackHeaderItemIOSEventEmitter> &)emitter;

@end

#endif // __cplusplus

NS_ASSUME_NONNULL_END
