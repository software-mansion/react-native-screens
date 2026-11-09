#pragma once

#import "RNSReactBaseView.h"
#import "RNSSheetContentWrapperDelegate.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSSheetContentWrapperComponentView : RNSReactBaseView

@property (nonatomic, weak, nullable) id<RNSSheetContentWrapperDelegate> delegate;

@end

NS_ASSUME_NONNULL_END
