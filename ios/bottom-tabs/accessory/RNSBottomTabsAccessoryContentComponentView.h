#import "RNSDefines.h"
#import "RNSEnums.h"
#import "RNSReactBaseView.h"

#if defined(__cplusplus)

#import <cxxreact/ReactNativeVersion.h>

#endif // defined(__cplusplus)

#define BOTTOM_ACCESSORY_AVAILABLE RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV && !TARGET_OS_VISION

NS_ASSUME_NONNULL_BEGIN

@interface RNSBottomTabsAccessoryContentComponentView : RNSReactBaseView

#if BOTTOM_ACCESSORY_AVAILABLE && defined(__cplusplus) && REACT_NATIVE_VERSION_MINOR >= 82

@property (nonatomic) RNSBottomTabsAccessoryEnvironment environment;

#endif // BOTTOM_ACCESSORY_AVAILABLE && defined(__cplusplus) && REACT_NATIVE_VERSION_MINOR >= 82
@end

NS_ASSUME_NONNULL_END

#undef BOTTOM_ACCESSORY_AVAILABLE
