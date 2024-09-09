#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>
#else
#import <React/RCTUIManagerObserverCoordinator.h>
#import <React/RCTViewManager.h>
#endif

#import "RNSScreenContainer.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSSplitViewController : UISplitViewController <RNSViewControllerDelegate>

@end

@interface RNSScreenSplitView :
#ifdef RCT_NEW_ARCH_ENABLED
    RCTViewComponentView <RNSScreenContainerDelegate>
#else
    UIView <RNSScreenContainerDelegate, RCTInvalidating>
#endif

- (void)markChildUpdated;
- (void)didUpdateChildren;

@end

@interface RNSScreenSplitManager : RCTViewManager // <RCTInvalidating>

@end

NS_ASSUME_NONNULL_END
