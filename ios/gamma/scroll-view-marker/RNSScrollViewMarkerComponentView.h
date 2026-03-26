#pragma once

#import "RNSReactBaseView.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSScrollViewMarkerComponentView : RNSReactBaseView

@property (nonatomic, readonly, getter=isActive) BOOL active;

@end

NS_ASSUME_NONNULL_END
