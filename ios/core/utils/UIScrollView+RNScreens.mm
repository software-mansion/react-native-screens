#import "UIScrollView+RNScreens.h"

@implementation UIScrollView (RNScreens)

- (BOOL)rnscreens_scrollToTop
{
  if ([self contentOffset].y != -self.adjustedContentInset.top) {
    [self setContentOffset:CGPointMake(0, -self.adjustedContentInset.top) animated:YES];
    return YES;
  }

  return NO;
}

@end
