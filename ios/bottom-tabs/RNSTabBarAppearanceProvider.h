#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@protocol RNSTabBarAppearanceProvider

- (UIColor *)tabBarBackgroundColor;
- (UIBlurEffect *)tabBarBlurEffect;

- (NSString *)tabBarItemTitleFontFamily;
- (NSNumber *)tabBarItemTitleFontSize;
- (NSString *)tabBarItemTitleFontWeight;
- (NSString *)tabBarItemTitleFontStyle;
- (UIColor *)tabBarItemTitleFontColor;
- (UIOffset)tabBarItemTitlePositionAdjustment;

- (UIColor *)tabBarItemIconColor;

- (UIColor *)tabBarItemBadgeBackgroundColor;

@end

NS_ASSUME_NONNULL_END
