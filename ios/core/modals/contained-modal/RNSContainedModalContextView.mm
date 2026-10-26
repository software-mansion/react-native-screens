#import "RNSContainedModalContextView.h"

@implementation RNSContainedModalContextView

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    // Transparent, so the mounted children own the background.
    self.backgroundColor = [UIColor clearColor];
    // Keep filling the owning provider view.
    self.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
  }
  return self;
}

@end
