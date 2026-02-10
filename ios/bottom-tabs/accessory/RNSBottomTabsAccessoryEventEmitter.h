#pragma once

#import "RNSDefines.h"

#if RNS_BOTTOM_ACCESSORY_AVAILABLE

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

// Hide C++ symbols from C compiler used when building Swift module
#if defined(__cplusplus) && RCT_NEW_ARCH_ENABLED
#import <react/renderer/components/rnscreens/EventEmitters.h>

namespace react = facebook::react;
#endif // defined(__cplusplus) && RCT_NEW_ARCH_ENABLED

#if !RCT_NEW_ARCH_ENABLED
#import <React/RCTComponent.h>
#endif // !RCT_NEW_ARCH_ENABLED

NS_ASSUME_NONNULL_BEGIN

@interface RNSBottomTabsAccessoryEventEmitter : NSObject

- (BOOL)emitOnEnvironmentChangeIfNeeded:(UITabAccessoryEnvironment)environment API_AVAILABLE(ios(26.0));

@end

#pragma mark - Hidden from Swift

#if defined(__cplusplus)

@interface RNSBottomTabsAccessoryEventEmitter ()

#if RCT_NEW_ARCH_ENABLED

- (void)updateEventEmitter:(const std::shared_ptr<const react::RNSBottomTabsAccessoryEventEmitter> &)emitter;

#else
#pragma mark - LEGACY Event emitter blocks

@property (nonatomic, copy) RCTDirectEventBlock onEnvironmentChange;

#endif // RCT_NEW_ARCH_ENABLED

@end

#endif // defined(__cplusplus)

NS_ASSUME_NONNULL_END

#endif // RNS_BOTTOM_ACCESSORY_AVAILABLE
