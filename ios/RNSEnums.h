#pragma once

typedef NS_ENUM(NSInteger, RNSScrollEdgeEffect) {
  RNSScrollEdgeEffectAutomatic,
  RNSScrollEdgeEffectHard,
  RNSScrollEdgeEffectSoft,
  RNSScrollEdgeEffectHidden,
};

typedef NS_ENUM(NSInteger, RNSSplitScreenColumnType) {
  RNSSplitScreenColumnTypeColumn,
  RNSSplitScreenColumnTypeInspector,
};

// Redefinition of UIBlurEffectStyle. We need to represent additional cases of `None` and `SystemDefault`.
typedef NS_ENUM(NSInteger, RNSBlurEffectStyle) {
  /// Default blur effect should be used
  RNSBlurEffectStyleSystemDefault = -2,
  /// No blur effect should be visible
  RNSBlurEffectStyleNone = -1,
  RNSBlurEffectStyleExtraLight = UIBlurEffectStyleExtraLight,
  RNSBlurEffectStyleLight = UIBlurEffectStyleLight,
  RNSBlurEffectStyleDark = UIBlurEffectStyleDark,
  // TODO: Add support for this variant on tvOS
  //  RNSBlurEffectStyleExtraDark = UIBlurEffectStyleExtraDark API_UNAVAILABLE(ios) API_UNAVAILABLE(watchos),
  RNSBlurEffectStyleRegular API_UNAVAILABLE(watchos) = UIBlurEffectStyleRegular,
  RNSBlurEffectStyleProminent API_UNAVAILABLE(watchos) = UIBlurEffectStyleProminent,
  RNSBlurEffectStyleSystemUltraThinMaterial API_UNAVAILABLE(watchos, tvos) = UIBlurEffectStyleSystemUltraThinMaterial,
  RNSBlurEffectStyleSystemThinMaterial API_UNAVAILABLE(watchos, tvos) = UIBlurEffectStyleSystemThinMaterial,
  RNSBlurEffectStyleSystemMaterial API_UNAVAILABLE(watchos, tvos) = UIBlurEffectStyleSystemMaterial,
  RNSBlurEffectStyleSystemThickMaterial API_UNAVAILABLE(watchos, tvos) = UIBlurEffectStyleSystemThickMaterial,
  RNSBlurEffectStyleSystemChromeMaterial API_UNAVAILABLE(watchos, tvos) = UIBlurEffectStyleSystemChromeMaterial,
  RNSBlurEffectStyleSystemUltraThinMaterialLight API_UNAVAILABLE(watchos,
                                                                 tvos) = UIBlurEffectStyleSystemUltraThinMaterialLight,
  RNSBlurEffectStyleSystemThinMaterialLight API_UNAVAILABLE(watchos, tvos) = UIBlurEffectStyleSystemThinMaterialLight,
  RNSBlurEffectStyleSystemMaterialLight API_UNAVAILABLE(watchos, tvos) = UIBlurEffectStyleSystemMaterialLight,
  RNSBlurEffectStyleSystemThickMaterialLight API_UNAVAILABLE(watchos, tvos) = UIBlurEffectStyleSystemThickMaterialLight,
  RNSBlurEffectStyleSystemChromeMaterialLight API_UNAVAILABLE(watchos,
                                                              tvos) = UIBlurEffectStyleSystemChromeMaterialLight,

  RNSBlurEffectStyleSystemUltraThinMaterialDark API_UNAVAILABLE(watchos,
                                                                tvos) = UIBlurEffectStyleSystemUltraThinMaterialDark,
  RNSBlurEffectStyleSystemThinMaterialDark API_UNAVAILABLE(watchos, tvos) = UIBlurEffectStyleSystemThinMaterialDark,
  RNSBlurEffectStyleSystemMaterialDark API_UNAVAILABLE(watchos, tvos) = UIBlurEffectStyleSystemMaterialDark,
  RNSBlurEffectStyleSystemThickMaterialDark API_UNAVAILABLE(watchos, tvos) = UIBlurEffectStyleSystemThickMaterialDark,
  RNSBlurEffectStyleSystemChromeMaterialDark API_UNAVAILABLE(watchos, tvos) = UIBlurEffectStyleSystemChromeMaterialDark

} API_UNAVAILABLE(watchos);

typedef NS_ENUM(NSInteger, RNSTabsIconType) {
  RNSTabsIconTypeImage,
  RNSTabsIconTypeTemplate,
  RNSTabsIconTypeSfSymbol,
  RNSTabsIconTypeXcasset,
};

// TODO: investigate objc - swift interop and deduplicate this code
// This enum needs to be compatible with the RNSOrientationSwift enum.
typedef NS_ENUM(NSInteger, RNSOrientation) {
  RNSOrientationInherit,
  RNSOrientationAll,
  RNSOrientationAllButUpsideDown,
  RNSOrientationPortrait,
  RNSOrientationPortraitUp,
  RNSOrientationPortraitDown,
  RNSOrientationLandscape,
  RNSOrientationLandscapeLeft,
  RNSOrientationLandscapeRight,
};

typedef NS_ENUM(NSInteger, RNSTabsScreenSystemItem) {
  RNSTabsScreenSystemItemNone,
  RNSTabsScreenSystemItemBookmarks,
  RNSTabsScreenSystemItemContacts,
  RNSTabsScreenSystemItemDownloads,
  RNSTabsScreenSystemItemFavorites,
  RNSTabsScreenSystemItemFeatured,
  RNSTabsScreenSystemItemHistory,
  RNSTabsScreenSystemItemMore,
  RNSTabsScreenSystemItemMostRecent,
  RNSTabsScreenSystemItemMostViewed,
  RNSTabsScreenSystemItemRecents,
  RNSTabsScreenSystemItemSearch,
  RNSTabsScreenSystemItemTopRated
};

typedef NS_ENUM(NSInteger, RNSTabsBottomAccessoryEnvironment) {
  RNSTabsBottomAccessoryEnvironmentRegular,
  RNSTabsBottomAccessoryEnvironmentInline
};
