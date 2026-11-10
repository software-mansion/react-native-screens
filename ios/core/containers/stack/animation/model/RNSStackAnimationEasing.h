#pragma once

#import <CoreGraphics/CoreGraphics.h>
#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

typedef NS_ENUM(NSInteger, RNSStackAnimationEasingName) {
  RNSStackAnimationEasingNameLinear,
  RNSStackAnimationEasingNameAccelerateDecelerate,
};

@interface RNSStackAnimationEasing : NSObject

@property (nonatomic, readonly) RNSStackAnimationEasingName name;

+ (instancetype)named:(RNSStackAnimationEasingName)name;

/**
 * Eased progress for a linear progress in [0, 1].
 */
- (CGFloat)valueAt:(CGFloat)progress;

@end

NS_ASSUME_NONNULL_END
