#pragma once

@class RNSFormSheetContentWrapperComponentView;

NS_ASSUME_NONNULL_BEGIN

@protocol RNSFormSheetContentWrapperDelegate <NSObject>

- (void)contentWrapper:(RNSFormSheetContentWrapperComponentView *)wrapper didChangeContentHeight:(CGFloat)contentHeight;

@end

NS_ASSUME_NONNULL_END
