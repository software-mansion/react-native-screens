#import "RNSConversions.h"
#import <React/RCTLog.h>

namespace rnscreens::conversion {

#if !TARGET_OS_TV
UIInterfaceOrientationMask UIInterfaceOrientationMaskFromRNSOrientation(RNSOrientation orientation)
{
  switch (orientation) {
    case RNSOrientationAll:
      return UIInterfaceOrientationMaskAll;
    case RNSOrientationAllButUpsideDown:
      return UIInterfaceOrientationMaskAllButUpsideDown;
    case RNSOrientationPortrait:
      return UIInterfaceOrientationMaskPortrait;
    case RNSOrientationPortraitUpsideDown:
      return UIInterfaceOrientationMaskPortraitUpsideDown;
    case RNSOrientationLandscape:
      return UIInterfaceOrientationMaskLandscape;
    case RNSOrientationLandscapeLeft:
      return UIInterfaceOrientationMaskLandscapeLeft;
    case RNSOrientationLandscapeRight:
      return UIInterfaceOrientationMaskLandscapeRight;
    case RNSOrientationInherit:
      RCTLogError(@"[RNScreens] RNSOrientationInherit does not map directly to any UIInterfaceOrientationMask");
      return 0;
    default:
      RCTLogError(@"[RNScreens] Unsupported orientation");
      return 0;
  }
}

RNSOrientation RNSOrientationFromUIInterfaceOrientationMask(UIInterfaceOrientationMask orientationMask)
{
  switch (orientationMask) {
    case UIInterfaceOrientationMaskAll:
      return RNSOrientationAll;
    case UIInterfaceOrientationMaskAllButUpsideDown:
      return RNSOrientationAllButUpsideDown;
    case UIInterfaceOrientationMaskLandscape:
      return RNSOrientationLandscape;
    case UIInterfaceOrientationMaskLandscapeLeft:
      return RNSOrientationLandscapeLeft;
    case UIInterfaceOrientationLandscapeRight:
      return RNSOrientationLandscapeRight;
    case UIInterfaceOrientationMaskPortraitUpsideDown:
      return RNSOrientationPortraitUpsideDown;
    case UIInterfaceOrientationMaskPortrait:
      return RNSOrientationPortrait;
    default:
      RCTLogError(@"[RNScreens] Unsupported orientation mask");
      return RNSOrientationInherit;
  }
}
#endif // !TARGET_OS_TV

}; // namespace rnscreens::conversion
