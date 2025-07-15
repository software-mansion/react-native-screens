#import <React/RCTComponent.h>
#import <React/RCTViewManager.h>

#import "RNSEnums.h"
#import "RNSScreenContainer.h"
#import "RNSScreenContentWrapper.h"
#import "RNSScrollViewBehaviorOverriding.h"

#if RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>
#else
#import <React/RCTView.h>
#endif // RCT_NEW_ARCH_ENABLED

NS_ASSUME_NONNULL_BEGIN

#ifdef RCT_NEW_ARCH_ENABLED
namespace react = facebook::react;
#endif // RCT_NEW_ARCH_ENABLED

@interface RCTConvert (RNSScreen)

+ (RNSScreenStackPresentation)RNSScreenStackPresentation:(id)json;
+ (RNSScreenStackAnimation)RNSScreenStackAnimation:(id)json;

#if !TARGET_OS_TV
+ (RNSStatusBarStyle)RNSStatusBarStyle:(id)json;
+ (UIStatusBarAnimation)UIStatusBarAnimation:(id)json;
+ (UIInterfaceOrientationMask)UIInterfaceOrientationMask:(id)json;
#endif

@end

@class RNSScreenView;

@interface RNSScreen : UIViewController <RNSViewControllerDelegate>

- (instancetype)initWithView:(UIView *)view;
- (UIViewController *)findChildVCForConfigAndTrait:(RNSWindowTrait)trait includingModals:(BOOL)includingModals;
- (BOOL)hasNestedStack;
- (void)calculateAndNotifyHeaderHeightChangeIsModal:(BOOL)isModal;
- (void)notifyFinishTransitioning;
- (RNSScreenView *)screenView;
#ifdef RCT_NEW_ARCH_ENABLED
- (void)setViewToSnapshot;
- (CGFloat)calculateHeaderHeightIsModal:(BOOL)isModal;
#endif

@end

@class RNSScreenStackHeaderConfig;

@interface RNSScreenView :
#ifdef RCT_NEW_ARCH_ENABLED
    RCTViewComponentView
#else
    RCTView
#endif
    <RNSScreenContentWrapperDelegate, RNSScrollViewBehaviorOverriding>

@property (nonatomic) BOOL fullScreenSwipeEnabled;
@property (nonatomic) BOOL fullScreenSwipeShadowEnabled;
@property (nonatomic) BOOL gestureEnabled;
@property (nonatomic) BOOL hasStatusBarHiddenSet;
@property (nonatomic) BOOL hasStatusBarStyleSet;
@property (nonatomic) BOOL hasStatusBarAnimationSet;
@property (nonatomic) BOOL hasHomeIndicatorHiddenSet;
@property (nonatomic) BOOL hasOrientationSet;
@property (nonatomic) RNSScreenStackAnimation stackAnimation;
@property (nonatomic) RNSScreenStackPresentation stackPresentation;
@property (nonatomic) RNSScreenSwipeDirection swipeDirection;
@property (nonatomic) RNSScreenReplaceAnimation replaceAnimation;

@property (nonatomic, retain) NSNumber *transitionDuration;
@property (nonatomic, readonly) BOOL dismissed;
@property (nonatomic) BOOL hideKeyboardOnSwipe;
@property (nonatomic) BOOL customAnimationOnSwipe;
@property (nonatomic) BOOL preventNativeDismiss;
@property (nonatomic, retain) RNSScreen *controller;
@property (nonatomic, copy) NSDictionary *gestureResponseDistance;
@property (nonatomic) int activityState;
@property (nonatomic, nullable) NSString *screenId;
@property (weak, nonatomic) UIView<RNSScreenContainerDelegate> *reactSuperview;

#if !TARGET_OS_TV
@property (nonatomic) RNSStatusBarStyle statusBarStyle;
@property (nonatomic) UIStatusBarAnimation statusBarAnimation;
@property (nonatomic) UIInterfaceOrientationMask screenOrientation;
@property (nonatomic) BOOL statusBarHidden;
@property (nonatomic) BOOL homeIndicatorHidden;

