#import <UIKit/UIKit.h>
#import "RNSBottomTabsScreenComponentView.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSTabsScreenViewController : UIViewController

@property (nonatomic, strong, readonly, nullable) RNSBottomTabsScreenComponentView *tabScreenComponentView;

- (void)onTabScreenFocusChanged:(BOOL)isFocused;

@end

NS_ASSUME_NONNULL_END
