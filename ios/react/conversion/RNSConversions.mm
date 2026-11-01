#import "RNSConversions.h"
#import <React/RCTLog.h>

namespace rnscreens::conversion {

#if !TARGET_OS_TV
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
    case UIInterfaceOrientationMaskLandscapeRight:
      return RNSOrientationLandscapeRight;
    case UIInterfaceOrientationMaskPortraitUpsideDown:
      return RNSOrientationPortraitDown;
    case UIInterfaceOrientationMaskPortrait:
      return RNSOrientationPortraitUp;
    case UIInterfaceOrientationMaskPortrait | UIInterfaceOrientationMaskPortraitUpsideDown:
      return RNSOrientationPortrait;
    default:
      RCTLogError(@"[RNScreens] Unsupported orientation mask");
      return RNSOrientationInherit;
  }
}
#endif // !TARGET_OS_TV

}; // namespace rnscreens::conversion
