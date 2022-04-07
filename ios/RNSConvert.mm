#import "RNSConvert.h"

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

@end
