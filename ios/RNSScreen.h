#pragma once

#import "RNSScreenUtils.h"

NS_ASSUME_NONNULL_BEGIN

#ifdef RCT_NEW_ARCH_ENABLED
namespace react = facebook::react;
#endif // RCT_NEW_ARCH_ENABLED

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

NS_ASSUME_NONNULL_END
