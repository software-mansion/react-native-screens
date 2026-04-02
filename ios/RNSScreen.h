#pragma once

#import <React/RCTComponent.h>
#import <React/RCTViewManager.h>

#import "RNSEnums.h"
#import "RNSSafeAreaProviding.h"
#import "RNSScreenContainer.h"
#import "RNSScreenContentWrapper.h"
#import "RNSScrollEdgeEffectApplicator.h"
#import "RNSScrollViewBehaviorOverriding.h"
#import "RNSViewInteractionManager.h"

#if !TARGET_OS_TV
#import "RNSOrientationProviding.h"
#endif // !TARGET_OS_TV

#import "RNSReactBaseView.h"

#if defined(__cplusplus)
namespace react = facebook::react;
#endif // __cplusplus

NS_ASSUME_NONNULL_BEGIN

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

@interface RNSScreen : UIViewController <
                           RNSViewControllerDelegate
#if !TARGET_OS_TV
                           ,
                           RNSOrientationProviding
#endif // !TARGET_OS_TV
                           >
- (instancetype)initWithView:(UIView *)view;
- (UIViewController *)findChildVCForConfigAndTrait:(RNSWindowTrait)trait includingModals:(BOOL)includingModals;
- (BOOL)hasNestedStack;
- (void)calculateAndNotifyHeaderHeightChangeIsModal:(BOOL)isModal;
- (void)notifyFinishTransitioning;
- (RNSScreenView *)screenView;
- (void)setViewToSnapshot;
- (CGFloat)calculateHeaderHeightIsModal:(BOOL)isModal;
- (BOOL)isRemovedFromParent;
- (void)notifyPresentedControllerDismissed;

@end

@class RNSScreenStackHeaderConfig;

@interface RNSScreenView : RNSReactBaseView <
                               RNSScreenContentWrapperDelegate,
                               RNSScrollViewBehaviorOverriding,
                               RNSSafeAreaProviding,
                               RNSScrollEdgeEffectProviding>

/**
 * This is value of the prop as passed by the user. To get effective value see derived property
 * `isFullScreenSwipeEffectivelyEnabled`
 */
@property (nonatomic) RNSOptionalBoolean fullScreenSwipeEnabled;
@property (nonatomic, readonly, getter=isFullScreenSwipeEffectivelyEnabled) BOOL fullScreenSwipeEffectivelyEnabled;

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
@property (nonatomic) RNSScrollEdgeEffect bottomScrollEdgeEffect;
@property (nonatomic) RNSScrollEdgeEffect leftScrollEdgeEffect;
@property (nonatomic) RNSScrollEdgeEffect rightScrollEdgeEffect;
@property (nonatomic) RNSScrollEdgeEffect topScrollEdgeEffect;
@property (nonatomic, readwrite) BOOL synchronousShadowStateUpdatesEnabled;

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

#if defined(__cplusplus)
@property (nonatomic) react::LayoutMetrics oldLayoutMetrics;
@property (nonatomic) react::LayoutMetrics newLayoutMetrics;
#endif // __cplusplus
@property (weak, nonatomic) RNSScreenStackHeaderConfig *config;
@property (nonatomic, readonly) BOOL hasHeaderConfig;
@property (nonatomic, readonly, getter=isMarkedForUnmountInCurrentTransaction)
    BOOL markedForUnmountInCurrentTransaction;

/**
 * Whether the snapshot for the transition made for JS-popped views should be taken after view updates or not.
 * *This property was introduced for the sake of integration with reanimated.*
 */
@property (nonatomic) BOOL snapshotAfterUpdates;

- (void)notifyFinishTransitioning;
- (void)notifyHeaderHeightChange:(double)height;

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

- (void)notifyTransitionProgress:(double)progress closing:(BOOL)closing goingForward:(BOOL)goingForward;
- (void)notifyDismissCancelledWithDismissCount:(int)dismissCount;
- (BOOL)isModal;
- (BOOL)isPresentedAsNativeModal;

/**
 * Holds a shared instance to a service that finds the view that needs to have interactions disabled for stack to not
 * have multiple screen transitions at once.
 */
+ (RNSViewInteractionManager *)viewInteractionManagerInstance;

/**
 * Tell `Screen` component that it has been removed from react state and can safely cleanup
 * any retained resources.
 */
- (void)invalidateImpl;

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
