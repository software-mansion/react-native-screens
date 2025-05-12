#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface RNSTabBarController : UITabBarController

/**
 * Apply appearance to the tab bar managed by this controller.
 *
 * @param appearance passed appearance instance will be set for all appearance modes (standard, scrollview, etc.)
 * supported by the tab bar. When set to `nil` the default system appearance will be used.
 */
- (void)applyTabBarAppearance:(nullable UITabBarAppearance *)appearance;

@end

NS_ASSUME_NONNULL_END
