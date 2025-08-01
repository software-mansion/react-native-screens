#import "RNSConvert.h"
#import <React/RCTLog.h>

#ifndef RCT_NEW_ARCH_ENABLED
#import <React/RCTAssert.h>
#endif // !RCT_NEW_ARCH_ENABLED

@implementation RNSConvert

#ifdef RCT_NEW_ARCH_ENABLED
+ (UISemanticContentAttribute)UISemanticContentAttributeFromCppEquivalent:
    (react::RNSScreenStackHeaderConfigDirection)direction
{
  switch (direction) {
    using enum react::RNSScreenStackHeaderConfigDirection;

    case Rtl:
      return UISemanticContentAttributeForceRightToLeft;
    case Ltr:
      return UISemanticContentAttributeForceLeftToRight;
  }
}

+ (UINavigationItemBackButtonDisplayMode)UINavigationItemBackButtonDisplayModeFromCppEquivalent:
    (react::RNSScreenStackHeaderConfigBackButtonDisplayMode)backButtonDisplayMode
{
  switch (backButtonDisplayMode) {
    using enum react::RNSScreenStackHeaderConfigBackButtonDisplayMode;

    case Default:
      return UINavigationItemBackButtonDisplayModeDefault;
    case Generic:
      return UINavigationItemBackButtonDisplayModeGeneric;
    case Minimal:
      return UINavigationItemBackButtonDisplayModeMinimal;
  }
}

+ (RNSScreenStackPresentation)RNSScreenStackPresentationFromCppEquivalent:
    (react::RNSScreenStackPresentation)stackPresentation
{
  switch (stackPresentation) {
    using enum react::RNSScreenStackPresentation;

    case Push:
      return RNSScreenStackPresentationPush;
    case Modal:
      return RNSScreenStackPresentationModal;
    case FullScreenModal:
      return RNSScreenStackPresentationFullScreenModal;
    case FormSheet:
      return RNSScreenStackPresentationFormSheet;
    case PageSheet:
      return RNSScreenStackPresentationPageSheet;
    case ContainedModal:
      return RNSScreenStackPresentationContainedModal;
    case TransparentModal:
      return RNSScreenStackPresentationTransparentModal;
    case ContainedTransparentModal:
      return RNSScreenStackPresentationContainedTransparentModal;
  }
}

+ (RNSScreenStackAnimation)RNSScreenStackAnimationFromCppEquivalent:(react::RNSScreenStackAnimation)stackAnimation
{
  switch (stackAnimation) {
    using enum react::RNSScreenStackAnimation;
    // these three are intentionally grouped
    case Slide_from_right:
    case Ios_from_right:
    case Default:
      return RNSScreenStackAnimationDefault;
    // these two are intentionally grouped
    case Slide_from_left:
    case Ios_from_left:
      return RNSScreenStackAnimationSlideFromLeft;
    case Flip:
      return RNSScreenStackAnimationFlip;
    case Simple_push:
      return RNSScreenStackAnimationSimplePush;
    case None:
      return RNSScreenStackAnimationNone;
    case Fade:
      return RNSScreenStackAnimationFade;
    case Slide_from_bottom:
      return RNSScreenStackAnimationSlideFromBottom;
    case Fade_from_bottom:
      return RNSScreenStackAnimationFadeFromBottom;
  }
}

+ (RNSScreenStackHeaderSubviewType)RNSScreenStackHeaderSubviewTypeFromCppEquivalent:
    (react::RNSScreenStackHeaderSubviewType)subviewType
{
  switch (subviewType) {
    using enum react::RNSScreenStackHeaderSubviewType;

    case Left:
      return RNSScreenStackHeaderSubviewTypeLeft;
    case Right:
      return RNSScreenStackHeaderSubviewTypeRight;
    case Title:
      return RNSScreenStackHeaderSubviewTypeTitle;
    case Center:
      return RNSScreenStackHeaderSubviewTypeCenter;
    case SearchBar:
      return RNSScreenStackHeaderSubviewTypeSearchBar;
    case Back:
      return RNSScreenStackHeaderSubviewTypeBackButton;
  }
}

+ (RNSScreenReplaceAnimation)RNSScreenReplaceAnimationFromCppEquivalent:
    (react::RNSScreenReplaceAnimation)replaceAnimation
{
  switch (replaceAnimation) {
    using enum react::RNSScreenReplaceAnimation;
    case Pop:
      return RNSScreenReplaceAnimationPop;
    case Push:
      return RNSScreenReplaceAnimationPush;
  }
}

