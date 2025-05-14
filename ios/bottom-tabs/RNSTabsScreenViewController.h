#import <UIKit/UIKit.h>
#import "RNSBottomTabsScreenComponentView.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSTabsScreenViewController : UIViewController

@property (nonatomic, strong, readonly, nullable) RNSBottomTabsScreenComponentView *tabScreenComponentView;

/**
 * Tell the controller that the tab screen it owns has got its react-props-focus changed.
 */
- (void)tabScreenFocusHasChanged;

@end

NS_ASSUME_NONNULL_END
