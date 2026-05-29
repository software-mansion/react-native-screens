#pragma once

#import "RNSDefines.h"
#import "RNSEnums.h"
#import "RNSReactBaseView.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSTabsBottomAccessoryContentComponentView : RNSReactBaseView

#if RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE && defined(__cplusplus)

@property (nonatomic, readonly) RNSTabsBottomAccessoryEnvironment environment;

#endif // RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE && defined(__cplusplus)
@end

NS_ASSUME_NONNULL_END
