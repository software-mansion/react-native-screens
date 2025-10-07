#import "RNSBottomTabsAccessoryWrapperView.h"
#import "RNSBottomAccessoryHelper.h"
#import "RNSBottomTabsAccessoryComponentView.h"

@implementation RNSBottomTabsAccessoryWrapperView {
  RNSBottomTabsAccessoryComponentView *_accessoryView;
}

// TODO: if possible, remove this view completely, use plain UIView
- (instancetype)initWithAccessoryView:(RNSBottomTabsAccessoryComponentView *)accessoryView
{
  if (self = [super init]) {
    _accessoryView = accessoryView;
    [self addSubview:accessoryView];
  }

  return self;
}

- (void)registerForAccessoryFrameChanges
{
  [_accessoryView.helper registerForAccessoryFrameChanges];
}

@end
