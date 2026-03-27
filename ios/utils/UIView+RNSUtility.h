#pragma once

#import <Foundation/Foundation.h>
#import <React/RCTSurfaceTouchHandler.h>

#define RNS_TOUCH_HANDLER_ARCH_TYPE RCTSurfaceTouchHandler

NS_ASSUME_NONNULL_BEGIN

@interface UIView (RNSUtility)

- (nullable RNS_TOUCH_HANDLER_ARCH_TYPE *)rnscreens_findTouchHandlerInAncestorChain;

@end

NS_ASSUME_NONNULL_END
