#import "RNSConvert.h"

#ifndef RCT_NEW_ARCH_ENABLED
#import <react/RCTAssert.h>
#endif // !RCT_NEW_ARCH_ENABLED

@implementation RNSConvert

#ifdef RCT_NEW_ARCH_ENABLED
+ (UISemanticContentAttribute)UISemanticContentAttributeFromCppEquivalent:
    (react::RNSScreenStackHeaderConfigDirection)direction
{
  switch (direction) {
    case react::RNSScreenStackHeaderConfigDirection::Rtl:
      return UISemanticContentAttributeForceRightToLeft;
    case react::RNSScreenStackHeaderConfigDirection::Ltr:
      return UISemanticContentAttributeForceLeftToRight;
  }
}

+ (UINavigationItemBackButtonDisplayMode)UINavigationItemBackButtonDisplayModeFromCppEquivalent:
    (react::RNSScreenStackHeaderConfigBackButtonDisplayMode)backButtonDisplayMode
{
  switch (backButtonDisplayMode) {
    case react::RNSScreenStackHeaderConfigBackButtonDisplayMode::Default:
      return UINavigationItemBackButtonDisplayModeDefault;
    case react::RNSScreenStackHeaderConfigBackButtonDisplayMode::Generic:
      return UINavigationItemBackButtonDisplayModeGeneric;
    case react::RNSScreenStackHeaderConfigBackButtonDisplayMode::Minimal:
      return UINavigationItemBackButtonDisplayModeMinimal;
  }
}

+ (RNSScreenStackPresentation)RNSScreenStackPresentationFromCppEquivalent:
    (react::RNSScreenStackPresentation)stackPresentation
{
  switch (stackPresentation) {
    case react::RNSScreenStackPresentation::Push:
      return RNSScreenStackPresentationPush;
    case react::RNSScreenStackPresentation::Modal:
      return RNSScreenStackPresentationModal;
    case react::RNSScreenStackPresentation::FullScreenModal:
      return RNSScreenStackPresentationFullScreenModal;
    case react::RNSScreenStackPresentation::FormSheet:
      return RNSScreenStackPresentationFormSheet;
    case react::RNSScreenStackPresentation::ContainedModal:
      return RNSScreenStackPresentationContainedModal;
    case react::RNSScreenStackPresentation::TransparentModal:
      return RNSScreenStackPresentationTransparentModal;
    case react::RNSScreenStackPresentation::ContainedTransparentModal:
      return RNSScreenStackPresentationContainedTransparentModal;
  }
}

+ (RNSScreenStackAnimation)RNSScreenStackAnimationFromCppEquivalent:(react::RNSScreenStackAnimation)stackAnimation
{
  switch (stackAnimation) {
    // these four are intentionally grouped
    case react::RNSScreenStackAnimation::Slide_from_right:
    case react::RNSScreenStackAnimation::Ios:
    case react::RNSScreenStackAnimation::Ios_from_right:
    case react::RNSScreenStackAnimation::Default:
      return RNSScreenStackAnimationDefault;
    // these two are intentionally grouped
    case react::RNSScreenStackAnimation::Slide_from_left:
    case react::RNSScreenStackAnimation::Ios_from_left:
      return RNSScreenStackAnimationSlideFromLeft;
    case react::RNSScreenStackAnimation::Flip:
      return RNSScreenStackAnimationFlip;
    case react::RNSScreenStackAnimation::Simple_push:
      return RNSScreenStackAnimationSimplePush;
    case react::RNSScreenStackAnimation::None:
      return RNSScreenStackAnimationNone;
    case react::RNSScreenStackAnimation::Fade:
      return RNSScreenStackAnimationFade;
    case react::RNSScreenStackAnimation::Slide_from_bottom:
      return RNSScreenStackAnimationSlideFromBottom;
    case react::RNSScreenStackAnimation::Fade_from_bottom:
      return RNSScreenStackAnimationFadeFromBottom;
  }
}

+ (RNSScreenStackHeaderSubviewType)RNSScreenStackHeaderSubviewTypeFromCppEquivalent:
    (react::RNSScreenStackHeaderSubviewType)subviewType
{
  switch (subviewType) {
    case react::RNSScreenStackHeaderSubviewType::Left:
      return RNSScreenStackHeaderSubviewTypeLeft;
    case react::RNSScreenStackHeaderSubviewType::Right:
      return RNSScreenStackHeaderSubviewTypeRight;
    case react::RNSScreenStackHeaderSubviewType::Title:
      return RNSScreenStackHeaderSubviewTypeTitle;
    case react::RNSScreenStackHeaderSubviewType::Center:
      return RNSScreenStackHeaderSubviewTypeCenter;
    case react::RNSScreenStackHeaderSubviewType::SearchBar:
      return RNSScreenStackHeaderSubviewTypeSearchBar;
    case react::RNSScreenStackHeaderSubviewType::Back:
      return RNSScreenStackHeaderSubviewTypeBackButton;
  }
}

