#pragma once

#import <React/RCTViewComponentView.h>
#import "RNSDefines.h"
#import "RNSEnums.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSTabsBottomAccessoryContentComponentView : RCTViewComponentView

#if RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE

@property (nonatomic, readonly) RNSTabsBottomAccessoryEnvironment environment;

#endif // RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE
@end

NS_ASSUME_NONNULL_END
