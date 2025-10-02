#import "RNSBottomTabsHostComponentView.h"
#import "RNSReactBaseView.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSBottomAccessoryHelper;

@interface RNSBottomTabsAccessoryComponentView : RNSReactBaseView

/**
 * If not null, the bottom accesory's helper that handles synchronization with ShadowNode.
 */
@property (nonatomic, strong, readonly, nullable) RNSBottomAccessoryHelper *helper;

/**
 * If not null, the bottom tabs host view that this accessory component view belongs to.
 */
@property (nonatomic, weak, nullable) RNSBottomTabsHostComponentView *reactSuperview;

@end

NS_ASSUME_NONNULL_END
