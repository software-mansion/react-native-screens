#pragma once

#import <Foundation/Foundation.h>

// Hide C++ symbols from C compiler used when building Swift module
#if defined(__cplusplus) && RCT_NEW_ARCH_ENABLED
#import <react/renderer/components/rnscreens/EventEmitters.h>

namespace react = facebook::react;
#endif // __cplusplus

#if !RCT_NEW_ARCH_ENABLED
#import <React/RCTComponent.h>
#endif // !RCT_NEW_ARCH_ENABLED

NS_ASSUME_NONNULL_BEGIN

/**
 * These methods can be called to send an appropriate event to ElementTree.
 * Returned value denotes whether the event has been successfully dispatched to React event pipeline.
 * The returned value of `true` does not mean, that the event has been successfully delivered.
 */
@interface RNSBottomTabsScreenEventEmitter : NSObject

- (BOOL)emitOnWillAppear;
- (BOOL)emitOnDidAppear;
- (BOOL)emitOnWillDisappear;
- (BOOL)emitOnDidDisappear;

@end

#pragma mark - Hidden from Swift

#if defined(__cplusplus)

@interface RNSBottomTabsScreenEventEmitter ()

#if RCT_NEW_ARCH_ENABLED

- (void)updateEventEmitter:(const std::shared_ptr<const react::RNSBottomTabsScreenEventEmitter> &)emitter;

#else
#pragma mark - LEGACY Event emitting blocks

@property (nonatomic, copy, nullable) RCTDirectEventBlock onWillAppear;
@property (nonatomic, copy, nullable) RCTDirectEventBlock onDidAppear;
@property (nonatomic, copy, nullable) RCTDirectEventBlock onWillDisappear;
@property (nonatomic, copy, nullable) RCTDirectEventBlock onDidDisappear;

#endif // RCT_NEW_ARCH_ENABLED

@end

#endif // __cplusplus
NS_ASSUME_NONNULL_END
