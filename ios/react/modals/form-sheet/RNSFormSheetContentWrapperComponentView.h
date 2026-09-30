#pragma once

#import "RNSFormSheetContentWrapperDelegate.h"
#import "RNSReactBaseView.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSFormSheetContentWrapperComponentView : RNSReactBaseView

@property (nonatomic, weak, nullable) id<RNSFormSheetContentWrapperDelegate> delegate;

@end

NS_ASSUME_NONNULL_END
