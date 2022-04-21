#import <React/RCTComponent.h>
#import <React/RCTView.h>
#import <React/RCTViewManager.h>

#import "RNSEnums.h"
#import "RNSScreenContainer.h"

@interface RCTConvert (RNSScreen)

+ (RNSScreenStackPresentation)RNSScreenStackPresentation:(id)json;
+ (RNSScreenStackAnimation)RNSScreenStackAnimation:(id)json;

#if !TARGET_OS_TV
+ (RNSStatusBarStyle)RNSStatusBarStyle:(id)json;
+ (UIInterfaceOrientationMask)UIInterfaceOrientationMask:(id)json;
#endif

@end

@interface RNSScreen : UIViewController <RNScreensViewControllerDelegate>

- (instancetype)initWithView:(UIView *)view;
- (void)notifyFinishTransitioning;
- (UIViewController *)findChildVCForConfigAndTrait:(RNSWindowTrait)trait includingModals:(BOOL)includingModals;

@end

@interface RNSScreenManager : RCTViewManager

@end

@interface RNSScreenView : RCTView

@property (nonatomic, copy) RCTDirectEventBlock onAppear;
@property (nonatomic, copy) RCTDirectEventBlock onDisappear;
@property (nonatomic, copy) RCTDirectEventBlock onDismissed;
@property (nonatomic, copy) RCTDirectEventBlock onWillAppear;
@property (nonatomic, copy) RCTDirectEventBlock onWillDisappear;
@property (nonatomic, copy) RCTDirectEventBlock onNativeDismissCancelled;
@property (nonatomic, copy) RCTDirectEventBlock onTransitionProgress;

@property (weak, nonatomic) UIView<RNSScreenContainerDelegate> *reactSuperview;
@property (nonatomic, retain) UIViewController *controller;
@property (nonatomic, readonly) BOOL dismissed;
@property (nonatomic) int activityState;
@property (nonatomic) BOOL gestureEnabled;
@property (nonatomic) RNSScreenStackAnimation stackAnimation;
@property (nonatomic) RNSScreenStackPresentation stackPresentation;
@property (nonatomic) RNSScreenReplaceAnimation replaceAnimation;
@property (nonatomic) RNSScreenSwipeDirection swipeDirection;
@property (nonatomic) BOOL preventNativeDismiss;
@property (nonatomic) BOOL hasOrientationSet;
@property (nonatomic) BOOL hasStatusBarStyleSet;
@property (nonatomic) BOOL hasStatusBarAnimationSet;
@property (nonatomic) BOOL hasStatusBarHiddenSet;
@property (nonatomic) BOOL hasHomeIndicatorHiddenSet;
@property (nonatomic) BOOL customAnimationOnSwipe;
@property (nonatomic) BOOL fullScreenSwipeEnabled;
@property (nonatomic, copy) NSDictionary *gestureResponseDistance;
@property (nonatomic, retain) NSNumber *transitionDuration;
@property (nonatomic) BOOL hideKeyboardOnSwipe;

#if !TARGET_OS_TV
@property (nonatomic) RNSStatusBarStyle statusBarStyle;
@property (nonatomic) UIStatusBarAnimation statusBarAnimation;
@property (nonatomic) BOOL statusBarHidden;
@property (nonatomic) UIInterfaceOrientationMask screenOrientation;
@property (nonatomic) BOOL homeIndicatorHidden;
#endif

- (void)notifyFinishTransitioning;
- (void)notifyTransitionProgress:(double)progress closing:(BOOL)closing goingForward:(BOOL)goingForward;

@end

@interface UIView (RNSScreen)
- (UIViewController *)parentViewController;
@end
