#pragma once

#import <Foundation/Foundation.h>

// Hide C++ symbols from C compiler used when building Swift module
#if defined(__cplusplus)
#import <react/renderer/components/rnscreens/EventEmitters.h>

namespace react = facebook::react;
#endif // __cplusplus

NS_ASSUME_NONNULL_BEGIN

@interface RNSFormSheetComponentEventEmitter : NSObject

- (BOOL)emitOnDismiss;

@end

#pragma mark - Hidden from Swift

#if defined(__cplusplus)

@interface RNSFormSheetComponentEventEmitter ()

- (void)updateEventEmitter:(const std::shared_ptr<const react::RNSFormSheetEventEmitter> &)emitter;

@end

#endif // __cplusplus

NS_ASSUME_NONNULL_END
