#import "RNSBottomTabsAccessoryWrapperView.h"
#import "RNSBottomAccessoryHelper.h"
#import "RNSBottomTabsAccessoryComponentView.h"

@implementation RNSBottomTabsAccessoryWrapperView

- (instancetype)initWithAccessoryView: (RNSBottomTabsAccessoryComponentView *)accessoryView
{
  if (self = [super init]) {
    [self addSubview:accessoryView];
  }
  
  return self;
}

- (void)setFrame:(CGRect)frame
{
  [super setFrame:frame];
  [_helper setDestinationFrame:frame];
}

@end
