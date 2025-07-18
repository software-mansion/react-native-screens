typedef NS_ENUM(NSInteger, RNSScreenStackPresentation) {
  RNSScreenStackPresentationPush,
  RNSScreenStackPresentationModal,
  RNSScreenStackPresentationTransparentModal,
  RNSScreenStackPresentationContainedModal,
  RNSScreenStackPresentationContainedTransparentModal,
  RNSScreenStackPresentationFullScreenModal,
  RNSScreenStackPresentationFormSheet,
  RNSScreenStackPresentationPageSheet,
};

typedef NS_ENUM(NSInteger, RNSScreenStackAnimation) {
  RNSScreenStackAnimationDefault,
  RNSScreenStackAnimationNone,
  RNSScreenStackAnimationFade,
  RNSScreenStackAnimationFadeFromBottom,
  RNSScreenStackAnimationFlip,
  RNSScreenStackAnimationSlideFromBottom,
  RNSScreenStackAnimationSimplePush,
  RNSScreenStackAnimationSlideFromLeft,
};

typedef NS_ENUM(NSInteger, RNSScreenReplaceAnimation) {
  RNSScreenReplaceAnimationPop,
  RNSScreenReplaceAnimationPush,
};

typedef NS_ENUM(NSInteger, RNSScreenSwipeDirection) {
  RNSScreenSwipeDirectionHorizontal,
  RNSScreenSwipeDirectionVertical,
};

typedef NS_ENUM(NSInteger, RNSActivityState) {
  RNSActivityStateUndefined = -1,
  RNSActivityStateInactive = 0,
  RNSActivityStateTransitioningOrBelowTop = 1,
  RNSActivityStateOnTop = 2
};

typedef NS_ENUM(NSInteger, RNSStatusBarStyle) {
  RNSStatusBarStyleAuto,
  RNSStatusBarStyleInverted,
  RNSStatusBarStyleLight,
  RNSStatusBarStyleDark,
};

typedef NS_ENUM(NSInteger, RNSWindowTrait) {
  RNSWindowTraitStyle,
  RNSWindowTraitAnimation,
  RNSWindowTraitHidden,
  RNSWindowTraitOrientation,
  RNSWindowTraitHomeIndicatorHidden,
};

typedef NS_ENUM(NSInteger, RNSScreenStackHeaderSubviewType) {
  RNSScreenStackHeaderSubviewTypeBackButton,
  RNSScreenStackHeaderSubviewTypeLeft,
  RNSScreenStackHeaderSubviewTypeRight,
  RNSScreenStackHeaderSubviewTypeTitle,
  RNSScreenStackHeaderSubviewTypeCenter,
  RNSScreenStackHeaderSubviewTypeSearchBar,
};

typedef NS_ENUM(NSInteger, RNSScreenDetentType) {
  RNSScreenDetentTypeMedium,
  RNSScreenDetentTypeLarge,
  RNSScreenDetentTypeAll,
};

typedef NS_ENUM(NSInteger, RNSSearchBarPlacement) {
  RNSSearchBarPlacementAutomatic,
  RNSSearchBarPlacementInline,
  RNSSearchBarPlacementStacked,
};

typedef NS_ENUM(NSInteger, RNSSplitViewScreenColumnType) {
  RNSSplitViewScreenColumnTypeColumn,
  RNSSplitViewScreenColumnTypeInspector,
};

