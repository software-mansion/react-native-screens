#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface RNSShadowStateFrameTracker : NSObject

- (BOOL)updateFrameIfNeeded:(CGRect)newFrame;

- (void)reset;

@end

NS_ASSUME_NONNULL_END
