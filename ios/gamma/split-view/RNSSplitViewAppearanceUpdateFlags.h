#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * @brief Bitmask representing flags for SplitView appearance updates.
 */
typedef NS_OPTIONS(NSUInteger, RNSSplitViewAppearanceUpdateFlags) {
  RNSSplitViewAppearanceUpdateFlagNone = 0,
  RNSSplitViewAppearanceUpdateFlagGeneralUpdate = 1 << 0,
  RNSSplitViewAppearanceUpdateFlagSecondaryNavBarUpdate = 1 << 1,
  RNSSplitViewAppearanceUpdateFlagDisplayModeUpdate = 1 << 2,
  RNSSplitViewAppearanceUpdateFlagOrientationUpdate = 1 << 3,
};

NS_ASSUME_NONNULL_END