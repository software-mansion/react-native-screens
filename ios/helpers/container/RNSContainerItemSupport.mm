#import "RNSContainerItemSupport.h"

#import "RNSContainer.h"
#import "RNSScrollViewFinder.h"

@implementation RNSContainerItemSupport {
  __weak id<RNSContainer> _nestedContainer;
}

- (void)registerNestedContainer:(id<RNSContainer>)container
{
  _nestedContainer = container;
}

- (void)unregisterNestedContainer:(id<RNSContainer>)container
{
  // Only clear if the currently held container is the one being unregistered. A stale container
  // detaching after a newer one already registered must not clear the newer reference.
  if (_nestedContainer == container) {
    _nestedContainer = nil;
  }
}

- (nullable id<RNSContainer>)resolveNestedContainer
{
  return _nestedContainer;
}

- (nullable UIScrollView *)findContentScrollViewWithCachedScrollView:(nullable UIScrollView *)cachedScrollView
                                                       heuristicRoot:(nullable UIView *)rootView
{
  // Cached one (registered on the owner's view by the scroll view marker).
  if (cachedScrollView != nil) {
    return cachedScrollView;
  }

  // Provided by nested container.
  if (UIScrollView *fromNestedContainer = [_nestedContainer resolveCurrentContentScrollView];
      fromNestedContainer != nil) {
    return fromNestedContainer;
  }

  // Heuristic.
  return [RNSScrollViewFinder findScrollViewInFirstDescendantChainFrom:rootView];
}

@end
