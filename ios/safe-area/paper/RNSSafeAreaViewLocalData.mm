// Implementation adapted from `react-native-safe-area-context`:
// https://github.com/AppAndFlow/react-native-safe-area-context/blob/v5.6.1/ios/RNCSafeAreaViewLocalData.m
#if !RCT_NEW_ARCH_ENABLED

#import "RNSSafeAreaViewLocalData.h"

@implementation RNSSafeAreaViewLocalData

- (instancetype)initWithInsets:(UIEdgeInsets)insets edges:(RNSSafeAreaViewEdges)edges
{
  if (self = [super init]) {
    _insets = insets;
    _edges = edges;
  }

  return self;
}

@end

#endif // !RCT_NEW_ARCH_ENABLED
