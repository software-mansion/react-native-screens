#pragma once

#import <Foundation/Foundation.h>
#import <React/RCTSurfaceTouchHandler.h>

NS_ASSUME_NONNULL_BEGIN

@interface UIView (RNSUtility)

- (nullable RCTSurfaceTouchHandler *)rnscreens_findTouchHandlerInAncestorChain;

@end

NS_ASSUME_NONNULL_END
