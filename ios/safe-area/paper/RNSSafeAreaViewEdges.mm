// Implementation adapted from `react-native-safe-area-context`:
// https://github.com/AppAndFlow/react-native-safe-area-context/tree/v5.6.1

#import "RNSSafeAreaViewEdges.h"

#if !RCT_NEW_ARCH_ENABLED
#import <React/RCTConvert.h>

RNSSafeAreaViewEdges RNSSafeAreaViewEdgesMake(BOOL top, BOOL right, BOOL bottom, BOOL left)
{
  RNSSafeAreaViewEdges edges;
  edges.top = top;
  edges.left = left;
  edges.bottom = bottom;
  edges.right = right;
  return edges;
}

RNSSafeAreaViewEdges RNSSafeAreaViewEdgesMakeString(NSString *top, NSString *right, NSString *bottom, NSString *left)
{
  RNSSafeAreaViewEdges edges;
  edges.top = [RCTConvert BOOL:top];
  edges.right = [RCTConvert BOOL:right];
  edges.bottom = [RCTConvert BOOL:bottom];
  edges.left = [RCTConvert BOOL:left];
  return edges;
}

@implementation RCTConvert (RNSSafeAreaViewEdges)

RCT_CUSTOM_CONVERTER(
    RNSSafeAreaViewEdges,
    RNSSafeAreaViewEdges,
    RNSSafeAreaViewEdgesMakeString(json[@"top"], json[@"right"], json[@"bottom"], json[@"left"]))

@end
#endif // !RCT_NEW_ARCH_ENABLED
