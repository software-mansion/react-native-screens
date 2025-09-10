// Implementation adapted from `react-native-safe-area-context`:
// https://github.com/AppAndFlow/react-native-safe-area-context/blob/v5.6.1/ios/Fabric/RNCSafeAreaViewComponentView.h

#import <UIKit/UIKit.h>
#import "RNSReactBaseView.h"
#import "RNSSafeAreaProviding.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSSafeAreaViewComponentView : RNSReactBaseView <RNSSafeAreaProviding>

@end

NS_ASSUME_NONNULL_END
