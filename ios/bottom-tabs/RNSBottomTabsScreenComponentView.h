#import <React/RCTViewComponentView.h>

NS_ASSUME_NONNULL_BEGIN

@class RNSBottomTabsHostComponentView;

/**
 * Component view with react managed lifecycle. This view serves as root view in hierarchy
 * of a particular tab.
 */
@interface RNSBottomTabsScreenComponentView : RCTViewComponentView

/**
 * View controller responsible for managing tab represented by this component view.
 */
@property (nonatomic, strong, readonly, nullable) UIViewController *controller;

/**
 * If not null, the bottom tabs host view that this tab component view belongs to.
 */
@property (nonatomic, weak, nullable) RNSBottomTabsHostComponentView *reactSuperview;

@end

NS_ASSUME_NONNULL_END
