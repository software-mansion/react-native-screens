#pragma once

#import <CoreGraphics/CoreGraphics.h>
#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

typedef NS_ENUM(NSInteger, RNSStackAnimationLengthUnit) {
  RNSStackAnimationLengthUnitPoints,
  /**
   * A fraction of the container's width (X tracks) or height (Y tracks): 1 is the full width or height.
   */
  RNSStackAnimationLengthUnitFraction,
};

/**
 * A distance on the screen, resolved to points by the engine.
 */
@interface RNSStackAnimationLength : NSObject

@property (nonatomic, readonly) RNSStackAnimationLengthUnit unit;
@property (nonatomic, readonly) CGFloat value;

@property (class, nonatomic, readonly) RNSStackAnimationLength *zero;

+ (instancetype)points:(CGFloat)points;
+ (instancetype)fraction:(CGFloat)fraction;

- (instancetype)negated;

@end

NS_ASSUME_NONNULL_END
