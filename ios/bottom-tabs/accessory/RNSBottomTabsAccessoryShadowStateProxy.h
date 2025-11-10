#import "RNSBottomAccessoryHelper.h"

#define BOTTOM_ACCESSORY_AVAILABLE RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV && !TARGET_OS_VISION

#if BOTTOM_ACCESSORY_AVAILABLE

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

#endif // BOTTOM_ACCESSORY_AVAILABLE

#undef BOTTOM_ACCESSORY_AVAILABLE
