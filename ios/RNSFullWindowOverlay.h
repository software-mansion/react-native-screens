#pragma once

#if defined(__cplusplus)
#import <React/RCTViewManager.h>
#endif // defined(__cplusplus)
#import "RNSReactBaseView.h"

#if defined(__cplusplus)
namespace react = facebook::react;
#endif // __cplusplus

#if defined(__cplusplus)
@interface RNSFullWindowOverlayManager : RCTViewManager
#else
@interface RNSFullWindowOverlayManager : NSObject
#endif // __cplusplus

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