+ (RNSScreenReplaceAnimation)RNSScreenReplaceAnimationFromCppEquivalent:
    (react::RNSScreenReplaceAnimation)replaceAnimation
{
  switch (replaceAnimation) {
    case react::RNSScreenReplaceAnimation::Pop:
      return RNSScreenReplaceAnimationPop;
    case react::RNSScreenReplaceAnimation::Push:
      return RNSScreenReplaceAnimationPush;
  }
}

+ (RNSScreenSwipeDirection)RNSScreenSwipeDirectionFromCppEquivalent:(react::RNSScreenSwipeDirection)swipeDirection
{
  switch (swipeDirection) {
    case react::RNSScreenSwipeDirection::Horizontal:
      return RNSScreenSwipeDirectionHorizontal;
    case react::RNSScreenSwipeDirection::Vertical:
      return RNSScreenSwipeDirectionVertical;
  }
}

+ (RNSScreenDetentType)RNSScreenDetentTypeFromAllowedDetents:(react::RNSScreenSheetAllowedDetents)allowedDetents
{
  switch (allowedDetents) {
    case react::RNSScreenSheetAllowedDetents::All:
      return RNSScreenDetentTypeAll;
    case react::RNSScreenSheetAllowedDetents::Large:
      return RNSScreenDetentTypeLarge;
    case react::RNSScreenSheetAllowedDetents::Medium:
      return RNSScreenDetentTypeMedium;
  }
}

+ (RNSScreenDetentType)RNSScreenDetentTypeFromLargestUndimmedDetent:(react::RNSScreenSheetLargestUndimmedDetent)detent
{
  switch (detent) {
    case react::RNSScreenSheetLargestUndimmedDetent::All:
      return RNSScreenDetentTypeAll;
    case react::RNSScreenSheetLargestUndimmedDetent::Large:
      return RNSScreenDetentTypeLarge;
    case react::RNSScreenSheetLargestUndimmedDetent::Medium:
      return RNSScreenDetentTypeMedium;
  }
}

+ (NSDictionary *)gestureResponseDistanceDictFromCppStruct:
    (const react::RNSScreenGestureResponseDistanceStruct &)gestureResponseDistance
{
  return @{
    @"start" : @(gestureResponseDistance.start),
    @"end" : @(gestureResponseDistance.end),
    @"top" : @(gestureResponseDistance.top),
    @"bottom" : @(gestureResponseDistance.bottom),
  };
}

#if !TARGET_OS_VISION
+ (UITextAutocapitalizationType)UITextAutocapitalizationTypeFromCppEquivalent:
    (react::RNSSearchBarAutoCapitalize)autoCapitalize
{
  switch (autoCapitalize) {
    case react::RNSSearchBarAutoCapitalize::Words:
      return UITextAutocapitalizationTypeWords;
    case react::RNSSearchBarAutoCapitalize::Sentences:
      return UITextAutocapitalizationTypeSentences;
    case react::RNSSearchBarAutoCapitalize::Characters:
      return UITextAutocapitalizationTypeAllCharacters;
    case react::RNSSearchBarAutoCapitalize::None:
      return UITextAutocapitalizationTypeNone;
  }
}
#endif

+ (RNSSearchBarPlacement)RNSScreenSearchBarPlacementFromCppEquivalent:(react::RNSSearchBarPlacement)placement
{
  switch (placement) {
    case react::RNSSearchBarPlacement::Stacked:
      return RNSSearchBarPlacementStacked;
    case react::RNSSearchBarPlacement::Automatic:
      return RNSSearchBarPlacementAutomatic;
    case react::RNSSearchBarPlacement::Inline:
      return RNSSearchBarPlacementInline;
  }
}

