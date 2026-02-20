#import "RNSBarView+Internal.h"
#import <React/UIView+React.h>

@implementation RNSBarView (Toolbar)

- (BOOL)replaceBottomBarButtonItem:(UIBarButtonItem *)barButton
                          withItem:(UIBarButtonItem *)replacement
                    viewController:(UIViewController *)viewController
{
  NSArray<UIBarButtonItem *> *items = viewController.toolbarItems;
  NSUInteger index = [items indexOfObjectIdenticalTo:barButton];
  if (index == NSNotFound) {
    return NO;
  }

  NSMutableArray<UIBarButtonItem *> *mutableItems = [items mutableCopy];
  mutableItems[index] = replacement;
  [viewController setToolbarItems:mutableItems animated:YES];
  _appliedToolbarItemArray = [mutableItems copy];
  return YES;
}

- (void)updateBottomBarItemsWithViewController:(UIViewController *)viewController
{
  UINavigationController *navigationController = viewController.navigationController;
  if (navigationController == nil) {
    return;
  }

  [self resetBarMappings];

  NSArray<UIBarButtonItem *> *items = [self barItemsForChildren];
  [viewController setToolbarItems:items animated:YES];
  _appliedToolbarItemArray = items;
  if (!_originalToolbarHiddenKnown) {
    _originalToolbarHidden = navigationController.isToolbarHidden;
    _originalToolbarHiddenKnown = YES;
  }
  [navigationController setToolbarHidden:NO animated:NO];

  _appliedToolbarItems = YES;
}

- (void)clearBottomBarIfNeeded
{
  if (!_appliedToolbarItems) {
    return;
  }

  UIViewController *viewController = self.reactViewController;
  if (viewController == nil) {
    return;
  }

  if (_appliedToolbarItemArray != nil &&
      [viewController.toolbarItems isEqualToArray:_appliedToolbarItemArray]) {
    viewController.toolbarItems = nil;
  }

  UINavigationController *navigationController = viewController.navigationController;
  if (navigationController != nil && _originalToolbarHiddenKnown) {
    [navigationController setToolbarHidden:_originalToolbarHidden animated:NO];
    _originalToolbarHiddenKnown = NO;
  }

  _appliedToolbarItems = NO;
  _appliedToolbarItemArray = nil;
}

@end
