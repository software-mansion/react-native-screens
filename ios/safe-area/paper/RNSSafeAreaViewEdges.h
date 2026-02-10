#pragma once

// Implementation adapted from `react-native-safe-area-context`:
// https://github.com/AppAndFlow/react-native-safe-area-context/tree/v5.6.1

#if !RCT_NEW_ARCH_ENABLED
typedef struct RNSSafeAreaViewEdges {
  BOOL top;
  BOOL right;
  BOOL bottom;
  BOOL left;
} RNSSafeAreaViewEdges;

RNSSafeAreaViewEdges
RNSSafeAreaViewEdgesMake(BOOL top, BOOL right, BOOL bottom, BOOL left);
#endif // !RCT_NEW_ARCH_ENABLED
