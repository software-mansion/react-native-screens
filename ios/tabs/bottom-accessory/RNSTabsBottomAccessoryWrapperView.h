#pragma once

#import <UIKit/UIKit.h>
#import "RNSDefines.h"

#if RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE

NS_ASSUME_NONNULL_BEGIN

/**
 * @class RNSTabsBottomAccessoryWrapperView
 * @brief Content view of UITabAccessory, wraps RNSTabsBottomAccessoryComponentView.
 *
 * It is a plain UIView (not RCTViewComponentView) to maintain native corner radius
 * and it answers UIKit's size queries so that the accessory takes full available width.
 */
API_AVAILABLE(ios(26.0))
@interface RNSTabsBottomAccessoryWrapperView : UIView

@end

NS_ASSUME_NONNULL_END

#endif // RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE
