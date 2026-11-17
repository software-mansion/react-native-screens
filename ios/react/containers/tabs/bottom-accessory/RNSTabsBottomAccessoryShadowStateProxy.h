#pragma once

#import "RNSTabsBottomAccessoryHelper.h"

#if RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE

NS_ASSUME_NONNULL_BEGIN

@class RNSTabsBottomAccessoryComponentView;

/**
 * @class RNSTabsBottomAccessoryShadowStateProxy
 * @brief Class responsible for communication with ShadowTree for
 * RNSTabsBottomAccessoryComponentView.
 */
API_AVAILABLE(ios(26.0))
@interface RNSTabsBottomAccessoryShadowStateProxy : NSObject

- (instancetype)initWithBottomAccessoryView:(RNSTabsBottomAccessoryComponentView *)bottomAccessoryView;

/**
 * Updates bottom accessory's frame in ShadowTree if new frame is different than previously sent frame.
 */
- (void)updateShadowStateWithFrame:(CGRect)frame;

/**
 * Resets internal properties.
 */
- (void)invalidate;

@end

NS_ASSUME_NONNULL_END

#endif // RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE
