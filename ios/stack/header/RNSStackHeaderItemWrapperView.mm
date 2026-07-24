#import "RNSStackHeaderItemWrapperView.h"
#import "RNSDefines.h"

@implementation RNSStackHeaderItemWrapperView

- (instancetype)initWithDelegate:(nullable id<RNSViewFrameChangeDelegate>)delegate
{
  if (self = [super init]) {
    _delegate = delegate;
  }
  return self;
}

/**
 Notify the delegate when the view changes bounds.
 This is required specifically for iOS 26 navigation bar layout.
 */
- (void)setBounds:(CGRect)bounds
{
  [super setBounds:bounds];

  UINavigationBar *navBar = [self findNavigationBar];
  if (navBar != nil) {
    [_delegate viewFrameDidChange:navBar];
  }
}

/**
 Notify the delegate when the view is added to the navigation bar
 and is required for the first layout to succeed on iOS 26.
 */
- (void)didMoveToWindow
{
  [super didMoveToWindow];

  UINavigationBar *navBar = [self findNavigationBar];
  if (navBar != nil) {
    [_delegate viewFrameDidChange:navBar];
  }
}

/**
 Notify the delegate when the view changes in any way so that react state can be updated accordingly.
 This is required for iOS 18 specifically, since setBounds etc are called too early.
 */
- (void)layoutSubviews
{
  [super layoutSubviews];

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
