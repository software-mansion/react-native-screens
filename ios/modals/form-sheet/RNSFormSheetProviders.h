#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@protocol RNSFormSheetPresentationProvider <NSObject>

- (BOOL)isOpen;
- (nullable UIWindow *)hostWindow;

@end

@protocol RNSFormSheetAppearanceProvider <NSObject>

- (BOOL)prefersGrabberVisible;
- (CGFloat)preferredCornerRadius;
- (NSInteger)largestUndimmedDetentIndex;
- (nullable UIColor *)nativeContainerBackgroundColor;

@end

@protocol RNSFormSheetBehaviorProvider <NSObject>

/**
 * Detent fractions in strictly ascending order within [0, 1], or a single `kRNSFormSheetFitToContents`
 * (declared in `RNSFormSheetDetentResolver.h`). An empty array means the default large detent. Values that are out of
 * range or not ascending are logged as an error and replaced by the large detent.
 */
- (NSArray<NSNumber *> *)detents;
- (NSInteger)initialDetentIndex;
- (BOOL)prefersScrollingExpandsWhenScrolledToEdge;
- (BOOL)preventNativeDismiss;
/**
 * Height of the sheet's content, used by the `kRNSFormSheetFitToContents` detent. A value of 0 or less means the
 * content has not been laid out yet; the detent then falls back to the maximum detent height.
 */
- (CGFloat)contentsHeight;

@end

NS_ASSUME_NONNULL_END
