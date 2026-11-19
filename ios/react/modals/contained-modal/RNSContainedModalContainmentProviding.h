#pragma once

#import <UIKit/UIKit.h>

@class RNSContainedModalProviderView;

NS_ASSUME_NONNULL_BEGIN

/**
 * Implemented by the provider component view. Lets the host component view
 * match a modal to its target provider by walking the superview chain.
 */
@protocol RNSContainedModalContainmentProviding <NSObject>

/// Identifies this provider (container). `nil` when unset.
- (nullable NSString *)containerId;

/// The core view that owns the presentation context to present from.
- (nonnull RNSContainedModalProviderView *)providerView;

@end

NS_ASSUME_NONNULL_END
