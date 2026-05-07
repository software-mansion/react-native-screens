#import "RNSSwipeableRegistry.h"

@implementation RNSSwipeableRegistry

static CGRect sOpenSwipeableFrame = CGRectNull;

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(setOpenSwipeableFrame : (double)x y : (double)y width : (double)width height : (double)height)
{
  sOpenSwipeableFrame = CGRectMake(x, y, width, height);
}

RCT_EXPORT_METHOD(clearOpenSwipeable)
{
  sOpenSwipeableFrame = CGRectNull;
}

+ (BOOL)hasOpenSwipeableContainingPoint:(CGPoint)point
{
  if (CGRectIsNull(sOpenSwipeableFrame) || CGRectIsEmpty(sOpenSwipeableFrame)) {
    return NO;
  }

  return CGRectContainsPoint(sOpenSwipeableFrame, point);
}

@end