+ (RNSBlurEffectStyle)RNSBlurEffectStyleFromCppEquivalent:(react::RNSScreenStackHeaderConfigBlurEffect)blurEffect
{
#if !TARGET_OS_TV && defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_13_0) && \
    __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_13_0
  if (@available(iOS 13.0, *)) {
    switch (blurEffect) {
      case react::RNSScreenStackHeaderConfigBlurEffect::None:
        return RNSBlurEffectStyleNone;
      case react::RNSScreenStackHeaderConfigBlurEffect::ExtraLight:
        return RNSBlurEffectStyleExtraLight;
      case react::RNSScreenStackHeaderConfigBlurEffect::Light:
        return RNSBlurEffectStyleLight;
      case react::RNSScreenStackHeaderConfigBlurEffect::Dark:
        return RNSBlurEffectStyleDark;
      case react::RNSScreenStackHeaderConfigBlurEffect::Regular:
        return RNSBlurEffectStyleRegular;
      case react::RNSScreenStackHeaderConfigBlurEffect::Prominent:
        return RNSBlurEffectStyleProminent;
      case react::RNSScreenStackHeaderConfigBlurEffect::SystemUltraThinMaterial:
        return RNSBlurEffectStyleSystemUltraThinMaterial;
      case react::RNSScreenStackHeaderConfigBlurEffect::SystemThinMaterial:
        return RNSBlurEffectStyleSystemThinMaterial;
      case react::RNSScreenStackHeaderConfigBlurEffect::SystemMaterial:
        return RNSBlurEffectStyleSystemMaterial;
      case react::RNSScreenStackHeaderConfigBlurEffect::SystemThickMaterial:
        return RNSBlurEffectStyleSystemThickMaterial;
      case react::RNSScreenStackHeaderConfigBlurEffect::SystemChromeMaterial:
        return RNSBlurEffectStyleSystemChromeMaterial;
      case react::RNSScreenStackHeaderConfigBlurEffect::SystemUltraThinMaterialLight:
        return RNSBlurEffectStyleSystemUltraThinMaterialLight;
      case react::RNSScreenStackHeaderConfigBlurEffect::SystemThinMaterialLight:
        return RNSBlurEffectStyleSystemThinMaterialLight;
      case react::RNSScreenStackHeaderConfigBlurEffect::SystemMaterialLight:
        return RNSBlurEffectStyleSystemMaterialLight;
      case react::RNSScreenStackHeaderConfigBlurEffect::SystemThickMaterialLight:
        return RNSBlurEffectStyleSystemThickMaterialLight;
      case react::RNSScreenStackHeaderConfigBlurEffect::SystemChromeMaterialLight:
        return RNSBlurEffectStyleSystemChromeMaterialLight;
      case react::RNSScreenStackHeaderConfigBlurEffect::SystemUltraThinMaterialDark:
        return RNSBlurEffectStyleSystemUltraThinMaterialDark;
      case react::RNSScreenStackHeaderConfigBlurEffect::SystemThinMaterialDark:
        return RNSBlurEffectStyleSystemThinMaterialDark;
      case react::RNSScreenStackHeaderConfigBlurEffect::SystemMaterialDark:
        return RNSBlurEffectStyleSystemMaterialDark;
      case react::RNSScreenStackHeaderConfigBlurEffect::SystemThickMaterialDark:
        return RNSBlurEffectStyleSystemThickMaterialDark;
      case react::RNSScreenStackHeaderConfigBlurEffect::SystemChromeMaterialDark:
        return RNSBlurEffectStyleSystemChromeMaterialDark;
    }
  }
#endif

  switch (blurEffect) {
    case react::RNSScreenStackHeaderConfigBlurEffect::None:
      return RNSBlurEffectStyleNone;
    case react::RNSScreenStackHeaderConfigBlurEffect::Light:
      return RNSBlurEffectStyleLight;
    case react::RNSScreenStackHeaderConfigBlurEffect::Dark:
      return RNSBlurEffectStyleDark;
    case react::RNSScreenStackHeaderConfigBlurEffect::Regular:
      return RNSBlurEffectStyleRegular;
    case react::RNSScreenStackHeaderConfigBlurEffect::Prominent:
      return RNSBlurEffectStyleProminent;
    case react::RNSScreenStackHeaderConfigBlurEffect::ExtraLight:
    default:
      return RNSBlurEffectStyleNone;
  }
}

#endif // RCT_NEW_ARCH_ENABLED

+ (UIBlurEffectStyle)tryConvertRNSBlurEffectStyleToUIBlurEffectStyle:(RNSBlurEffectStyle)blurEffect
{
#ifdef RCT_NEW_ARCH_ENABLED
  react_native_assert(blurEffect != RNSBlurEffectStyleNone);
#else
  RCTAssert(
      blurEffect != RNSBlurEffectStyleNone, @"RNSBlurEffectStyleNone variant is not convertible to UIBlurEffectStyle");
#endif // RCT_NEW_ARCH_ENABLED

  // Cast safety: RNSBlurEffectStyle is defined in such way that its values map 1:1 with
  // UIBlurEffectStyle, except RNSBlurEffectStyleNone which is excluded above.
  return (UIBlurEffectStyle)blurEffect;
}

@end
