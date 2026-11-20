#pragma once

#import "RNSReactBaseView.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSFullScreenModalHostComponentView : RNSReactBaseView

@end

#pragma mark - Props

@interface RNSFullScreenModalHostComponentView ()

@property (nonatomic, readonly) BOOL isOpen;

@end

NS_ASSUME_NONNULL_END
