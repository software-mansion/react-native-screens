#pragma once

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>
#else
#endif

#import <React/RCTViewManager.h>
#import "RNSScreenContainer.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSScreenContainerManager : RCTViewManager

@end

NS_ASSUME_NONNULL_END
