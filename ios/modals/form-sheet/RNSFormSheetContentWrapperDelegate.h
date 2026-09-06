#pragma once

#import <UIKit/UIKit.h>

@class RNSFormSheetContentWrapperComponentView;

NS_ASSUME_NONNULL_BEGIN

@protocol RNSFormSheetContentWrapperDelegate <NSObject>

- (void)contentWrapper:(RNSFormSheetContentWrapperComponentView *)wrapper
    didChangeReactContentsHeight:(CGFloat)reactContentsHeight;

@end

NS_ASSUME_NONNULL_END
