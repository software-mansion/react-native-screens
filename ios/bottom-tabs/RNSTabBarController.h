#import <UIKit/UIKit.h>
#import "RNSTabsScreenViewController.h"

NS_ASSUME_NONNULL_BEGIN

@protocol RNSReactTransactionObserving

- (void)reactTransactionWillMount;

- (void)reactTransactionDidMount;

@end

@interface RNSTabBarController : UITabBarController <RNSReactTransactionObserving>

@property (nonatomic, readwrite) bool needsContainerUpdateAfterReactTransaction;

/**
 * Apply appearance to the tab bar managed by this controller.
 *
 * @param appearance passed appearance instance will be set for all appearance modes (standard, scrollview, etc.)
 * supported by the tab bar. When set to `nil` the default system appearance will be used.
 */
- (void)applyTabBarAppearance:(nullable UITabBarAppearance *)appearance;

- (void)updateContainerWithChildViewControllers:(nonnull NSArray<RNSTabsScreenViewController *> *)childViewControllers;

@end

NS_ASSUME_NONNULL_END
