#pragma once

#import <Foundation/Foundation.h>

// Hide C++ symbols from C compiler used when building Swift module
#if defined(__cplusplus)
#import <react/renderer/components/rnscreens/EventEmitters.h>

namespace react = facebook::react;
#endif // __cplusplus

NS_ASSUME_NONNULL_BEGIN

@interface RNSFormSheetHostEventEmitter : NSObject

- (BOOL)emitOnNativeDismiss;
- (BOOL)emitOnNativeDismissPrevented;
#if !TARGET_OS_TV
- (BOOL)emitOnDetentChangedWithIndex:(NSInteger)index;
#endif // !TARGET_OS_TV

@end

#pragma mark - Hidden from Swift

#if defined(__cplusplus)

@interface RNSFormSheetHostEventEmitter ()

- (void)updateEventEmitter:(const std::shared_ptr<const react::RNSFormSheetHostEventEmitter> &)emitter;

@end

#endif // __cplusplus

NS_ASSUME_NONNULL_END
