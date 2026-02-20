#pragma once

#import "RNSDefines.h"
#import "RNSEnums.h"
#import "RNSReactBaseView.h"

#if defined(__cplusplus)

#import <cxxreact/ReactNativeVersion.h>

#endif // defined(__cplusplus)

NS_ASSUME_NONNULL_BEGIN

@interface RNSTabsBottomAccessoryContentComponentView : RNSReactBaseView

#if RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE && defined(__cplusplus) && REACT_NATIVE_VERSION_MINOR >= 82

@property (nonatomic) RNSTabsBottomAccessoryEnvironment environment;

#endif // RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE && defined(__cplusplus) && REACT_NATIVE_VERSION_MINOR >= 82
@end

NS_ASSUME_NONNULL_END
