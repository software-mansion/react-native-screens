#pragma once

#import <React/RCTViewManager.h>
#import "RNSReactBaseView.h"

namespace react = facebook::react;

@interface RNSFullWindowOverlayManager : RCTViewManager

@end

@interface RNSFullWindowOverlayContainer : UIView

@end

@interface RNSFullWindowOverlay : RNSReactBaseView

@property (nonatomic) BOOL accessibilityContainerViewIsModal;

@property (nonatomic) react::LayoutMetrics oldLayoutMetrics;
@property (nonatomic) react::LayoutMetrics newLayoutMetrics;

@end
