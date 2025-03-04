#pragma once

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>
#else
#import <React/RCTUIManagerObserverCoordinator.h>
#import <React/RCTViewManager.h>
#endif

#import "RNSNavigationController.h"
#import "RNSScreenContainer.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSScreenStackView;

@interface RNSScreenStackManager : RCTViewManager <RCTInvalidating>

@end

NS_ASSUME_NONNULL_END
