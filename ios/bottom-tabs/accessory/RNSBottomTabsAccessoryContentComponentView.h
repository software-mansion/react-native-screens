#import "RNSDefines.h"
#import "RNSEnums.h"
#import "RNSReactBaseView.h"

#if defined(__cplusplus)

#include <cxxreact/ReactNativeVersion.h>

#endif // defined(__cplusplus)

NS_ASSUME_NONNULL_BEGIN

@interface RNSBottomTabsAccessoryContentComponentView : RNSReactBaseView

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV && !TARGET_OS_VISION && defined(__cplusplus) && \
    REACT_NATIVE_VERSION_MINOR >= 82

@property (nonatomic) RNSBottomTabsAccessoryEnvironment environment;

#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV && !TARGET_OS_VISION && \
          defined(__cplusplus) && REACT_NATIVE_VERSION_MINOR >= 82
@end

NS_ASSUME_NONNULL_END
