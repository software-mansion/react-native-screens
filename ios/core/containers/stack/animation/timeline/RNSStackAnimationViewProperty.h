#pragma once

#import <Foundation/Foundation.h>

/**
 * A view property a track animates. Every property returns to its `UIView` default after a transition.
 */
typedef NS_ENUM(NSInteger, RNSStackAnimationViewProperty) {
  RNSStackAnimationViewPropertyOpacity,
};
