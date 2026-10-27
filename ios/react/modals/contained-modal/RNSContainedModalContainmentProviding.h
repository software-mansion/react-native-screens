#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * Implemented by the provider component view. Lets the host component view
 * match a modal to its target provider by walking the superview chain.
 */
@protocol RNSContainedModalContainmentProviding <NSObject>

/// Identifies this provider (container). `nil` when unset.
- (nullable NSString *)containerId;

/// The provider's context view controller (`definesPresentationContext == YES`).
- (nonnull UIViewController *)contextViewController;

@end

NS_ASSUME_NONNULL_END
