#pragma once

#import "RNSReactBaseView.h"

NS_ASSUME_NONNULL_BEGIN

/**
 * Backing native view for the experimental, iOS-only `ScrollToTopGuard` component. It wraps its
 * children and attaches an `RNSScrollToTopGuardGestureRecognizer` to itself on OS versions where
 * the system "scroll to top" navigation-bar interaction exists (iPadOS 26+, iPhone iOS 27+), so
 * that tapping the wrapped content does not scroll the underlying scroll view to top.
 */
@interface RNSScrollToTopGuard : RNSReactBaseView

@end

NS_ASSUME_NONNULL_END
