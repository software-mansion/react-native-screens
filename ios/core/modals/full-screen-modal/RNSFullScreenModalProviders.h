#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * Data source for the presentation of a full-screen modal. Implemented by the
 * modal's host; consumed by the pure-UIKit controller & manager.
 */
@protocol RNSFullScreenModalPresentationProvider <NSObject>

- (BOOL)isOpen;

/**
 * The view anchoring the modal in the presenter's hierarchy. Its window is the
 * one the modal is presented in.
 */
- (nullable UIView *)hostView;

@end

NS_ASSUME_NONNULL_END
