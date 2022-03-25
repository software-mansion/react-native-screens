#import <UIKit/UIKit.h>

#import <React/RCTViewComponentView.h>

#import "RNSEnums.h"
#import "RNSScreenController.h"

NS_ASSUME_NONNULL_BEGIN

@interface RCTConvert (RNSScreenComponentView)

#if !TARGET_OS_TV
+ (RNSStatusBarStyle)RNSStatusBarStyle:(id)json;
+ (UIStatusBarAnimation)UIStatusBarAnimation:(id)json;
+ (UIInterfaceOrientationMask)UIInterfaceOrientationMask:(id)json;
#endif

@end

@interface RNSScreenComponentView : RCTViewComponentView

@property (weak, nonatomic) UIView *reactSuperview;
@property (weak, nonatomic) UIView *config;
@property (nonatomic, retain) RNSScreenController *controller;

@property (nonatomic) BOOL fullScreenSwipeEnabled;
@property (nonatomic) BOOL gestureEnabled;
@property (nonatomic) BOOL hasStatusBarHiddenSet;
@property (nonatomic) BOOL hasStatusBarStyleSet;
@property (nonatomic) BOOL hasStatusBarAnimationSet;
@property (nonatomic) BOOL hasHomeIndicatorHiddenSet;
@property (nonatomic) BOOL hasOrientationSet;
@property (nonatomic) RNSScreenSwipeDirection swipeDirection;

#if !TARGET_OS_TV
@property (nonatomic) BOOL statusBarHidden;
@property (nonatomic) BOOL homeIndicatorHidden;
@property (nonatomic) RNSStatusBarStyle statusBarStyle;
@property (nonatomic) UIInterfaceOrientationMask screenOrientation;
@property (nonatomic) UIStatusBarAnimation statusBarAnimation;
#endif

- (void)notifyWillAppear;
- (void)notifyWillDisappear;
- (void)notifyAppear;
- (void)notifyDisappear;
- (void)updateBounds;
- (void)notifyDismissedWithCount:(int)dismissCount;

@end

NS_ASSUME_NONNULL_END
