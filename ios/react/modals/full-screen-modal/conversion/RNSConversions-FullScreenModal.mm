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

RNSFullScreenModalTransition RNSFullScreenModalTransitionFromHostProp(
    react::RNSFullScreenModalHostTransition transition)
{
  switch (transition) {
    using enum react::RNSFullScreenModalHostTransition;
    case Automatic:
      return RNSFullScreenModalTransitionAutomatic;
    case Fade:
      return RNSFullScreenModalTransitionFade;
    case Flip:
      return RNSFullScreenModalTransitionFlip;
    case None:
      return RNSFullScreenModalTransitionNone;
    default:
      RCTLogError(@"[RNScreens] Unsupported transition value, falling back to automatic.");
      return RNSFullScreenModalTransitionAutomatic;
  }
}

RNSOrientation RNSOrientationFromFullScreenModalHostOrientation(react::RNSFullScreenModalHostOrientation orientation)
{
  switch (orientation) {
    using enum react::RNSFullScreenModalHostOrientation;
    case Inherit:
      return RNSOrientationInherit;
    case All:
      return RNSOrientationAll;
    case AllButUpsideDown:
      return RNSOrientationAllButUpsideDown;
    case Portrait:
      return RNSOrientationPortrait;
    case PortraitUp:
      return RNSOrientationPortraitUp;
    case PortraitDown:
      return RNSOrientationPortraitDown;
    case Landscape:
      return RNSOrientationLandscape;
    case LandscapeLeft:
      return RNSOrientationLandscapeLeft;
    case LandscapeRight:
      return RNSOrientationLandscapeRight;
    default:
      RCTLogError(@"[RNScreens] Unsupported orientation value, falling back to inherit.");
      return RNSOrientationInherit;
  }
}

}; // namespace rnscreens::conversion