// Redefinition of UIBlurEffectStyle. We need to represent additional case of `None`.
typedef NS_ENUM(NSInteger, RNSBlurEffectStyle) {
  /// No blur effect should be visible
  RNSBlurEffectStyleNone = -1,
  RNSBlurEffectStyleExtraLight = UIBlurEffectStyleExtraLight,
  RNSBlurEffectStyleLight = UIBlurEffectStyleLight,
  RNSBlurEffectStyleDark = UIBlurEffectStyleDark,
  // TODO: Add support for this variant on tvOS
  //  RNSBlurEffectStyleExtraDark = UIBlurEffectStyleExtraDark API_AVAILABLE(tvos(10.0)) API_UNAVAILABLE(ios)
  //  API_UNAVAILABLE(watchos),
  RNSBlurEffectStyleRegular API_AVAILABLE(ios(10.0)) API_UNAVAILABLE(watchos) = UIBlurEffectStyleRegular,
  RNSBlurEffectStyleProminent API_AVAILABLE(ios(10.0)) API_UNAVAILABLE(watchos) = UIBlurEffectStyleProminent,
  RNSBlurEffectStyleSystemUltraThinMaterial API_AVAILABLE(ios(13.0))
      API_UNAVAILABLE(watchos, tvos) = UIBlurEffectStyleSystemUltraThinMaterial,
  RNSBlurEffectStyleSystemThinMaterial API_AVAILABLE(ios(13.0))
      API_UNAVAILABLE(watchos, tvos) = UIBlurEffectStyleSystemThinMaterial,
  RNSBlurEffectStyleSystemMaterial API_AVAILABLE(ios(13.0))
      API_UNAVAILABLE(watchos, tvos) = UIBlurEffectStyleSystemMaterial,
  RNSBlurEffectStyleSystemThickMaterial API_AVAILABLE(ios(13.0))
      API_UNAVAILABLE(watchos, tvos) = UIBlurEffectStyleSystemThickMaterial,
  RNSBlurEffectStyleSystemChromeMaterial API_AVAILABLE(ios(13.0))
      API_UNAVAILABLE(watchos, tvos) = UIBlurEffectStyleSystemChromeMaterial,
  RNSBlurEffectStyleSystemUltraThinMaterialLight API_AVAILABLE(ios(13.0))
      API_UNAVAILABLE(watchos, tvos) = UIBlurEffectStyleSystemUltraThinMaterialLight,
  RNSBlurEffectStyleSystemThinMaterialLight API_AVAILABLE(ios(13.0))
      API_UNAVAILABLE(watchos, tvos) = UIBlurEffectStyleSystemThinMaterialLight,
  RNSBlurEffectStyleSystemMaterialLight API_AVAILABLE(ios(13.0))
      API_UNAVAILABLE(watchos, tvos) = UIBlurEffectStyleSystemMaterialLight,
  RNSBlurEffectStyleSystemThickMaterialLight API_AVAILABLE(ios(13.0))
      API_UNAVAILABLE(watchos, tvos) = UIBlurEffectStyleSystemThickMaterialLight,
  RNSBlurEffectStyleSystemChromeMaterialLight API_AVAILABLE(ios(13.0))
      API_UNAVAILABLE(watchos, tvos) = UIBlurEffectStyleSystemChromeMaterialLight,

  RNSBlurEffectStyleSystemUltraThinMaterialDark API_AVAILABLE(ios(13.0))
      API_UNAVAILABLE(watchos, tvos) = UIBlurEffectStyleSystemUltraThinMaterialDark,
  RNSBlurEffectStyleSystemThinMaterialDark API_AVAILABLE(ios(13.0))
      API_UNAVAILABLE(watchos, tvos) = UIBlurEffectStyleSystemThinMaterialDark,
  RNSBlurEffectStyleSystemMaterialDark API_AVAILABLE(ios(13.0))
      API_UNAVAILABLE(watchos, tvos) = UIBlurEffectStyleSystemMaterialDark,
  RNSBlurEffectStyleSystemThickMaterialDark API_AVAILABLE(ios(13.0))
      API_UNAVAILABLE(watchos, tvos) = UIBlurEffectStyleSystemThickMaterialDark,
  RNSBlurEffectStyleSystemChromeMaterialDark API_AVAILABLE(ios(13.0))
      API_UNAVAILABLE(watchos, tvos) = UIBlurEffectStyleSystemChromeMaterialDark

} API_AVAILABLE(ios(8.0)) API_UNAVAILABLE(watchos);

