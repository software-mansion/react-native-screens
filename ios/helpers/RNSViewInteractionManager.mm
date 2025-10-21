#import "RNSViewInteractionManager.h"
#import "RNSBottomTabsScreenComponentView.h"

@implementation RNSViewInteractionManager {
  __weak UIView *lastRootWithInteractionsDisabled;
}

- (instancetype)init
{
  lastRootWithInteractionsDisabled = nil;
  return self;
}

- (void)disableInteractionsForSubtreeWith:(UIView *)view
{
  UIView *parent = view.superview;
  while (parent && ![parent isKindOfClass:UIWindow.class] &&
         ![parent isKindOfClass:RNSBottomTabsScreenComponentView.class]) {
    parent = parent.superview;
  }

  if (parent) {
    if (lastRootWithInteractionsDisabled && lastRootWithInteractionsDisabled != parent) {
      // When one view already has interactions disabled, and we request a different view,
      // we need to restore the first one
      lastRootWithInteractionsDisabled.userInteractionEnabled = YES;
    }

    parent.userInteractionEnabled = NO;
    lastRootWithInteractionsDisabled = parent;
  }
}

- (void)enableInteractionsForLastSubtree
{
  if (lastRootWithInteractionsDisabled) {
    lastRootWithInteractionsDisabled.userInteractionEnabled = YES;
    lastRootWithInteractionsDisabled = nil;
  }
}

@end
