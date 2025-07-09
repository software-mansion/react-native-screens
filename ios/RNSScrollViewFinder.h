#import <UIKit/UIKit.h>

@interface RNSScrollViewFinder : NSObject

/**
 * Finds UIScrollView by traversing down the hierarchy using first subview, similar to UIKit behavior.
 * It will fail if:
 * - UIScrollView is not a first subview of view or one of its descendants in the hierarchy,
 * - if UIScrollView's parent is not yet attached.
 */
+ (nullable UIScrollView *)findScrollViewInFirstDescendantChainFrom:(nullable UIView *)view;

@end
