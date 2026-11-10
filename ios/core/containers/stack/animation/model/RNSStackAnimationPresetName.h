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

/**
 * Writes the preset named `string` to `outName`. Returns NO, leaving `outName` untouched, when no preset has that name.
 */
FOUNDATION_EXTERN BOOL RNSStackAnimationPresetNameFromString(NSString *string, RNSStackAnimationPresetName *outName);

FOUNDATION_EXTERN NSString *RNSStackAnimationPresetNameToString(RNSStackAnimationPresetName name);

NS_ASSUME_NONNULL_END
