#pragma once

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

#if defined(__cplusplus)
#import <react/renderer/core/State.h>

namespace react = facebook::react;
#endif // __cplusplus

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackScreenShadowStateProxy : NSObject

- (void)updateShadowStateWithFrame:(CGRect)frame;

@end

#pragma mark - Hidden from Swift

#if defined(__cplusplus)

@interface RNSStackScreenShadowStateProxy ()

- (void)updateState:(react::State::Shared const &)state oldState:(react::State::Shared const &)oldState;

@end

#endif // __cplusplus
NS_ASSUME_NONNULL_END
