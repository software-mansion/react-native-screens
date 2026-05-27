#pragma once

#import <UIKit/UIKit.h>

#ifdef __cplusplus
#include <vector>
#endif

NS_ASSUME_NONNULL_BEGIN

@protocol RNSFormSheetPresentationProvider <NSObject>

- (BOOL)isOpen;
- (nullable UIWindow *)hostWindow;

@end

@protocol RNSFormSheetAppearanceProvider <NSObject>

- (BOOL)prefersGrabberVisible;
- (CGFloat)preferredCornerRadius;
- (NSInteger)largestUndimmedDetentIndex;

@end

@protocol RNSFormSheetBehaviorProvider <NSObject>

#ifdef __cplusplus
- (const std::vector<double> &)detents;
#endif
- (NSInteger)initialDetentIndex;
- (BOOL)prefersScrollingExpandsWhenScrolledToEdge;
- (BOOL)preventNativeDismiss;

@end

NS_ASSUME_NONNULL_END
