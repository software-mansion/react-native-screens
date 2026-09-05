#pragma once

#import <Foundation/Foundation.h>

#import <react/renderer/components/rnscreens/EventEmitters.h>

namespace react = facebook::react;

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackHeaderConfigEventEmitter : NSObject

- (BOOL)emitOnMenuItemPress:(NSString *)menuItemId;

- (BOOL)emitOnMenuSelectionChange:(NSString *)menuId selectedMenuItemIds:(NSArray<NSString *> *)selectedIds;

@end

@interface RNSStackHeaderConfigEventEmitter ()

- (void)updateEventEmitter:(const std::shared_ptr<const react::RNSStackHeaderConfigIOSEventEmitter> &)emitter;

@end

NS_ASSUME_NONNULL_END
