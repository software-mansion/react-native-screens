#import "RCTSurfaceTouchHandler+RNSUtility.h"

@implementation RCTSurfaceTouchHandler (RNSUtility)

- (void)rnscreens_cancelTouches
{
  [self setEnabled:NO];
  [self setEnabled:YES];
  [self reset];
}

@end
