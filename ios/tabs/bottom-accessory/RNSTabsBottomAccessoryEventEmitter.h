#pragma once

#import "RNSDefines.h"

#if RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

// Hide C++ symbols from C compiler used when building Swift module
#if defined(__cplusplus)
#import <react/renderer/components/rnscreens/EventEmitters.h>

namespace react = facebook::react;
#endif // defined(__cplusplus)

NS_ASSUME_NONNULL_BEGIN

@interface RNSTabsBottomAccessoryEventEmitter : NSObject

- (BOOL)emitOnEnvironmentChangeIfNeeded:(UITabAccessoryEnvironment)environment API_AVAILABLE(ios(26.0));

@end

#pragma mark - Hidden from Swift

#if defined(__cplusplus)

@interface RNSTabsBottomAccessoryEventEmitter ()

- (void)updateEventEmitter:(const std::shared_ptr<const react::RNSTabsBottomAccessoryEventEmitter> &)emitter;

@end

#endif // defined(__cplusplus)

NS_ASSUME_NONNULL_END

#endif // RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE
