#pragma once

#import <UIKit/UIKit.h>
#import "RNSContentScrollViewProviding.h"

NS_ASSUME_NONNULL_BEGIN

@protocol RNSContainer;

/**
 * A single item hosted by an `RNSContainer` (e.g. a stack screen, a tab). An item may itself host
 * a single nested `RNSContainer` and exposes the content scroll view of its subtree via
 * `findContentScrollView` (inherited from `RNSContentScrollViewProviding`).
 *
 * On iOS the concept is implemented at the view-controller level: `RNSStackScreenController` and
 * `RNSTabsScreenViewController` conform to this protocol.
 */
@protocol RNSContainerItem <RNSContentScrollViewProviding>

#pragma mark - Nested Container handling

/**
 * A `RNSContainerItem` supports at most a single nested `RNSContainer`. Registering a second
 * container while one is already registered overwrites the previous one. This is an intentional
 * design invariant: a single item is expected to host at most one nested container.
 */
- (void)registerNestedContainer:(id<RNSContainer>)container;

- (void)unregisterNestedContainer:(id<RNSContainer>)container;

- (nullable id<RNSContainer>)resolveNestedContainer;

#pragma mark - Content Scroll View support

// `findContentScrollView` is inherited from `RNSContentScrollViewProviding`.

@end

NS_ASSUME_NONNULL_END
