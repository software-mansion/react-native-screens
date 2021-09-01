#import "RNSOverlayView.h"
#import "UIWindow+RNScreens.h"

@implementation UIWindow (RNScreens)

- (void)didAddSubview:(UIView *)subview
{
  if (![subview isKindOfClass:[RNSOverlayViewContainer class]]) {
    for (UIView *view in self.subviews) {
      if ([view isKindOfClass:[RNSOverlayViewContainer class]]) {
        [self bringSubviewToFront:view];
      }
    }
  }
}

@end
