#import "RNSScrollToTopGuardGestureRecognizer.h"
#import "RNSDefines.h"

@implementation RNSScrollToTopGuardGestureRecognizer

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)

- (instancetype)init
{
  if (self = [super initWithTarget:self action:nil]) {
    self.cancelsTouchesInView = NO;
    self.delegate = self;
  }
  return self;
}

#pragma mark - UIGestureRecognizerDelegate

- (BOOL)gestureRecognizer:(UIGestureRecognizer *)gestureRecognizer
    shouldRecognizeSimultaneouslyWithGestureRecognizer:(UIGestureRecognizer *)otherGestureRecognizer
{
  return YES;
}

- (BOOL)gestureRecognizer:(UIGestureRecognizer *)gestureRecognizer
    shouldBeRequiredToFailByGestureRecognizer:(UIGestureRecognizer *)otherGestureRecognizer
{
  // We want to target tap gesture recognizers only (one responsible for scroll to top must be one).
  if (![otherGestureRecognizer isKindOfClass:[UITapGestureRecognizer class]]) {
    return NO;
  }

  // We don't know the exact recognizer responsible for scroll to top so we block all
  // gesture recognizers above us.
  return ![otherGestureRecognizer.view isDescendantOfView:gestureRecognizer.view];
}

#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)

+ (void)applyToViewIfNecessary:(nonnull UIView *)view
{
#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
  if (@available(iOS 26.0, *)) {
    if (UIDevice.currentDevice.userInterfaceIdiom == UIUserInterfaceIdiomPad) {
      [view addGestureRecognizer:[RNSScrollToTopGuardGestureRecognizer new]];
    }
  }
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
}

@end
