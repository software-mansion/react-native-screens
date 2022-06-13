#import "RNSConvert.h"

#ifdef RN_FABRIC_ENABLED

#import <React/RCTConversions.h>

@implementation RNSConvert

+ (RNSScreenStackPresentation)RNSScreenStackPresentationFromCppEquivalent:
    (facebook::react::RNSScreenStackPresentation)stackPresentation
{
  switch (stackPresentation) {
    case facebook::react::RNSScreenStackPresentation::Push:
      return RNSScreenStackPresentationPush;
    case facebook::react::RNSScreenStackPresentation::Modal:
      return RNSScreenStackPresentationModal;
    case facebook::react::RNSScreenStackPresentation::FullScreenModal:
      return RNSScreenStackPresentationFullScreenModal;
    case facebook::react::RNSScreenStackPresentation::FormSheet:
      return RNSScreenStackPresentationFormSheet;
    case facebook::react::RNSScreenStackPresentation::ContainedModal:
      return RNSScreenStackPresentationContainedModal;
    case facebook::react::RNSScreenStackPresentation::TransparentModal:
      return RNSScreenStackPresentationTransparentModal;
    case facebook::react::RNSScreenStackPresentation::ContainedTransparentModal:
      return RNSScreenStackPresentationContainedTransparentModal;
  }
}

+ (RNSScreenStackAnimation)RNSScreenStackAnimationFromCppEquivalent:
    (facebook::react::RNSScreenStackAnimation)stackAnimation
{
  switch (stackAnimation) {
    // these three are intentionally grouped
    case facebook::react::RNSScreenStackAnimation::Slide_from_right:
    case facebook::react::RNSScreenStackAnimation::Slide_from_left:
    case facebook::react::RNSScreenStackAnimation::Default:
      return RNSScreenStackAnimationDefault;
    case facebook::react::RNSScreenStackAnimation::Flip:
      return RNSScreenStackAnimationFlip;
    case facebook::react::RNSScreenStackAnimation::Simple_push:
      return RNSScreenStackAnimationSimplePush;
    case facebook::react::RNSScreenStackAnimation::None:
      return RNSScreenStackAnimationNone;
    case facebook::react::RNSScreenStackAnimation::Fade:
      return RNSScreenStackAnimationFade;
    case facebook::react::RNSScreenStackAnimation::Slide_from_bottom:
      return RNSScreenStackAnimationSlideFromBottom;
    case facebook::react::RNSScreenStackAnimation::Fade_from_bottom:
      return RNSScreenStackAnimationFadeFromBottom;
  }
}

+ (RNSScreenStackHeaderSubviewType)RNSScreenStackHeaderSubviewTypeFromCppEquivalent:
    (facebook::react::RNSScreenStackHeaderSubviewType)subviewType
{
  switch (subviewType) {
    case facebook::react::RNSScreenStackHeaderSubviewType::Left:
      return RNSScreenStackHeaderSubviewTypeLeft;
    case facebook::react::RNSScreenStackHeaderSubviewType::Right:
      return RNSScreenStackHeaderSubviewTypeRight;
    case facebook::react::RNSScreenStackHeaderSubviewType::Title:
      return RNSScreenStackHeaderSubviewTypeTitle;
    case facebook::react::RNSScreenStackHeaderSubviewType::Center:
      return RNSScreenStackHeaderSubviewTypeCenter;
    case facebook::react::RNSScreenStackHeaderSubviewType::SearchBar:
      return RNSScreenStackHeaderSubviewTypeSearchBar;
    case facebook::react::RNSScreenStackHeaderSubviewType::Back:
      return RNSScreenStackHeaderSubviewTypeBackButton;
  }
}

+ (RNSScreenReplaceAnimation)RNSScreenReplaceAnimationFromCppEquivalent:
    (facebook::react::RNSScreenReplaceAnimation)replaceAnimation
{
  switch (replaceAnimation) {
    case facebook::react::RNSScreenReplaceAnimation::Pop:
      return RNSScreenReplaceAnimationPop;
    case facebook::react::RNSScreenReplaceAnimation::Push:
      return RNSScreenReplaceAnimationPush;
  }
}

