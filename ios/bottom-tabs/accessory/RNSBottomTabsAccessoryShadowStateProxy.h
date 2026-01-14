#pragma once

#import "RNSBottomAccessoryHelper.h"

#if RNS_BOTTOM_ACCESSORY_AVAILABLE

NS_ASSUME_NONNULL_BEGIN

@class RNSBottomTabsAccessoryComponentView;

/**
 * @class RNSBottomTabsAccessoryShadowStateProxy
 * @brief Class responsible for communication with ShadowTree for
 * RNSBottomTabsAccessoryComponentView.
 */
API_AVAILABLE(ios(26.0))
@interface RNSBottomTabsAccessoryShadowStateProxy : NSObject

- (instancetype)initWithBottomAccessoryView:(RNSBottomTabsAccessoryComponentView *)bottomAccessoryView;

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

#endif // RNS_BOTTOM_ACCESSORY_AVAILABLE
