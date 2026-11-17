#pragma once

#import <Foundation/Foundation.h>

typedef NS_OPTIONS(NSUInteger, RNSFormSheetUpdateFlags) {
  RNSFormSheetUpdateFlagsNone = 0,
  // The sheet needs to be presented or dismissed to match the requested open state.
  RNSFormSheetUpdateFlagsPresentation = 1 << 0,
  // The sheet's visual appearance configuration (grabber, dimming view, corner radius) needs to be re-applied.
  RNSFormSheetUpdateFlagsAppearance = 1 << 1,
  // The sheet's behavioral layout (detents, scrolling config) needs to be re-applied.
  RNSFormSheetUpdateFlagsBehavior = 1 << 2,
  // The sheet's selected detent needs to be (re)set to the configured `initialDetentIndex`.
  // Requested once per presentation cycle, since UIKit recreates the presentation controller on every present.
  RNSFormSheetUpdateFlagsInitialDetent = 1 << 3,
};
