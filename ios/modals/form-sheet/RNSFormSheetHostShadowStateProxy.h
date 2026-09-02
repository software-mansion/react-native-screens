#pragma once

#import <UIKit/UIKit.h>

#import <React/RCTComponentViewProtocol.h>

NS_ASSUME_NONNULL_BEGIN

@interface RNSFormSheetHostShadowStateProxy : NSObject

- (void)updateState:(facebook::react::State::Shared const &)state
           oldState:(facebook::react::State::Shared const &)oldState;

- (void)updateShadowStateWithBounds:(CGRect)bounds;

@end

NS_ASSUME_NONNULL_END
