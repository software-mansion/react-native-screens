#pragma once

#import <UIKit/UIKit.h>
#import "RNSContentScrollViewProviding.h"

@interface RNSScrollViewFinder : NSObject

/**
 * Searches for content ScrollView by traversing down the hierarchy using first subview, similar to UIKit behavior.
 * It will fail if:
 * - UIScrollView is not a first subview of view or one of its descendants in the hierarchy,
 * - if UIScrollView's parent is not yet attached.
 *
 * When `view == nil`, it should also return `nil`.
 */
+ (nullable UIScrollView *)findScrollViewInFirstDescendantChainFrom:(nullable UIView *)view;

/**
 * Looks for UIScrollView in a similar way to `findScrollViewInFirstDescendantChainFrom`, until it finds
 * `RNSContentScrollViewProviding`. Then, it delegates the task to the provider, and returns the results. This can
 * overcome the problems of subviews' children not being mounted yet, or ScrollView being mounted at index different
 * than 0.
 *
 * When `view == nil`, it should also return `nil`.
 */
+ (nullable UIScrollView *)findContentScrollViewWithDelegatingToProvider:(nullable UIView *)view;

/**
 * Breadth-first search for the first vertically-scrollable UIScrollView
 * descendant. Unlike the first-descendant-chain walk, this finds scroll views
 * in real-world screen trees (styled wrapper views, headers, virtualized
 * lists such as FlashList/LegendList, nested stack navigators), which
 * UIKit's automatic content-scroll-view detection cannot reach.
 * Horizontal-only scrollers (e.g. carousels) are skipped, so behaviors driven
 * by the result (such as `tabBarMinimizeBehavior`) track vertical scrolling.
 * The search is bounded so a pathological tree cannot stall the main thread.
 *
 * When `view == nil`, it returns `nil`.
 */
+ (nullable UIScrollView *)findScrollViewBreadthFirstFrom:(nullable UIView *)view;

@end
