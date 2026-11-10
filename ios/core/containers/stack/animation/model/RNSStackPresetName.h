#pragma once

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

typedef NS_ENUM(NSInteger, RNSStackPresetName) {
  RNSStackPresetNameDefault,
  RNSStackPresetNameNone,
  RNSStackPresetNameFade,
  RNSStackPresetNameSlideFromRight,
  RNSStackPresetNameSlideFromLeft,
  RNSStackPresetNameSlideFromTrailing,
  RNSStackPresetNameSlideFromLeading,
  RNSStackPresetNameSlideFromBottom,
  RNSStackPresetNameSlideFromTop,
  RNSStackPresetNameFadeFromBottom,
  RNSStackPresetNameFadeFromTop,
  RNSStackPresetNameIosFromRight,
  RNSStackPresetNameIosFromLeft,
  RNSStackPresetNameIosFromTrailing,
  RNSStackPresetNameIosFromLeading,
};

/**
 * Writes the preset named `string` to `outName`. Returns NO, leaving `outName` untouched, when no preset has that name.
 */
FOUNDATION_EXTERN BOOL RNSStackPresetNameFromString(NSString *string, RNSStackPresetName *outName);

FOUNDATION_EXTERN NSString *RNSStackPresetNameToString(RNSStackPresetName name);

NS_ASSUME_NONNULL_END
