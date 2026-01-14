#import "RNSViewInteractionManager.h"
#import "RNSBottomTabsScreenComponentView.h"
#import "RNSViewInteractionAware.h"

@implementation RNSViewInteractionManager {
  __weak UIView *lastRootWithInteractionsDisabled;
}

- (instancetype)init
{
  if (self = [super init]) {
    lastRootWithInteractionsDisabled = nil;
  }
  return self;
}

- (void)disableInteractionsForSubtreeWith:(UIView *)view
{
  UIView *current = view;
  while (current && ![current isKindOfClass:UIWindow.class] &&
         ![current respondsToSelector:@selector(rnscreens_disableInteractions)]) {
    current = current.superview;
  }

  if (current) {
    if (lastRootWithInteractionsDisabled && lastRootWithInteractionsDisabled != current) {
      // When one view already has interactions disabled, and we request a different view,
      // we need to restore the first one
      [self enableInteractionsForLastSubtree];
    }

    if ([current respondsToSelector:@selector(rnscreens_disableInteractions)]) {
      [static_cast<id<RNSViewInteractionAware>>(current) rnscreens_disableInteractions];
    } else {
      current.userInteractionEnabled = NO;
    }

    lastRootWithInteractionsDisabled = current;
  }
}

- (void)enableInteractionsForLastSubtree
{
  if (lastRootWithInteractionsDisabled) {
    if ([lastRootWithInteractionsDisabled respondsToSelector:@selector(rnscreens_enableInteractions)]) {
      [static_cast<id<RNSViewInteractionAware>>(lastRootWithInteractionsDisabled) rnscreens_enableInteractions];
    } else {
      lastRootWithInteractionsDisabled.userInteractionEnabled = YES;
    }

    lastRootWithInteractionsDisabled = nil;
  }
}

@end
