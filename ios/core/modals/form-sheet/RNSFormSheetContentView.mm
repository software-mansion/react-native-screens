#import "RNSFormSheetContentView.h"

@implementation RNSFormSheetContentView

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    // Explicitly set to clearColor since this UIView is manually added
    // into the view hierarchy. This ensures it doesn't interfere with
    // any background colors defined by child React subviews.
    self.backgroundColor = [UIColor clearColor];
  }
  return self;
}

@end
