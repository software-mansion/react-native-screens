#import "RNSBarView+Internal.h"
#import <React/UIView+React.h>

@implementation RNSBarView (Header)

- (BOOL)replaceBarButtonItem:(UIBarButtonItem *)barButton
                    withItem:(UIBarButtonItem *)replacement
            inNavigationItem:(UINavigationItem *)navigationItem
                     segment:(ToolbarSegment)segment
{
  NSArray<UIBarButtonItem *> *items = segment == ToolbarSegmentLeft
    ? navigationItem.leftBarButtonItems
    : navigationItem.rightBarButtonItems;
  NSUInteger index = [items indexOfObjectIdenticalTo:barButton];
  if (index == NSNotFound) {
    return NO;
  }

  NSMutableArray<UIBarButtonItem *> *mutableItems = [items mutableCopy];
  mutableItems[index] = replacement;

  if (segment == ToolbarSegmentLeft) {
    [navigationItem setLeftBarButtonItems:mutableItems animated:YES];
    _appliedLeftItems = [mutableItems copy];
  } else {
    [navigationItem setRightBarButtonItems:mutableItems animated:YES];
    _appliedRightItems = [mutableItems copy];
  }

  return YES;
}

- (void)clearNavigationItemsIfNeeded
{
  if (!_appliedNavigationItems) {
    return;
  }

  UIViewController *viewController = self.reactViewController;
  if (viewController == nil) {
    return;
  }

  UINavigationItem *navigationItem = viewController.navigationItem;
  if (navigationItem == nil) {
    return;
  }

  if (_appliedLeftItems != nil &&
      [navigationItem.leftBarButtonItems isEqualToArray:_appliedLeftItems]) {
    navigationItem.leftBarButtonItems = nil;
  }
  if (_appliedRightItems != nil &&
      [navigationItem.rightBarButtonItems isEqualToArray:_appliedRightItems]) {
    navigationItem.rightBarButtonItems = nil;
  }

  _appliedNavigationItems = NO;
  _appliedLeftItems = nil;
  _appliedRightItems = nil;
}

@end
