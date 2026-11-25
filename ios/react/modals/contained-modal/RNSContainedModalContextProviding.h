#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * Implemented by the views that provide a presentation context to contained
 * modals: the provider component view and the screen of a stack, which answers
 * for its stack. Lets the host component view match a modal to its target
 * provider by walking the superview chain.
 */
@protocol RNSContainedModalContextProviding <NSObject>

/// Identifies this provider (container). `nil` when unset.
- (nullable NSString *)containerId;

/// The provider's context controller (`definesPresentationContext == YES`).
/// `nil` when the provider has none to present from.
- (nullable UIViewController *)contextViewController;

@optional

#if DEBUG
/// Warns when the presentation container of `presentedView` (a content
/// controller's view) is not where the provider keeps it. Implemented by a
/// provider that owns the view the container is attached to.
- (void)validateContainmentOfPresentedView:(nullable UIView *)presentedView;
#endif

@end

NS_ASSUME_NONNULL_END
