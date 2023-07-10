#import "RNSScreenModal.h"

@implementation RNSScreenModal

+ (BOOL)isTransparentModal:(UIModalPresentationStyle)presentationStyle
{
  return presentationStyle == UIModalPresentationOverFullScreen;
}

+ (BOOL)isGrabbableModal:(UIModalPresentationStyle)presentationStyle
{
  if (@available(iOS 13.0, tvOS 13.0, *)) {
    return presentationStyle == UIModalPresentationAutomatic;
  } else {
    return presentationStyle == UIModalPresentationFullScreen;
  }
}

+ (BOOL)isFullscreenModal:(UIModalPresentationStyle)presentationStyle
{
  switch (presentationStyle) {
    case UIModalPresentationFullScreen:
    case UIModalPresentationCurrentContext:
    case UIModalPresentationOverCurrentContext:
      return true;
    default:
      return false;
  }
}

@end
