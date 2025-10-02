#import "RNSBottomTabsHostComponentView.h"
#import "RNSReactBaseView.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSBottomAccessoryViewController;

@interface RNSBottomTabsAccessoryComponentView : RNSReactBaseView

/**
 * View controller responsible for managing accessory represented by this component view.
 */
@property (nonatomic, strong, readonly, nullable) RNSBottomAccessoryViewController *controller;

/**
 * If not null, the bottom tabs host view that this accessory component view belongs to.
 */
@property (nonatomic, weak, nullable) RNSBottomTabsHostComponentView *reactSuperview;

@end

NS_ASSUME_NONNULL_END
