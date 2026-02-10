#pragma once

// Implementation adapted from `react-native-safe-area-context`:
// https://github.com/AppAndFlow/react-native-safe-area-context/tree/v5.6.1

#if !RCT_NEW_ARCH_ENABLED
#import <UIKit/UIKit.h>
#import "RNSSafeAreaViewEdges.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSSafeAreaViewLocalData : NSObject

- (instancetype)initWithInsets:(UIEdgeInsets)insets edges:(RNSSafeAreaViewEdges)edges;

@property (atomic, readonly) UIEdgeInsets insets;
@property (atomic, readonly) RNSSafeAreaViewEdges edges;

@end

NS_ASSUME_NONNULL_END
#endif // !RCT_NEW_ARCH_ENABLED
