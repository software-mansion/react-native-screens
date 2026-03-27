#pragma once

#import <React/RCTViewManager.h>

#if defined(__cplusplus)
#import <React/RCTViewComponentView.h>

namespace react = facebook::react;
#endif // __cplusplus

@interface RNSFullWindowOverlayManager : RCTViewManager

@end

@interface RNSFullWindowOverlayContainer : UIView

@end

#if defined(__cplusplus)
@interface RNSFullWindowOverlay : RCTViewComponentView
#else
@interface RNSFullWindowOverlay : UIView
#endif // __cplusplus

@property (nonatomic) BOOL accessibilityContainerViewIsModal;

#if defined(__cplusplus)
@property (nonatomic) react::LayoutMetrics oldLayoutMetrics;
@property (nonatomic) react::LayoutMetrics newLayoutMetrics;
#endif // __cplusplus

@end
