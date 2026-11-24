#pragma once

#import <UIKit/UIKit.h>

@class RNSContainedModalContextWrapperView;

NS_ASSUME_NONNULL_BEGIN

/**
 * Implemented by the provider component view. Lets the host component view
 * match a modal to its target provider by walking the superview chain.
 */
@protocol RNSContainedModalContextProviding <NSObject>

/// Identifies this provider (container). `nil` when unset.
- (nullable NSString *)containerId;

/// The core view that owns the presentation context to present from.
- (nonnull RNSContainedModalContextWrapperView *)contextWrapperView;

@end

NS_ASSUME_NONNULL_END
