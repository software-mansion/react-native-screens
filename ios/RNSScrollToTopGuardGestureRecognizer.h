#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * This gesture recognizer is necessary to handle header subviews with custom view
 * on iPadOS 26+. Otherwise, clicking a custom view will result in scroll to top action even if
 * there is a pressable inside the custom view.
 */
@interface RNSScrollToTopGuardGestureRecognizer : UITapGestureRecognizer <UIGestureRecognizerDelegate>

/**
 * This method creates and adds the scroll to top guard gesture recognizer on iPadOS 26+.
 * Otherwise, it is a no-op.
 */
+ (void)applyToViewIfNecessary:(UIView *)view;

@end

NS_ASSUME_NONNULL_END