// Props controlling UISheetPresentationController
@property (nonatomic) NSArray<NSNumber *> *sheetAllowedDetents;
@property (nonatomic) NSNumber *sheetLargestUndimmedDetent;
@property (nonatomic) BOOL sheetGrabberVisible;
@property (nonatomic) CGFloat sheetCornerRadius;
@property (nonatomic) NSInteger sheetInitialDetent;
@property (nonatomic) BOOL sheetExpandsWhenScrolledToEdge;
#endif // !TARGET_OS_TV

#ifdef RCT_NEW_ARCH_ENABLED
// we recreate the behavior of `reactSetFrame` on new architecture
@property (nonatomic) react::LayoutMetrics oldLayoutMetrics;
@property (nonatomic) react::LayoutMetrics newLayoutMetrics;
@property (weak, nonatomic) RNSScreenStackHeaderConfig *config;
@property (nonatomic, readonly) BOOL hasHeaderConfig;
@property (nonatomic, readonly, getter=isMarkedForUnmountInCurrentTransaction)
    BOOL markedForUnmountInCurrentTransaction;
#else
@property (nonatomic, copy) RCTDirectEventBlock onAppear;
@property (nonatomic, copy) RCTDirectEventBlock onDisappear;
@property (nonatomic, copy) RCTDirectEventBlock onDismissed;
@property (nonatomic, copy) RCTDirectEventBlock onHeaderHeightChange;
@property (nonatomic, copy) RCTDirectEventBlock onWillAppear;
@property (nonatomic, copy) RCTDirectEventBlock onWillDisappear;
@property (nonatomic, copy) RCTDirectEventBlock onNativeDismissCancelled;
@property (nonatomic, copy) RCTDirectEventBlock onTransitionProgress;
@property (nonatomic, copy) RCTDirectEventBlock onGestureCancel;
@property (nonatomic, copy) RCTDirectEventBlock onSheetDetentChanged;
#endif // RCT_NEW_ARCH_ENABLED

- (void)notifyFinishTransitioning;
- (void)notifyHeaderHeightChange:(double)height;

#ifdef RCT_NEW_ARCH_ENABLED
- (void)notifyWillAppear;
- (void)notifyWillDisappear;
- (void)notifyAppear;
- (void)notifyDisappear;
- (void)updateBounds;
- (void)notifyDismissedWithCount:(int)dismissCount;
- (instancetype)initWithFrame:(CGRect)frame;

/**
 * Tell `Screen` that it will be unmounted in next transaction.
 * The component needs this so that we can later decide whether to
 * replace it with snapshot or not.
 */
- (void)willBeUnmountedInUpcomingTransaction;
#else
- (instancetype)initWithBridge:(RCTBridge *)bridge;
#endif // RCT_NEW_ARCH_ENABLED

- (void)notifyTransitionProgress:(double)progress closing:(BOOL)closing goingForward:(BOOL)goingForward;
- (void)notifyDismissCancelledWithDismissCount:(int)dismissCount;
- (BOOL)isModal;
- (BOOL)isPresentedAsNativeModal;

/**
 * Tell `Screen` component that it has been removed from react state and can safely cleanup
 * any retained resources.
 *
 * Note, that on old architecture this method might be called by RN via `RCTInvalidating` protocol.
 */
- (void)invalidate;

/**
 * Looks for header configuration in instance's `reactSubviews` and returns it. If not present returns `nil`.
 */
- (RNSScreenStackHeaderConfig *_Nullable)findHeaderConfig;

/**
 * Returns `YES` if the wrapper has been registered and it should not attempt to register on screen views higher in the
 * tree.
 */
- (BOOL)registerContentWrapper:(nonnull RNSScreenContentWrapper *)contentWrapper contentHeightErrata:(float)errata;

@end

@interface UIView (RNSScreen)
- (UIViewController *)parentViewController;
@end

@interface RNSScreenManager : RCTViewManager

@end

NS_ASSUME_NONNULL_END
