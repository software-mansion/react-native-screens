#pragma once

#import <CoreGraphics/CoreGraphics.h>
#import <Foundation/Foundation.h>

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
typedef struct {
  RNSStackAnimationLengthUnit unit;
  CGFloat value;
} RNSStackAnimationLength;

static inline RNSStackAnimationLength RNSStackAnimationLengthMakeFraction(CGFloat fraction)
{
  return (RNSStackAnimationLength){RNSStackAnimationLengthUnitFraction, fraction};
}

static inline RNSStackAnimationLength RNSStackAnimationLengthNegated(RNSStackAnimationLength length)
{
  return (RNSStackAnimationLength){length.unit, -length.value};
}
