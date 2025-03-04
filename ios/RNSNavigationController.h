#pragma once

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>
#else
#import <React/RCTUIManagerObserverCoordinator.h>
#import <React/RCTViewManager.h>
#endif

#import "RNSScreenContainer.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSNavigationController : UINavigationController <RNSViewControllerDelegate>

@end

NS_ASSUME_NONNULL_END
