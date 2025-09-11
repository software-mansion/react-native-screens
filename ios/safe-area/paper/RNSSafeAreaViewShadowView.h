// Implementation adapted from `react-native-safe-area-context`:
// https://github.com/AppAndFlow/react-native-safe-area-context/blob/v5.6.1/ios/RNCSafeAreaShadowView.h

#if !RCT_NEW_ARCH_ENABLED
#import <React/RCTShadowView.h>

NS_ASSUME_NONNULL_BEGIN

@interface RNSSafeAreaViewShadowView : RCTShadowView

@end

NS_ASSUME_NONNULL_END
#endif // !RCT_NEW_ARCH_ENABLED
