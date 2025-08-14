#import "RNSFrameCorrector.h"

@implementation RNSFrameCorrector

/**
 This correction is performed synchronously to resolve the following issue:
 1. On the transition begin, the animation may expect the target frame to be set immediately, e.g. in SplitView
 for triggering the transition animation, we need to know the final frame on animation start.
 2. When a layout recalculation is dependent on Yoga - it's performed asynchronously, so the frame for the nested
 component might be in 'stale' state, e.g. when the transition begins.
 3. Until Yoga will compute the new layout, the reference value for the frame passed to the animation will be
 wrong.
 4. As we don't have a control, when the animation will start, we need to apply frame correction synchronously to
 guarantee that it takes the proper frame width as a reference.
 */
+ (void)applyFrameCorrectionFor:(UIView *)view
     inContextOfSplitViewColumn:(RNSSplitViewScreenComponentView *)splitViewScreen
{
  CGRect originalFrame = view.frame;
  view.frame = CGRectMake(
      originalFrame.origin.x, originalFrame.origin.y, splitViewScreen.frame.size.width, originalFrame.size.height);
}

@end
