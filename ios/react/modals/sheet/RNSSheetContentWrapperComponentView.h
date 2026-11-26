#pragma once

#import "RNSReactBaseView.h"
#import "RNSSheetContentWrapperDelegate.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSSheetContentWrapperComponentView : RNSReactBaseView

@property (nonatomic, weak, nullable) id<RNSSheetContentWrapperDelegate> delegate;

/**
 * Call this method to notify the delegate with the most recent contents height set by React.
 */
- (void)triggerDelegateUpdate;

@end

NS_ASSUME_NONNULL_END
