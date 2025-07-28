#import <UIKit/UIKit.h>
#import "RNSEnums.h"

NS_ASSUME_NONNULL_BEGIN

@protocol RNSTabBarAppearanceProvider

- (UITabBarAppearance *)tabBarStandardAppearance;
- (UITabBarAppearance *)tabBarScrollEdgeAppearance;

@end

NS_ASSUME_NONNULL_END
