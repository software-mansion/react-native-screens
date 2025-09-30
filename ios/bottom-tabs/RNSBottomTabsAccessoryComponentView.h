#import "RNSBottomTabsHostComponentView.h"
#import "RNSReactBaseView.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSBottomTabsAccessoryComponentView : RNSReactBaseView

/**
 * If not null, the bottom tabs host view that this accessory component view belongs to.
 */
@property (nonatomic, weak, nullable) RNSBottomTabsHostComponentView *reactSuperview;

@end

NS_ASSUME_NONNULL_END
