#pragma once

#import "RNSReactBaseView.h"
#import "RNSStackHeaderItemInvalidationDelegate.h"
#import "RNSStackHeaderItemSpacerDataProviding.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackHeaderItemSpacerComponentView : RNSReactBaseView <RNSStackHeaderItemSpacerDataProviding>

@property (nonatomic, readonly) RNSHeaderItemSpacerPlacement placement;
@property (nonatomic, readonly) BOOL isFlexible;
@property (nonatomic, readonly) CGFloat width;

@property (nonatomic, weak, nullable) id<RNSStackHeaderItemInvalidationDelegate> invalidationDelegate;

@end

NS_ASSUME_NONNULL_END
