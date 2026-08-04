#pragma once

#import <UIKit/UIKit.h>

#import "RNSHeaderItemSpacerPlacement.h"

NS_ASSUME_NONNULL_BEGIN

@protocol RNSStackHeaderItemSpacerDataProviding <NSObject>

@property (nonatomic, readonly) RNSHeaderItemSpacerPlacement placement;
@property (nonatomic, readonly) BOOL isFlexible;
@property (nonatomic, readonly) CGFloat width;

@end

NS_ASSUME_NONNULL_END
