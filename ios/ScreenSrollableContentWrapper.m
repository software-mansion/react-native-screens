#import "ScreenSrollableContentWrapper.h"

@implementation ScreenSrollableContentWrapper

- (void)layoutSubviews
{
  [super layoutSubviews];
  if (self.onLayout != nil) {
    self.onLayout(self.frame);
  }
}

@end
