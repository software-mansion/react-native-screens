// Implementation adapted from `react-native-safe-area-context`:
// https://github.com/AppAndFlow/react-native-safe-area-context/tree/v5.6.1

#import <UIKit/UIKit.h>
#import "RNSReactBaseView.h"
#import "RNSSafeAreaViewEdges.h"

#if !RCT_NEW_ARCH_ENABLED
#import <React/RCTBridge.h>
#endif // !RCT_NEW_ARCH_ENABLED

NS_ASSUME_NONNULL_BEGIN

@interface RNSSafeAreaViewComponentView : RNSReactBaseView

#if !RCT_NEW_ARCH_ENABLED
- (instancetype)initWithBridge:(RCTBridge *)bridge;

@property (nonatomic, assign) RNSSafeAreaViewEdges edges;
#endif // !RCT_NEW_ARCH_ENABLED

@end

NS_ASSUME_NONNULL_END
