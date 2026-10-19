#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * Data source for the presentation of a contained modal. Implemented by the
 * host component view; consumed by the pure-UIKit controller & manager, which
 * must stay unaware of React types.
 */
@protocol RNSContainedModalPresentationProvider <NSObject>

- (BOOL)isOpen;
- (nullable UIWindow *)hostWindow;

/**
 * The matched provider's context view controller to present from. Provider
 * resolution is a react-layer concern; pure-UIKit code only receives the
 * resolved controller through this accessor.
 */
- (nullable UIViewController *)presentationSourceViewController;

@end

/**
 * Implemented by the provider component view. Lets the host component view
 * match a modal to its target provider by walking the superview chain, without
 * naming any component-view class in shared code.
 */
@protocol RNSContainedModalContainmentProviding <NSObject>

/// Identifies this provider (container). `nil` when unset.
- (nullable NSString *)containerId;

/// The provider's context view controller (`definesPresentationContext == YES`).
- (nonnull UIViewController *)contextViewController;

@end

NS_ASSUME_NONNULL_END