+ (RNSScreenSwipeDirection)RNSScreenSwipeDirectionFromCppEquivalent:
    (facebook::react::RNSScreenSwipeDirection)swipeDirection
{
  switch (swipeDirection) {
    case facebook::react::RNSScreenSwipeDirection::Horizontal:
      return RNSScreenSwipeDirectionHorizontal;
    case facebook::react::RNSScreenSwipeDirection::Vertical:
      return RNSScreenSwipeDirectionVertical;
  }
}

+ (NSDictionary *)gestureResponseDistanceDictFromCppStruct:
    (const facebook::react::RNSScreenGestureResponseDistanceStruct &)gestureResponseDistance
{
  return @{
    @"start" : @(gestureResponseDistance.start),
    @"end" : @(gestureResponseDistance.end),
    @"top" : @(gestureResponseDistance.top),
    @"bottom" : @(gestureResponseDistance.bottom),
  };
}

+ (NSArray<RNSSharedElementTransitionOptions *> *)sharedElementTransitionsFromCppStruct:
    (const std::vector<facebook::react::RNSScreenSharedElementTransitionsStruct> &)sharedElementTransitions
{
  NSMutableArray<RNSSharedElementTransitionOptions *> *result = [NSMutableArray array];

  for (auto sharedElementTransitionStruct : sharedElementTransitions) {
    RNSSharedElementTransitionOptions *option = [[RNSSharedElementTransitionOptions alloc] init];

    option.from = RCTNSStringFromStringNilIfEmpty(sharedElementTransitionStruct.from);
    option.to = RCTNSStringFromStringNilIfEmpty(sharedElementTransitionStruct.to);
    option.delay = sharedElementTransitionStruct.delay / 1000;
    option.duration = sharedElementTransitionStruct.duration / 1000;
    option.damping = sharedElementTransitionStruct.damping;
    option.initialVelocity = sharedElementTransitionStruct.initialVelocity;
    option.showFromElementDuringAnimation = sharedElementTransitionStruct.showFromElementDuringAnimation;
    option.showToElementDuringAnimation = sharedElementTransitionStruct.showToElementDuringAnimation;

    NSString *easing = RCTNSStringFromStringNilIfEmpty(sharedElementTransitionStruct.easing);
    if (easing == nil || [easing isEqual:@"linear"]) {
      option.easing = RNSSharedElementTransitionEasingLinear;
    } else if ([easing isEqual:@"ease-in"]) {
      option.easing = RNSSharedElementTransitionEasingEaseIn;
    } else if ([easing isEqual:@"ease-out"]) {
      option.easing = RNSSharedElementTransitionEasingEaseOut;
    } else if ([easing isEqual:@"ease-in-out"]) {
      option.easing = RNSSharedElementTransitionEasingEaseInOut;
    }

    NSString *resizeMode = RCTNSStringFromStringNilIfEmpty(sharedElementTransitionStruct.resizeMode);
    if (resizeMode == nil || [resizeMode isEqual:@"resize"]) {
      option.resizeMode = RNSSharedElementTransitionResizeModeResize;
    } else if ([resizeMode isEqual:@"none"]) {
      option.resizeMode = RNSSharedElementTransitionResizeModeNone;
    }

    NSString *align = RCTNSStringFromStringNilIfEmpty(sharedElementTransitionStruct.align);
    if (align == nil || [align isEqual:@"left-top"]) {
      option.align = RNSSharedElementTransitionAlignLeftTop;
    } else if ([align isEqual:@"left-center"]) {
      option.align = RNSSharedElementTransitionAlignLeftCenter;
    } else if ([align isEqual:@"left-bottom"]) {
      option.align = RNSSharedElementTransitionAlignLeftBottom;
    } else if ([align isEqual:@"center-top"]) {
      option.align = RNSSharedElementTransitionAlignCenterTop;
    } else if ([align isEqual:@"center-center"]) {
      option.align = RNSSharedElementTransitionAlignCenterCenter;
    } else if ([align isEqual:@"center-bottom"]) {
      option.align = RNSSharedElementTransitionAlignCenterBottom;
    } else if ([align isEqual:@"right-top"]) {
      option.align = RNSSharedElementTransitionAlignRightTop;
    } else if ([align isEqual:@"right-center"]) {
      option.align = RNSSharedElementTransitionAlignRightCenter;
    } else if ([align isEqual:@"right-bottom"]) {
      option.align = RNSSharedElementTransitionAlignRightBottom;
    }

    [result addObject:option];
  }
  return result;
}

@end

#endif // RN_FABRIC_ENABLED
