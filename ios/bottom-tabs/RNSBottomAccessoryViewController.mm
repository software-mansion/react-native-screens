#import "RNSBottomAccessoryViewController.h"

@implementation RNSBottomAccessoryViewController

- (nullable RNSBottomTabsAccessoryComponentView *)bottomAccessoryComponentView
{
  return static_cast<RNSBottomTabsAccessoryComponentView *>(self.view);
}

@end
