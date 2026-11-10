#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@protocol RNSSheetPresentationProvider <NSObject>

- (BOOL)isOpen;
- (nullable UIWindow *)hostWindow;

@end

@protocol RNSSheetAppearanceProvider <NSObject>

- (BOOL)prefersGrabberVisible;
- (CGFloat)preferredCornerRadius;
- (NSInteger)largestUndimmedDetentIndex;
- (nullable UIColor *)nativeContainerBackgroundColor;
- (nullable UIVisualEffect *)backgroundEffect;

@end

@protocol RNSSheetBehaviorProvider <NSObject>

/**
 * Detent fractions in strictly ascending order within [0, 1], or a single `kRNSSheetFitToContents`
 * (declared in `RNSSheetDetentResolver.h`). An empty array means the default large detent. Values that are out of
 * range or not ascending are logged as an error and replaced by the large detent.
 */
- (NSArray<NSNumber *> *)detents;
- (NSInteger)initialDetentIndex;
- (BOOL)prefersScrollingExpandsWhenScrolledToEdge;
- (BOOL)prefersEdgeAttachedInCompactHeight;
- (BOOL)preventNativeDismiss;
/**
 * Height of the sheet's content, used by the `kRNSSheetFitToContents` detent. A value of 0 or less means the
 * content has not been laid out yet; the detent then falls back to the maximum detent height.
 */
- (CGFloat)contentsHeight;

@end

NS_ASSUME_NONNULL_END
