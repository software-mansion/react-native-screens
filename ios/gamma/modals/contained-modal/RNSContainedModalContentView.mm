#import "RNSContainedModalContentView.h"

@implementation RNSContainedModalContentView

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    // Explicitly set to clearColor since this UIView is manually added
    // into the view hierarchy. This ensures it doesn't interfere with
    // any background colors defined by child React subviews.
    self.backgroundColor = [UIColor clearColor];
    // Ensure the view stretches to fill the presentation context
    self.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
  }
  return self;
}

#pragma mark - RN Subviews Management

- (void)insertReactSubview:(UIView *)subview atIndex:(NSInteger)index
{
  [self insertSubview:subview atIndex:index];
}

- (void)removeReactSubview:(UIView *)subview
{
  [subview removeFromSuperview];
}

@end
