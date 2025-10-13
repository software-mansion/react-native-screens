// Implementation adapted from `react-native-safe-area-context`:
// https://github.com/AppAndFlow/react-native-safe-area-context/tree/v5.6.1

#if !RCT_NEW_ARCH_ENABLED
#import <React/RCTViewManager.h>

NS_ASSUME_NONNULL_BEGIN

@interface RNSSafeAreaViewManager : RCTViewManager

@end

NS_ASSUME_NONNULL_END
#endif // !RCT_NEW_ARCH_ENABLED
