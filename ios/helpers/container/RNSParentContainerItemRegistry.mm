#import "RNSParentContainerItemRegistry.h"

#import "RNSContainer.h"
#import "RNSContainerItem.h"

@interface RNSParentContainerItemRegistry ()
- (nullable id<RNSContainerItem>)findParentContainerItemFrom:(UIViewController *)viewController;
@end

@implementation RNSParentContainerItemRegistry {
  __weak id<RNSContainerItem> _parentItem;
}

- (void)attachContainer:(UIViewController<RNSContainer> *)container
{
  id<RNSContainerItem> parentItem = [self findParentContainerItemFrom:container];
  if (parentItem != nil) {
    [parentItem registerNestedContainer:container];
  }
  _parentItem = parentItem;
}

- (void)detachContainer:(UIViewController<RNSContainer> *)container
{
  [_parentItem unregisterNestedContainer:container];
  _parentItem = nil;
}

/**
 * Walks the view-controller containment chain (`parentViewController`) upwards looking for the
 * nearest `RNSContainerItem`. We test via `respondsToSelector:` rather than `conformsToProtocol:`
 * to match the lock-free idiom used elsewhere (e.g. `RNSScrollViewMarkerComponentView`).
 */
- (nullable id<RNSContainerItem>)findParentContainerItemFrom:(UIViewController *)viewController
{
  UIViewController *parent = viewController.parentViewController;
  while (parent != nil) {
    if ([parent respondsToSelector:@selector(registerNestedContainer:)]) {
      return static_cast<id<RNSContainerItem>>(parent);
    }
    parent = parent.parentViewController;
  }
  return nil;
}

@end
