#pragma once

#import <Foundation/Foundation.h>

/**
 * Where a preset name is written in the `animation` prop.
 */
typedef NS_ENUM(NSInteger, RNSStackAnimationPresetLevel) {
  RNSStackAnimationPresetLevelAnimation,
  RNSStackAnimationPresetLevelTransition,
  RNSStackAnimationPresetLevelMotion,
};
