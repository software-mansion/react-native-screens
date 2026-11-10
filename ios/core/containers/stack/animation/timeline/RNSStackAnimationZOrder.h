#pragma once

#import <Foundation/Foundation.h>

/**
 * Where the disappearing screen of a transition is drawn relative to the appearing one.
 */
typedef NS_ENUM(NSInteger, RNSStackAnimationZOrder) {
  RNSStackAnimationZOrderUnder,
  RNSStackAnimationZOrderOver,
};
