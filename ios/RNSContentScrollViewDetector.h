#pragma once

#import "ContentScrollViewConsumer.h"
#import "RNSReactBaseView.h"
#import "RNSScrollViewFinder.h"

#if !RCT_NEW_ARCH_ENABLED
#import <React/RCTViewManager.h>
#endif // !RCT_NEW_ARCH_ENABLED

NS_ASSUME_NONNULL_BEGIN

@interface RNSContentScrollViewDetector :
#ifdef RCT_NEW_ARCH_ENABLED
    RCTViewComponentView
#else
    UIView
#endif

- (UIScrollView *)findContentScrollView;

- (void)registerContentScrollViewInHierarchy;

- (void)unregisterContentScrollViewInHierarchy;

@end

#if !RCT_NEW_ARCH_ENABLED

@interface RNSContentScrollViewDetectorViewManager : RCTViewManager
@end

#endif // !RCT_NEW_ARCH_ENABLED

NS_ASSUME_NONNULL_END
