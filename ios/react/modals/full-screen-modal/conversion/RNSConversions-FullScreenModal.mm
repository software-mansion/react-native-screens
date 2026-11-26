#import "RNSConversions-FullScreenModal.h"

#import <React/RCTLog.h>

namespace rnscreens::conversion {

RNSFullScreenModalPresentationStyle RNSFullScreenModalPresentationStyleFromHostProp(
    react::RNSFullScreenModalHostPresentationStyle presentationStyle)
{
  switch (presentationStyle) {
    using enum react::RNSFullScreenModalHostPresentationStyle;
    case OverContent:
      return RNSFullScreenModalPresentationStyleOverContent;
    case ReplacingContent:
      return RNSFullScreenModalPresentationStyleReplacingContent;
    default:
      RCTLogError(@"[RNScreens] Unsupported presentationStyle value, falling back to replacingContent.");
      return RNSFullScreenModalPresentationStyleReplacingContent;
  }
}

RNSFullScreenModalAnimation RNSFullScreenModalAnimationFromHostProp(react::RNSFullScreenModalHostAnimation animation)
{
  switch (animation) {
    using enum react::RNSFullScreenModalHostAnimation;
    case Default:
      return RNSFullScreenModalAnimationDefault;
    case None:
      return RNSFullScreenModalAnimationNone;
    case CoverVertical:
      return RNSFullScreenModalAnimationCoverVertical;
    case CrossDissolve:
      return RNSFullScreenModalAnimationCrossDissolve;
    case FlipHorizontal:
      return RNSFullScreenModalAnimationFlipHorizontal;
    default:
      RCTLogError(@"[RNScreens] Unsupported animation value, falling back to default.");
      return RNSFullScreenModalAnimationDefault;
  }
}

}; // namespace rnscreens::conversion
