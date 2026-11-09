#pragma once

#import <UIKit/UIKit.h>

@class RNSSheetContentWrapperComponentView;

NS_ASSUME_NONNULL_BEGIN

@protocol RNSSheetContentWrapperDelegate <NSObject>

- (void)contentWrapper:(RNSSheetContentWrapperComponentView *)wrapper
    didChangeReactContentsHeight:(CGFloat)reactContentsHeight;

@end

NS_ASSUME_NONNULL_END
