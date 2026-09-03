#pragma once

#import <React/RCTViewComponentView.h>
#import <React/RCTViewManager.h>

namespace react = facebook::react;

@interface RNSFullWindowOverlayManager : RCTViewManager

@end

@interface RNSFullWindowOverlayContainer : UIView

@end

@interface RNSFullWindowOverlay : RCTViewComponentView

@property (nonatomic) BOOL accessibilityContainerViewIsModal;

@property (nonatomic) react::LayoutMetrics oldLayoutMetrics;
@property (nonatomic) react::LayoutMetrics newLayoutMetrics;

@end
