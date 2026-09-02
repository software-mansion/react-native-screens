#pragma once

#import <Foundation/Foundation.h>

#import <react/renderer/components/rnscreens/EventEmitters.h>

namespace react = facebook::react;

NS_ASSUME_NONNULL_BEGIN

@interface RNSFormSheetHostEventEmitter : NSObject

- (BOOL)emitOnDismiss;
- (BOOL)emitOnNativeDismiss;
- (BOOL)emitOnNativeDismissPrevented;
#if !TARGET_OS_TV
- (BOOL)emitOnDetentChangedWithIndex:(NSInteger)index;
#endif // !TARGET_OS_TV
- (BOOL)emitOnWillAppear;
- (BOOL)emitOnDidAppear;
- (BOOL)emitOnWillDisappear;
- (BOOL)emitOnDidDisappear;

@end

@interface RNSFormSheetHostEventEmitter ()

- (void)updateEventEmitter:(const std::shared_ptr<const react::RNSFormSheetHostEventEmitter> &)emitter;

@end

NS_ASSUME_NONNULL_END
