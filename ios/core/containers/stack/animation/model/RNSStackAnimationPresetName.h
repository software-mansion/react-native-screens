#pragma once

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

typedef NS_ENUM(NSInteger, RNSStackAnimationPresetName) {
  RNSStackAnimationPresetNameDefault,
  RNSStackAnimationPresetNameNone,
  RNSStackAnimationPresetNameFade,
  RNSStackAnimationPresetNameSlideFromRight,
  RNSStackAnimationPresetNameSlideFromLeft,
  RNSStackAnimationPresetNameSlideFromTrailing,
  RNSStackAnimationPresetNameSlideFromLeading,
  RNSStackAnimationPresetNameSlideFromBottom,
  RNSStackAnimationPresetNameSlideFromTop,
  RNSStackAnimationPresetNameFadeFromBottom,
  RNSStackAnimationPresetNameFadeFromTop,
  RNSStackAnimationPresetNameIosFromRight,
  RNSStackAnimationPresetNameIosFromLeft,
  RNSStackAnimationPresetNameIosFromTrailing,
  RNSStackAnimationPresetNameIosFromLeading,
};

NS_ASSUME_NONNULL_END
