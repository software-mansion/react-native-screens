#import "RNSTabsScreenViewController.h"
#import "RNSTabBarController.h"

@implementation RNSTabsScreenViewController

- (nullable RNSTabBarController *)findTabBarController
{
  return static_cast<RNSTabBarController *>(self.tabBarController);
}

- (nullable RNSBottomTabsScreenComponentView *)tabScreenComponentView
{
  return static_cast<RNSBottomTabsScreenComponentView *>(self.view);
}

- (void)tabScreenFocusHasChanged
{
  NSLog(@"TabScreen [%ld] changed focus: %d", self.tabScreenComponentView.tag, self.tabScreenComponentView.isFocused);

  // The focus of owned tab has been updated from react. We tell the parent controller that it should update the
  // container.
  [[self findTabBarController] setNeedsUpdateOfSelectedTab:true];
}

- (void)viewWillAppear:(BOOL)animated
{
  [self.tabScreenComponentView emitOnWillAppear];
}

- (void)viewDidAppear:(BOOL)animated
{
  [self.tabScreenComponentView emitOnDidAppear];
}

- (void)viewWillDisappear:(BOOL)animated
{
  [self.tabScreenComponentView emitOnWillDisappear];
}

- (void)viewDidDisappear:(BOOL)animated
{
  [self.tabScreenComponentView emitOnDidDisappear];
}

@end
