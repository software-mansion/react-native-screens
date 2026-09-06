#pragma once

#import <Foundation/Foundation.h>

/**
 * @brief - A collection of flags, which can be invalidated on RNSSplitHostController to apply proper updates to
 * SplitView
 */
typedef NS_OPTIONS(uint8_t, RNSSplitAppearanceUpdateFlags) {
  RNSSplitAppearanceUpdateFlagsGeneralUpdate = 1 << 0,
  RNSSplitAppearanceUpdateFlagsSecondaryScreenNavBarUpdate = 1 << 1,
  RNSSplitAppearanceUpdateFlagsDisplayModeUpdate = 1 << 2,
  RNSSplitAppearanceUpdateFlagsOrientationUpdate = 1 << 3,
};
