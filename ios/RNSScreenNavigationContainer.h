#import <React/RCTViewManager.h>

#import "RNSScreenContainer.h"
#import "RNSScreenStack.h"

@interface RNScreensContainerNavigationController : RNScreensNavigationController

@end

@interface RNSScreenNavigationContainerView : UIView <RNSScreenContainerDelegate, RCTInvalidating>

- (void)markChildUpdated;

@end
