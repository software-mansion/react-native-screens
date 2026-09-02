#pragma once

#import <Foundation/Foundation.h>

#import <react/renderer/components/rnscreens/EventEmitters.h>

namespace react = facebook::react;

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackHeaderItemEventEmitter : NSObject

- (BOOL)emitOnPress;

@end

@interface RNSStackHeaderItemEventEmitter ()

- (void)updateEventEmitter:(const std::shared_ptr<const react::RNSStackHeaderItemIOSEventEmitter> &)emitter;

@end

NS_ASSUME_NONNULL_END
