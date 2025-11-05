#include <cxxreact/ReactNativeVersion.h>
#import "RNSDefines.h"
#import "RNSEnums.h"
#import "RNSReactBaseView.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSBottomTabsAccessoryContentComponentView : RNSReactBaseView

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV && !TARGET_OS_VISION && RCT_NEW_ARCH_ENABLED && \
    REACT_NATIVE_VERSION_MINOR >= 82

@property (nonatomic) RNSBottomTabsAccessoryEnvironment environment;

#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV && !TARGET_OS_VISION && RCT_NEW_ARCH_ENABLED && \
          REACT_NATIVE_VERSION_MINOR >= 82

@end

NS_ASSUME_NONNULL_END
