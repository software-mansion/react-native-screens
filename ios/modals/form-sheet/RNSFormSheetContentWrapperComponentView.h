#pragma once

#import <React/RCTViewComponentView.h>
#import "RNSFormSheetContentWrapperDelegate.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSFormSheetContentWrapperComponentView : RCTViewComponentView

@property (nonatomic, weak, nullable) id<RNSFormSheetContentWrapperDelegate> delegate;

@end

NS_ASSUME_NONNULL_END
