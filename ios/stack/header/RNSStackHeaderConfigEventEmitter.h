#pragma once

#import <Foundation/Foundation.h>

// Hide C++ symbols from C compiler used when building Swift module
#if defined(__cplusplus)
#import <react/renderer/components/rnscreens/EventEmitters.h>

namespace react = facebook::react;
#endif // __cplusplus

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackHeaderConfigEventEmitter : NSObject

- (BOOL)emitOnMenuItemPress:(NSString *)menuItemId;

- (BOOL)emitOnMenuSelectionChange:(NSString *)menuId selectedMenuItemIds:(NSArray<NSString *> *)selectedIds;

@end

#pragma mark - Hidden from Swift

#if defined(__cplusplus)

@interface RNSStackHeaderConfigEventEmitter ()

- (void)updateEventEmitter:(const std::shared_ptr<const react::RNSStackHeaderConfigIOSEventEmitter> &)emitter;

@end

#endif // __cplusplus

NS_ASSUME_NONNULL_END
