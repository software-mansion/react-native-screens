#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * This gesture recognizer is necessary to handle views placed in the navigation bar area on OS
 * versions where the system triggers "scroll to top" by tapping that area (iPadOS 26+ and iPhone
 * iOS 27+). Otherwise, tapping such a view results in a scroll to top action even if there is a
 * pressable inside it.
 */
@interface RNSScrollToTopGuardGestureRecognizer : UITapGestureRecognizer <UIGestureRecognizerDelegate>

/**
 * Returns YES on OS versions / device idioms where the system scroll-to-top-on-header interaction
 * exists (iPad: iOS 26+, iPhone: iOS 27+); NO otherwise.
 */
+ (BOOL)shouldGuardScrollToTop;

/**
 * Creates the scroll to top guard gesture recognizer and adds it to the given view.
 */
+ (void)applyToView:(UIView *)view;

@end

NS_ASSUME_NONNULL_END
