#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@protocol RNSTabBarAppearanceProvider

-(UIColor *)tabBarBackgroundColor;
-(UIBlurEffect *)tabBarBlurEffect;
-(NSNumber *)tabBarItemTitleFontSize;
-(UIColor *)tabBarItemBadgeBackgroundColor;

@end

NS_ASSUME_NONNULL_END
