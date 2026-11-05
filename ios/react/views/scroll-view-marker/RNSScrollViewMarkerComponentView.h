#pragma once

#import "RNSReactBaseView.h"

NS_ASSUME_NONNULL_BEGIN

/**
 * Posted by a marker (the notification's object) on the main thread when the scroll view it wraps might
 * have changed: when the marker moves to or from a window, and when its child is mounted or unmounted.
 */
FOUNDATION_EXPORT NSNotificationName const RNSScrollViewMarkerDidChangeScrollViewNotification;

@interface RNSScrollViewMarkerComponentView : RNSReactBaseView

/**
 * The scroll view resolved from the marker's child, or `nil` when the child is not mounted.
 */
@property (nonatomic, readonly, nullable) UIScrollView *scrollView;

@end

NS_ASSUME_NONNULL_END
