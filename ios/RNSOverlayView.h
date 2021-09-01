#import <React/RCTView.h>
#import <React/RCTViewManager.h>

@interface RNSOverlayViewManager : RCTViewManager

@end

@interface RNSOverlayViewContainer : UIView

@end

@interface RNSOverlayView : RCTView

@property (nonatomic) BOOL shown;
@property (nonatomic) BOOL draggable;
@property (nonatomic) BOOL interceptTouches;

@end
