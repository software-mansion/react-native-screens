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

#pragma mark - Class methods

+ (BOOL)shouldGuardScrollToTop
{
  // The system scroll-to-top-on-header interaction has been present on iPadOS since iOS 26...
  if (@available(iOS 26.0, *)) {
    if (UIDevice.currentDevice.userInterfaceIdiom == UIUserInterfaceIdiomPad) {
      return YES;
    }
  }
  // ...and was extended to iPhone in iOS 27.
  if (@available(iOS 27.0, *)) {
    if (UIDevice.currentDevice.userInterfaceIdiom == UIUserInterfaceIdiomPhone) {
      return YES;
    }
  }
  return NO;
}

+ (void)applyToView:(nonnull UIView *)view
{
  [view addGestureRecognizer:[RNSScrollToTopGuardGestureRecognizer new]];
}

#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)

@end
