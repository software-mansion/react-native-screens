#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface UIScrollView (RNScreens)
/**
 * Scrolls to top taking into account adjustedContentInset.
 * Returns true if scroll was necessary, false if ScrollView was already at the top.
 */
- (BOOL)rnscreens_scrollToTop;

@end

NS_ASSUME_NONNULL_END
