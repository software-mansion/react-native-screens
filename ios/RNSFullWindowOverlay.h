#import <React/RCTViewManager.h>

#ifdef RNS_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>
#else
#import <React/RCTInvalidating.h>
#import <React/RCTView.h>
#endif

#ifdef RNS_NEW_ARCH_ENABLED
namespace react = facebook::react;
#endif // RNS_NEW_ARCH_ENABLED

@interface RNSFullWindowOverlayManager : RCTViewManager

@end

@interface RNSFullWindowOverlayContainer : UIView

@end

@interface RNSFullWindowOverlay :
#ifdef RNS_NEW_ARCH_ENABLED
    RCTViewComponentView
#else
    RCTView <RCTInvalidating>
#endif // RNS_NEW_ARCH_ENABLED

#ifdef RNS_NEW_ARCH_ENABLED
@property (nonatomic) react::LayoutMetrics oldLayoutMetrics;
@property (nonatomic) react::LayoutMetrics newLayoutMetrics;
#endif // RNS_NEW_ARCH_ENABLED

@end
