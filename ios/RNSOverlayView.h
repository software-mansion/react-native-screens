#import <React/RCTInvalidating.h>
#import <React/RCTView.h>
#import <React/RCTViewManager.h>

@interface RNSOverlayViewManager : RCTViewManager

@end

@interface RNSOverlayViewContainer : UIView

@end

@interface RNSOverlayView : RCTView <RCTInvalidating>

@end
