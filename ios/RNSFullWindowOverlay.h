#pragma once

#import <React/RCTViewManager.h>
#import "RNSReactBaseView.h"

#if defined(__cplusplus)
namespace react = facebook::react;
#endif // __cplusplus

@interface RNSFullWindowOverlayManager : RCTViewManager

@end

@interface RNSFullWindowOverlayContainer : UIView

@end

@interface RNSFullWindowOverlay : RNSReactBaseView

@property (nonatomic) BOOL accessibilityContainerViewIsModal;

#if defined(__cplusplus)
@property (nonatomic) react::LayoutMetrics oldLayoutMetrics;
@property (nonatomic) react::LayoutMetrics newLayoutMetrics;
#endif // __cplusplus

@end
