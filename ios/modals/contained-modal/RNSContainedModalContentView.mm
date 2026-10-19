#import "RNSContainedModalContentView.h"

@implementation RNSContainedModalContentView

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    // Transparent, so child React views own the background.
    self.backgroundColor = [UIColor clearColor];
    // Keep filling the presentation container.
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
