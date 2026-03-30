#pragma once

#import <UIKit/UIKit.h>

@interface RNSScrollViewHelper : NSObject

/**
 * Finds and overrides contentInsetAdjustmentBehavior for first ScrollView in first descendant chain from view.
 */
+ (void)overrideScrollViewBehaviorInFirstDescendantChainFrom:(nullable UIView *)view;

/**
 * Overrides contentInsetAdjustmentBehavior for a specific ScrollView instance.
 */
+ (void)overrideContentInsetAdjustmentBehaviorIfNeededForScrollView:(nullable UIScrollView *)scrollView;

@end
