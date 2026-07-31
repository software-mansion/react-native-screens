#pragma once

#if defined(__cplusplus)
#import <React/RCTViewManager.h>
#endif // __cplusplus

#import "RNSScreenContainer.h"
#import "RNSScreenStack.h"

@interface RNSContainerNavigationController : RNSNavigationController

@end

@interface RNSScreenNavigationContainerView : RNSScreenContainerView

@end

@interface RNSScreenNavigationContainerManager : RNSScreenContainerManager

@end
