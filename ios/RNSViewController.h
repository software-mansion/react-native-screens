#pragma once

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>
#else
#endif

#import <React/RCTViewManager.h>
#import "RNSScreenContainer.h"

NS_ASSUME_NONNULL_BEGIN

@protocol RNSViewControllerDelegate

@end

@interface RNSViewController : UIViewController <RNSViewControllerDelegate>

- (UIViewController *)findActiveChildVC;

@end

NS_ASSUME_NONNULL_END
