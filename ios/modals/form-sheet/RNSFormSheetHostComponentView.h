#pragma once

#import "RNSReactBaseView.h"

#import <vector>

NS_ASSUME_NONNULL_BEGIN

@interface RNSFormSheetHostComponentView : RNSReactBaseView

@end

#pragma mark - Props

@interface RNSFormSheetHostComponentView ()

- (const std::vector<double> &)detents;

@property (nonatomic, readonly) BOOL isOpen;
@property (nonatomic, readonly) BOOL prefersGrabberVisible;
@property (nonatomic, readonly) CGFloat preferredCornerRadius;
@property (nonatomic, readonly) NSInteger largestUndimmedDetentIndex;
@property (nonatomic, readonly) NSInteger initialDetentIndex;
@property (nonatomic, readonly) BOOL prefersScrollingExpandsWhenScrolledToEdge;
@property (nonatomic, readonly) BOOL preventNativeDismiss;
@property (nonatomic, readonly, nullable) UIColor *nativeContainerBackgroundColor;

@end

NS_ASSUME_NONNULL_END
