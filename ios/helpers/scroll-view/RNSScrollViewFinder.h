#import <UIKit/UIKit.h>
#import "RNSContentScrollViewProviding.h"

@interface RNSScrollViewFinder : NSObject
/**
 * Searches for content ScrollView by traversing down the hierarchy using first subview, similar to UIKit behavior.
 * It will fail if:
 * - UIScrollView is not a first subview of view or one of its descendants in the hierarchy,
 * - if UIScrollView's parent is not yet attached.
 */
+ (nullable UIScrollView *)findContentScrollViewWithFirstDescendantsChain:(nullable UIView *)view;

/**
 * Looks for UIScrollView in a similar way to `findContentScrollViewWithFirstDescendantsChain`, until it finds
 * `RNSContentScrollViewProviding`. Then, it delegates the task to the provider, and returns the results. This can
 * overcome the problems of subviews' children not being mounted yet, or ScrollView being mounted at index different
 * than 0.
 *
 * Caveat: when traversing the hierarchy, we don't check for conformance to protocol,
 * but whether the view responds to `RNSContentScrollViewProviding.findContentScrollView`.
 * This doesn't place locks and is faster.
 */
+ (nullable UIScrollView *)findContentScrollViewWithDelegatingToProvider:(nullable UIView *)view;

@end
