#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * Data source for the presentation of a contained modal. Implemented by the
 * modal's host; consumed by the pure-UIKit controller & manager.
 */
@protocol RNSContainedModalPresentationProvider <NSObject>

- (BOOL)isOpen;
- (nullable UIWindow *)hostWindow;

/**
 * The matched provider's context view controller to present from. Matching a
 * modal to its provider is the host's concern; core only receives the resolved
 * controller through this accessor.
 */
- (nullable UIViewController *)presentationSourceViewController;

@end

NS_ASSUME_NONNULL_END
