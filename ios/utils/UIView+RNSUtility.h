#pragma once

#import <UIKit/UIKit.h>

@class RCTSurfaceTouchHandler;

NS_ASSUME_NONNULL_BEGIN

@interface UIView (RNSUtility)

- (nullable RCTSurfaceTouchHandler *)rnscreens_findTouchHandlerInAncestorChain;

@end

NS_ASSUME_NONNULL_END
