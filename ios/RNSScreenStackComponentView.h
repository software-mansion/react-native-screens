#ifdef RN_FABRIC_ENABLED
#import <UIKit/UIKit.h>

#import <React/RCTViewComponentView.h>
#import "RNSScreenContainer.h"

NS_ASSUME_NONNULL_BEGIN
@interface RNScreensNavigationController : UINavigationController <RNScreensViewControllerDelegate>

@end

@interface RNSScreenStackComponentView : RCTViewComponentView

@end

NS_ASSUME_NONNULL_END

#endif // RN_FABRIC_ENABLED
