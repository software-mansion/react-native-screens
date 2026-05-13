#import "RNSStackHeaderItemWrapperView.h"

@implementation RNSStackHeaderItemWrapperView

- (instancetype)initWithDelegate:(nullable id<RNSViewFrameChangeDelegate>)delegate
{
  if (self = [super init]) {
    _delegate = delegate;
  }
  return self;
}

- (void)setBounds:(CGRect)bounds
{
  [super setBounds:bounds];

  UINavigationBar *navBar = [self findNavigationBar];
  if (navBar != nil) {
    [_delegate viewFrameDidChange:navBar];
  }
}

- (nullable UINavigationBar *)findNavigationBar
{
  UIView *current = self.superview;
  while (current != nil) {
    if ([current isKindOfClass:UINavigationBar.class]) {
      return (UINavigationBar *)current;
    }
    current = current.superview;
  }
  return nil;
}

@end
