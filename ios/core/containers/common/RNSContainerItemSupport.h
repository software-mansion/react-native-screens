#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@protocol RNSContainer;

/**
 * Composition holder for the `RNSContainerItem` side of the container-nesting mechanism.
 *
 * It owns the (weak) reference to the nested container and implements the content-scroll-view
 * resolution order shared by all container items. The cached content scroll view itself is NOT
 * owned here - it lives on the item's component view and is passed in by the owner.
 */
@interface RNSContainerItemSupport : NSObject

- (void)registerNestedContainer:(id<RNSContainer>)container;

- (void)unregisterNestedContainer:(id<RNSContainer>)container;

- (nullable id<RNSContainer>)resolveNestedContainer;

/**
 * Resolves the content scroll view using the shared order:
 *   1. the provided `cachedScrollView` (registered on the owner's view by the scroll view marker),
 *   2. the nested container's current content scroll view,
 *   3. a first-descendant-chain heuristic rooted at `rootView`.
 */
- (nullable UIScrollView *)findContentScrollViewWithCachedScrollView:(nullable UIScrollView *)cachedScrollView
                                                       heuristicRoot:(nullable UIView *)rootView;

@end

NS_ASSUME_NONNULL_END
