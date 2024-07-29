#import <React/RCTComponent.h>
#import <React/RCTViewManager.h>

#import "RNSEnums.h"
#import "RNSScreenContainer.h"

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
- (void)setViewToSnapshot:(UIView *)snapshot;
- (CGFloat)calculateHeaderHeightIsModal:(BOOL)isModal;
#endif

@end

@interface UIView (RNSScreen)
- (UIViewController *)parentViewController;
@end

@interface RNSScreenManager : RCTViewManager

@end

NS_ASSUME_NONNULL_END
