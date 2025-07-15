#import <UIKit/UIKit.h>

@interface RNSScrollViewHelper : NSObject

/**
 * Finds and overrides contentInsetAdjustmentBehavior for first ScrollView in first descendant chain from view.
 */
+ (void)overrideScrollViewBehaviorInFirstDescendantChainFrom:(nullable UIView *)view;

@end
