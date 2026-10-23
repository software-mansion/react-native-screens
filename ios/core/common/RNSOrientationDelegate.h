#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * Receives orientation update requests from a container.
 *
 * A container calls it when the orientation it supports may have changed, e.g. after the selected tab or the
 * orientation prop changed. The delegate decides how to enforce it; a container without a delegate does nothing.
 */
@protocol RNSOrientationDelegate <NSObject>

- (void)containerDidRequestOrientationUpdate:(UIViewController *)container;

@end

NS_ASSUME_NONNULL_END
