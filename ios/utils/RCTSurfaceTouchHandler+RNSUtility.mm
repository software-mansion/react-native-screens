#ifdef RNS_NEW_ARCH_ENABLED
#import "RCTSurfaceTouchHandler+RNSUtility.h"

@implementation RCTSurfaceTouchHandler (RNSUtility)

- (void)rnscreens_cancelTouches
{
  [self setEnabled:NO];
  [self setEnabled:YES];
  [self reset];
}

@end
#endif // RNS_NEW_ARCH_ENABLED
