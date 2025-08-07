#import "RNSFrameCorrector3097.h"

@implementation RNSFrameCorrector3097

+ (void)applyFrameCorrectionFor:(UIView *)view
     inContextOfSplitViewColumn:(RNSSplitViewScreenComponentView *)splitViewScreen
{
  CGRect originalFrame = view.frame;
  view.frame = CGRectMake(
      originalFrame.origin.x, originalFrame.origin.y, splitViewScreen.frame.size.width, originalFrame.size.height);
}

@end
