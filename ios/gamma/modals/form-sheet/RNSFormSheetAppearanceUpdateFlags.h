#pragma once

#import <Foundation/Foundation.h>

typedef NS_OPTIONS(NSUInteger, RNSFormSheetAppearanceUpdateFlags) {
  RNSFormSheetAppearanceUpdateFlagsNone = 0,
  // The sheet needs to be presented or dismissed to match the requested open state.
  RNSFormSheetAppearanceUpdateFlagsPresentation = 1 << 0,
  // The sheet's visual appearance configuration (detents, grabber, dimming view) needs to be re-applied.
  RNSFormSheetAppearanceUpdateFlagsConfiguration = 1 << 1,
};