// The same as above but with Default option, to be renamed after removing old stack implementation.
typedef NS_ENUM(NSInteger, RNSExtendedBlurEffectStyle) {
  /// Default blur effect should be used
  RNSExtendedBlurEffectStyleDefault = -2,
  /// No blur effect should be visible
  RNSExtendedBlurEffectStyleNone = -1,
  RNSExtendedBlurEffectStyleExtraLight = UIBlurEffectStyleExtraLight,
  RNSExtendedBlurEffectStyleLight = UIBlurEffectStyleLight,
  RNSExtendedBlurEffectStyleDark = UIBlurEffectStyleDark,
  // TODO: Add support for this variant on tvOS
  //  RNSExtendedBlurEffectStyleExtraDark = UIBlurEffectStyleExtraDark API_AVAILABLE(tvos(10.0)) API_UNAVAILABLE(ios)
  //  API_UNAVAILABLE(watchos),
  RNSExtendedBlurEffectStyleRegular API_AVAILABLE(ios(10.0)) API_UNAVAILABLE(watchos) = UIBlurEffectStyleRegular,
  RNSExtendedBlurEffectStyleProminent API_AVAILABLE(ios(10.0)) API_UNAVAILABLE(watchos) = UIBlurEffectStyleProminent,
  RNSExtendedBlurEffectStyleSystemUltraThinMaterial API_AVAILABLE(ios(13.0))
      API_UNAVAILABLE(watchos, tvos) = UIBlurEffectStyleSystemUltraThinMaterial,
  RNSExtendedBlurEffectStyleSystemThinMaterial API_AVAILABLE(ios(13.0))
      API_UNAVAILABLE(watchos, tvos) = UIBlurEffectStyleSystemThinMaterial,
  RNSExtendedBlurEffectStyleSystemMaterial API_AVAILABLE(ios(13.0))
      API_UNAVAILABLE(watchos, tvos) = UIBlurEffectStyleSystemMaterial,
  RNSExtendedBlurEffectStyleSystemThickMaterial API_AVAILABLE(ios(13.0))
      API_UNAVAILABLE(watchos, tvos) = UIBlurEffectStyleSystemThickMaterial,
  RNSExtendedBlurEffectStyleSystemChromeMaterial API_AVAILABLE(ios(13.0))
      API_UNAVAILABLE(watchos, tvos) = UIBlurEffectStyleSystemChromeMaterial,
  RNSExtendedBlurEffectStyleSystemUltraThinMaterialLight API_AVAILABLE(ios(13.0))
      API_UNAVAILABLE(watchos, tvos) = UIBlurEffectStyleSystemUltraThinMaterialLight,
  RNSExtendedBlurEffectStyleSystemThinMaterialLight API_AVAILABLE(ios(13.0))
      API_UNAVAILABLE(watchos, tvos) = UIBlurEffectStyleSystemThinMaterialLight,
  RNSExtendedBlurEffectStyleSystemMaterialLight API_AVAILABLE(ios(13.0))
      API_UNAVAILABLE(watchos, tvos) = UIBlurEffectStyleSystemMaterialLight,
  RNSExtendedBlurEffectStyleSystemThickMaterialLight API_AVAILABLE(ios(13.0))
      API_UNAVAILABLE(watchos, tvos) = UIBlurEffectStyleSystemThickMaterialLight,
  RNSExtendedBlurEffectStyleSystemChromeMaterialLight API_AVAILABLE(ios(13.0))
      API_UNAVAILABLE(watchos, tvos) = UIBlurEffectStyleSystemChromeMaterialLight,

  RNSExtendedBlurEffectStyleSystemUltraThinMaterialDark API_AVAILABLE(ios(13.0))
      API_UNAVAILABLE(watchos, tvos) = UIBlurEffectStyleSystemUltraThinMaterialDark,
  RNSExtendedBlurEffectStyleSystemThinMaterialDark API_AVAILABLE(ios(13.0))
      API_UNAVAILABLE(watchos, tvos) = UIBlurEffectStyleSystemThinMaterialDark,
  RNSExtendedBlurEffectStyleSystemMaterialDark API_AVAILABLE(ios(13.0))
      API_UNAVAILABLE(watchos, tvos) = UIBlurEffectStyleSystemMaterialDark,
  RNSExtendedBlurEffectStyleSystemThickMaterialDark API_AVAILABLE(ios(13.0))
      API_UNAVAILABLE(watchos, tvos) = UIBlurEffectStyleSystemThickMaterialDark,
  RNSExtendedBlurEffectStyleSystemChromeMaterialDark API_AVAILABLE(ios(13.0))
      API_UNAVAILABLE(watchos, tvos) = UIBlurEffectStyleSystemChromeMaterialDark

} API_AVAILABLE(ios(8.0)) API_UNAVAILABLE(watchos);

typedef NS_ENUM(NSInteger, RNSBottomTabsIconType) {
  RNSBottomTabsIconTypeImage,
  RNSBottomTabsIconTypeTemplate,
  RNSBottomTabsIconTypeSfSymbol,
};
