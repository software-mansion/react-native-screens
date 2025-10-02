#import "RNSBottomTabsAccessoryWrapperView.h"
#import "RNSBottomAccessoryHelper.h"
#import "RNSBottomTabsAccessoryComponentView.h"

@implementation RNSBottomTabsAccessoryWrapperView {
  RNSBottomTabsAccessoryComponentView *_accessoryView;
}

- (instancetype)initWithAccessoryView: (RNSBottomTabsAccessoryComponentView *)accessoryView
{
  if (self = [super init]) {
    _accessoryView = accessoryView;
    [self addSubview:accessoryView];
  }
  
  return self;
}

- (void)setFrame:(CGRect)frame
{
  [super setFrame:frame];
  if (!CGRectEqualToRect(frame, CGRectZero)) {
    [_accessoryView.helper notifyTransitionStart];
  }
}

@end
