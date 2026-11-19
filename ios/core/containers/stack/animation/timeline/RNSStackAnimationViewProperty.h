#pragma once

#import <Foundation/Foundation.h>

/**
 * A view property a track animates. Every property returns to its `UIView` default after a transition; the default is
 * `+[RNSStackAnimationPropertyTrack restValueOfViewProperty:]`.
 */
typedef NS_ENUM(NSInteger, RNSStackAnimationViewProperty) {
  RNSStackAnimationViewPropertyOpacity,
  /**
   * Uniform scale about the view's center.
   */
  RNSStackAnimationViewPropertyScale,
  RNSStackAnimationViewPropertyScaleX,
  RNSStackAnimationViewPropertyScaleY,
  /**
   * Clockwise, in degrees, about the view's center.
   */
  RNSStackAnimationViewPropertyRotate,
};
