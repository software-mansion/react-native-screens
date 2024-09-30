#import "RNSConvert.h"

#ifdef RCT_NEW_ARCH_ENABLED
@implementation RNSConvert

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

+ (NSArray<NSNumber *> *)detentFractionsArrayFromVector:(const std::vector<react::Float> &)detents
{
  auto array = [NSMutableArray<NSNumber *> arrayWithCapacity:detents.size()];
  for (const react::Float value : detents) {
    [array addObject:[NSNumber numberWithFloat:value]];
  }
  return array;
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

+ (NSMutableArray<NSNumber *> *)arrayFromVector:(const std::vector<CGFloat> &)vector
{
  NSMutableArray *array = [NSMutableArray arrayWithCapacity:vector.size()];
  for (CGFloat val : vector) {
    [array addObject:[NSNumber numberWithFloat:val]];
  }
  return array;
}

+ (UIBlurEffectStyle)UIBlurEffectStyleFromCppEquivalent:(react::RNSScreenStackHeaderConfigBlurEffect)blurEffect
{
#if !TARGET_OS_TV && defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_13_0) && \
    __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_13_0
  if (@available(iOS 13.0, *)) {
    switch (blurEffect) {
      case react::RNSScreenStackHeaderConfigBlurEffect::ExtraLight:
        return UIBlurEffectStyleExtraLight;
      case react::RNSScreenStackHeaderConfigBlurEffect::Light:
        return UIBlurEffectStyleLight;
      case react::RNSScreenStackHeaderConfigBlurEffect::Dark:
        return UIBlurEffectStyleDark;
      case react::RNSScreenStackHeaderConfigBlurEffect::Regular:
        return UIBlurEffectStyleRegular;
      case react::RNSScreenStackHeaderConfigBlurEffect::Prominent:
        return UIBlurEffectStyleProminent;
      case react::RNSScreenStackHeaderConfigBlurEffect::SystemUltraThinMaterial:
        return UIBlurEffectStyleSystemUltraThinMaterial;
      case react::RNSScreenStackHeaderConfigBlurEffect::SystemThinMaterial:
        return UIBlurEffectStyleSystemThinMaterial;
      case react::RNSScreenStackHeaderConfigBlurEffect::SystemMaterial:
        return UIBlurEffectStyleSystemMaterial;
      case react::RNSScreenStackHeaderConfigBlurEffect::SystemThickMaterial:
        return UIBlurEffectStyleSystemThickMaterial;
      case react::RNSScreenStackHeaderConfigBlurEffect::SystemChromeMaterial:
        return UIBlurEffectStyleSystemChromeMaterial;
      case react::RNSScreenStackHeaderConfigBlurEffect::SystemUltraThinMaterialLight:
        return UIBlurEffectStyleSystemUltraThinMaterialLight;
      case react::RNSScreenStackHeaderConfigBlurEffect::SystemThinMaterialLight:
        return UIBlurEffectStyleSystemThinMaterialLight;
      case react::RNSScreenStackHeaderConfigBlurEffect::SystemMaterialLight:
        return UIBlurEffectStyleSystemMaterialLight;
      case react::RNSScreenStackHeaderConfigBlurEffect::SystemThickMaterialLight:
        return UIBlurEffectStyleSystemThickMaterialLight;
      case react::RNSScreenStackHeaderConfigBlurEffect::SystemChromeMaterialLight:
        return UIBlurEffectStyleSystemChromeMaterialLight;
      case react::RNSScreenStackHeaderConfigBlurEffect::SystemUltraThinMaterialDark:
        return UIBlurEffectStyleSystemUltraThinMaterialDark;
      case react::RNSScreenStackHeaderConfigBlurEffect::SystemThinMaterialDark:
        return UIBlurEffectStyleSystemThinMaterialDark;
      case react::RNSScreenStackHeaderConfigBlurEffect::SystemMaterialDark:
        return UIBlurEffectStyleSystemMaterialDark;
      case react::RNSScreenStackHeaderConfigBlurEffect::SystemThickMaterialDark:
        return UIBlurEffectStyleSystemThickMaterialDark;
      case react::RNSScreenStackHeaderConfigBlurEffect::SystemChromeMaterialDark:
        return UIBlurEffectStyleSystemChromeMaterialDark;
    }
  }
#endif

  switch (blurEffect) {
    case react::RNSScreenStackHeaderConfigBlurEffect::Light:
      return UIBlurEffectStyleLight;
    case react::RNSScreenStackHeaderConfigBlurEffect::Dark:
      return UIBlurEffectStyleDark;
    case react::RNSScreenStackHeaderConfigBlurEffect::Regular:
      return UIBlurEffectStyleRegular;
    case react::RNSScreenStackHeaderConfigBlurEffect::Prominent:
      return UIBlurEffectStyleProminent;
    case react::RNSScreenStackHeaderConfigBlurEffect::ExtraLight:
    default:
      return UIBlurEffectStyleExtraLight;
  }
}

@end

#endif // RCT_NEW_ARCH_ENABLED