+ (RNSScreenSwipeDirection)RNSScreenSwipeDirectionFromCppEquivalent:(react::RNSScreenSwipeDirection)swipeDirection
{
  switch (swipeDirection) {
    using enum react::RNSScreenSwipeDirection;
    case Horizontal:
      return RNSScreenSwipeDirectionHorizontal;
    case Vertical:
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
    using enum react::RNSSearchBarAutoCapitalize;
    case Words:
      return UITextAutocapitalizationTypeWords;
    case Sentences:
      return UITextAutocapitalizationTypeSentences;
    case Characters:
      return UITextAutocapitalizationTypeAllCharacters;
    case None:
      return UITextAutocapitalizationTypeNone;
  }
}
#endif

+ (RNSSearchBarPlacement)RNSScreenSearchBarPlacementFromCppEquivalent:(react::RNSSearchBarPlacement)placement
{
  switch (placement) {
    using enum react::RNSSearchBarPlacement;
    case Stacked:
      return RNSSearchBarPlacementStacked;
    case Automatic:
      return RNSSearchBarPlacementAutomatic;
    case Inline:
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

+ (RNSBlurEffectStyle)RNSBlurEffectStyleFromCppEquivalent:(react::RNSScreenStackHeaderConfigBlurEffect)blurEffect
{
  using enum react::RNSScreenStackHeaderConfigBlurEffect;
  switch (blurEffect) {
    case None:
      return RNSBlurEffectStyleNone;
    case ExtraLight:
      return RNSBlurEffectStyleExtraLight;
    case Light:
      return RNSBlurEffectStyleLight;
    case Dark:
      return RNSBlurEffectStyleDark;
    case Regular:
      return RNSBlurEffectStyleRegular;
    case Prominent:
      return RNSBlurEffectStyleProminent;
#if !TARGET_OS_TV
    case SystemUltraThinMaterial:
      return RNSBlurEffectStyleSystemUltraThinMaterial;
    case SystemThinMaterial:
      return RNSBlurEffectStyleSystemThinMaterial;
    case SystemMaterial:
      return RNSBlurEffectStyleSystemMaterial;
    case SystemThickMaterial:
      return RNSBlurEffectStyleSystemThickMaterial;
    case SystemChromeMaterial:
      return RNSBlurEffectStyleSystemChromeMaterial;
    case SystemUltraThinMaterialLight:
      return RNSBlurEffectStyleSystemUltraThinMaterialLight;
    case SystemThinMaterialLight:
      return RNSBlurEffectStyleSystemThinMaterialLight;
    case SystemMaterialLight:
      return RNSBlurEffectStyleSystemMaterialLight;
    case SystemThickMaterialLight:
      return RNSBlurEffectStyleSystemThickMaterialLight;
    case SystemChromeMaterialLight:
      return RNSBlurEffectStyleSystemChromeMaterialLight;
    case SystemUltraThinMaterialDark:
      return RNSBlurEffectStyleSystemUltraThinMaterialDark;
    case SystemThinMaterialDark:
      return RNSBlurEffectStyleSystemThinMaterialDark;
    case SystemMaterialDark:
      return RNSBlurEffectStyleSystemMaterialDark;
    case SystemThickMaterialDark:
      return RNSBlurEffectStyleSystemThickMaterialDark;
    case SystemChromeMaterialDark:
      return RNSBlurEffectStyleSystemChromeMaterialDark;
    default:
      RCTLogError(@"[RNScreens] unsupported blur effect style");
      return RNSBlurEffectStyleNone;
#else // !TARGET_OS_TV
    default:
      return RNSBlurEffectStyleNone;
#endif // !TARGET_OS_TV
  }
}

#endif // RCT_NEW_ARCH_ENABLED

+ (UIBlurEffectStyle)tryConvertRNSBlurEffectStyleToUIBlurEffectStyle:(RNSBlurEffectStyle)blurEffect
{
#ifdef RCT_NEW_ARCH_ENABLED
  react_native_assert(blurEffect != RNSBlurEffectStyleNone && blurEffect != RNSBlurEffectStyleSystemDefault);
#else
  RCTAssert(
      blurEffect != RNSBlurEffectStyleNone && blurEffect != RNSBlurEffectStyleSystemDefault,
      @"RNSBlurEffectStyleNone and RNSBlurEffectStyleSystemDefault variants are not convertible to UIBlurEffectStyle");
#endif // RCT_NEW_ARCH_ENABLED

  // Cast safety: RNSBlurEffectStyle is defined in such way that its values map 1:1 with
  // UIBlurEffectStyle, except RNSBlurEffectStyleNone and RNSBlurEffectStyleSystemDefault which are excluded above.
  return (UIBlurEffectStyle)blurEffect;
}

@end
