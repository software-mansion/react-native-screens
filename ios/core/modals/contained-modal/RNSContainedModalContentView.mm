#import "RNSContainedModalContentView.h"

@implementation RNSContainedModalContentView

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    // Transparent, so the mounted children own the background.
    self.backgroundColor = [UIColor clearColor];
    // Keep filling the presentation container.
    self.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
  }
  return self;
}

@end
